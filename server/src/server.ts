import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

const MongoStore = connectMongo(session);
import connectDB from './config/db';
import contactRoutes from './routes/contactRoutes';
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import blogRoutes from './routes/blogRoutes';
import seoRoutes from './routes/seoRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@as-integrations/express5';
import http from 'http';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { createContext } from './graphql/context';
import compression from 'compression';
import helmet from 'helmet';

dotenv.config();

const app: Application = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to Database
connectDB();

// Trust proxy for actual client IP when deployed on Render/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(compression());
app.use(helmet({
    crossOriginResourcePolicy: false, // Ensure image uploads aren't blocked cross-origin
}));

// Serve uploaded images as static files
app.use('/uploads', express.static(require('path').join(process.cwd(), 'uploads')));

const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://savaj-seeds.vercel.app',
    'https://savajseeds.com',
    'https://www.savajseeds.com',
    process.env.CLIENT_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            console.error(`CORS Blocked: ${origin}`); // Helpful for debugging
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Session middleware — stores session data in MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        collection: 'sessions',
        ttl: 30 * 24 * 60 * 60, // 30 days in seconds
    }),
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? ('none' as const) : ('lax' as const),
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in ms
    },
    name: 'savaj.sid', // custom cookie name
}));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/blogs', blogRoutes);

// Dynamic Sitemap Route
app.use('/sitemap.xml', seoRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API and GraphQL Server is running...');
});

// Start Apollo Server & Express
const startServer = async () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: createContext,
        })
    );

    // Error Handling (Must be after GraphQL if we want it to apply to REST routes)
    app.use(notFound);
    app.use(errorHandler);

    httpServer.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
};

startServer();
