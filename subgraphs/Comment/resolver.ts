import { mockData, Comment } from "../mock-data";

// 1. Define the resolvers for the Comment subgraph
export const resolvers = {
  // 2. Define the Query resolver for the Comment type
  Query: {
    comment(_parent: any, args: { id: string }) {
      return mockData.find((comment) =>
        comment.comments?.find((c) => c.id === args.id),
      );
    },
  },
  // 3. Define the Comment type resolver
  Comment: {
    id(parent: Comment) {
      return parent.id;
    },
    createdAt(parent: Comment) {
      return parent.createdAt;
    },
    body(parent: Comment) {
      return parent.body;
    },
    link(parent: Comment) {
      return { __typename: "Link", id: parent.linkId };
    },
    // 4. Add this resolver for federation, to resolve the reference
    __resolveReference(parent: { id: string }) {
      return mockData.find((link) =>
        link.comments?.find((c) => c.id === parent.id),
      );
    },
  },
};
