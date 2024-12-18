import { Link, mockData } from "../mock-data";

export const resolvers = {
  Query: {
    feed() {
      return mockData;
    },
  },
  Link: {
    id: (parent: Link) => parent.id,
    createdAt: (parent: Link) => parent.createdAt,
    description: (parent: Link) => parent.description,
    url: (parent: Link) => parent.url,
    comments: (parent: Link) => parent.comments,
    // Add this resolver for federation
    __resolveReference(parent: { id: string }) {
      return mockData.find((link) => link.id === parent.id);
    },
  },
};
