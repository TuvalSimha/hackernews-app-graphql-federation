import { COMMENTS, LINKS, Link } from "../mock-data";

export const getCommentById = (id: string) =>
  COMMENTS.find((it) => it.id === id);

export const resolvers = {
  Query: {
    feed() {
      return LINKS;
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
      console.log("Link __resolveReference called with:", parent);
      const found = LINKS.find((link) => link.id === parent.id);
      console.log("Found link:", found);
      return found;
    },
  },
  Comment: {
    __resolveReference(ref: { id: string }) {
      console.log("Comment __resolveReference called with:", ref);
      const found = getCommentById(ref.id);
      console.log("Found comment:", found);
      return found;
    },
  },
};
