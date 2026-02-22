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
import visitorRoutes from './routes/visitorRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { ApolloServer } from '@apollo/server';
// @ts-ignore: expressMiddleware from @as-integrations/express5 is correctly typed
import { expressMiddleware } from '@as-integrations/express5';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to Database
connectDB();

// Trust proxy for actual client IP when deployed on Render/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://savaj-seeds.vercel.app',
    process.env.CLIENT_URL
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
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
        secure: isProduction,               // HTTPS only in production
        sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-origin (Vercel <-> Render)
        maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days in ms
    },
    name: 'savaj.sid', // custom cookie name
}));

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API and GraphQL Server is running...');
});

// Start Apollo Server & Express
const startServer = async () => {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: async ({ req }: { req: any }) => ({ req }),
        })
    );

    // Error Handling (Must be after GraphQL if we want it to apply to REST routes)
    app.use(notFound);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
};

startServer();
