import Product from '../models/Product';
import Visitor from '../models/Visitor';
import Contact from '../models/Contact';
import { Context } from './context';

export const resolvers = {
    Query: {
        version: () => '1.0.0',
        getProducts: async () => {
            return await Product.find({});
        },
        getProductBySlug: async (_: any, { slug }: { slug: string }, context: Context) => {
            return await Product.findOne({ slug });
        },
        getFeaturedProducts: async (_: any, __: any, context: Context) => {
            return await Product.find({ featured: true });
        },
        getVisitors: async (_: any, __: any, context: Context) => {
            return await Visitor.find({}).sort({ visitedAt: -1 });
        },
        getContacts: async (_: any, __: any, context: Context) => {
            return await Contact.find({}).sort({ createdAt: -1 });
        },
    },
    Mutation: {
        trackVisitor: async (_: any, { ipAddress, userAgent, timeSpent }: { ipAddress: string, userAgent?: string, timeSpent?: number }, context: Context) => {
            const visitor = await Visitor.findOneAndUpdate(
                { ipAddress },
                {
                    $inc: { totalVisits: 1, totalTimeSpent: timeSpent || 0 },
                    userAgent,
                    visitedAt: new Date()
                },
                { new: true, upsert: true }
            );
            return visitor;
        },
        createContact: async (_: any, args: any, context: Context) => {
            const contact = new Contact({ ...args });
            return await contact.save();
        },
        markContactRead: async (_: any, { id }: { id: string }, context: Context) => {
            const contact = await Contact.findById(id);
            if (contact) {
                contact.isRead = true;
                return await contact.save();
            }
            throw new Error('Contact not found');
        }
    }
};
