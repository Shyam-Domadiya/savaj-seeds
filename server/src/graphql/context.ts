import { Request } from 'express';

export interface Context {
    req: Request;
    // You can add user, session, or dataSources here in the future
    // user?: any;
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
    return {
        req,
    };
};
