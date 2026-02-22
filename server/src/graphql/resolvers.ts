import Product from '../models/Product';
import Visitor from '../models/Visitor';
import Contact from '../models/Contact';

export const resolvers = {
    Query: {
        version: () => '1.0.0',
        getProducts: async () => {
            return await Product.find({});
        },
        getProductBySlug: async (_: any, { slug }: { slug: string }) => {
            return await Product.findOne({ slug });
        },
        getFeaturedProducts: async () => {
            return await Product.find({ featured: true });
        },
        getVisitors: async () => {
            return await Visitor.find({}).sort({ visitedAt: -1 });
        },
        getContacts: async () => {
            return await Contact.find({}).sort({ createdAt: -1 });
        },
    },
    Mutation: {
        trackVisitor: async (_: any, { ipAddress, userAgent, timeSpent }: { ipAddress: string, userAgent?: string, timeSpent?: number }) => {
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
        createContact: async (_: any, args: any) => {
            const contact = new Contact({ ...args });
            return await contact.save();
        },
        markContactRead: async (_: any, { id }: { id: string }) => {
            const contact = await Contact.findById(id);
            if (contact) {
                contact.isRead = true;
                return await contact.save();
            }
            throw new Error('Contact not found');
        }
    }
};
