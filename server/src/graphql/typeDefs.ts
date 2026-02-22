export const typeDefs = `#graphql
  type ProductImage {
    url: String!
    altText: String
    isPrimary: Boolean
  }

  type GrowingGuideSection {
    title: String!
    content: String!
  }

  type GrowingGuide {
    title: String
    sections: [GrowingGuideSection!]
  }

  type SEOMetadata {
    title: String
    description: String
    keywords: [String!]
  }

  type Product {
    _id: ID!
    name: String!
    slug: String!
    description: String!
    longDescription: String
    category: String!
    cropName: String
    seedColor: String
    morphologicalCharacters: String
    flowerColor: String
    fruitShape: String
    plantHeight: String
    seasonality: [String!]!
    maturityTime: String
    yieldExpectation: String
    difficultyLevel: String
    images: [ProductImage!]!
    plantingInstructions: String
    careInstructions: String
    harvestingTips: String
    storageGuidance: String
    growingGuide: GrowingGuide
    availability: Boolean!
    featured: Boolean!
    pageViews: Int
    seoMetadata: SEOMetadata
    createdAt: String!
    updatedAt: String!
  }

  type Visitor {
    _id: ID!
    ipAddress: String!
    userAgent: String
    os: String
    browser: String
    device: String
    country: String
    city: String
    visitedAt: String!
    totalTimeSpent: Int
    readableDateStr: String
    readableTimeStr: String
    totalVisits: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Contact {
    _id: ID!
    name: String!
    email: String!
    phone: String
    category: String!
    subject: String!
    message: String!
    isRead: Boolean
    createdAt: String!
  }

  type Query {
    version: String!
    getProducts: [Product!]!
    getProductBySlug(slug: String!): Product
    getFeaturedProducts: [Product!]!
    
    getVisitors: [Visitor!]!
    
    getContacts: [Contact!]!
  }

  type Mutation {
    trackVisitor(ipAddress: String!, userAgent: String, timeSpent: Int): Visitor!
    createContact(name: String!, email: String!, phone: String, category: String!, subject: String!, message: String!): Contact!
    markContactRead(id: ID!): Contact!
  }
`;
