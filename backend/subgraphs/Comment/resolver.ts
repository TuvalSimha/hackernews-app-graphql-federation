import { GraphQLContext } from "../../prisma";
import { GraphQLError } from "graphql";
import { Comment, Link } from "@prisma/client";
import {
  CommentResolvers,
  CommentSort,
} from "../../__generated__/types-resolver";

export const resolvers: CommentResolvers = {
  Query: {
    comment: (
      _parent: any,
      args: { id: Comment["id"] },
      context: GraphQLContext,
    ) => {
      return context.prisma.comment.findUnique({
        where: { id: args.id },
      });
    },

    postComments: (
      _parent: any,
      args: { linkId: Link["id"]; sort?: CommentSort },
      context: GraphQLContext,
    ) => {
      return context.prisma.comment.findMany({
        where: { linkId: args.linkId },
        orderBy: {
          createdAt: args.sort?.direction === "ASC" ? "asc" : "desc",
        },
      });
    },
  },

  Mutation: {
    addNewComment: async (
      _parent: any,
      args: { linkId: Link["id"]; text: string },
      context: GraphQLContext,
    ) => {
      const link = await context.prisma.link.findUnique({
        where: { id: args.linkId },
      });
      if (!link) {
        throw new GraphQLError("Link not found");
      }

      return context.prisma.comment.create({
        data: {
          body: args.text,
          link: {
            connect: { id: args.linkId },
          },
        },
      });
    },

    deleteComment: async (
      _parent: any,
      args: { commentId: Comment["id"] },
      context: GraphQLContext,
    ) => {
      const comment = await context.prisma.comment.findUnique({
        where: { id: args.commentId },
      });
      if (!comment) {
        throw new GraphQLError("Comment not found");
      }

      return context.prisma.comment.delete({
        where: { id: args.commentId },
      });
    },

    updateComment: async (
      _parent: any,
      args: { commentId: Comment["id"]; text: string },
      context: GraphQLContext,
    ) => {
      const comment = await context.prisma.comment.findUnique({
        where: { id: args.commentId },
      });
      if (!comment) {
        throw new GraphQLError("Comment not found");
      }

      return context.prisma.comment.update({
        where: { id: args.commentId },
        data: { body: args.text },
      });
    },
  },

  Comment: {
    __resolveReference: (
      reference: { id: Comment["id"] },
      context: GraphQLContext,
    ) => {
      return context.prisma.comment.findUnique({
        where: { id: reference.id },
      });
    },

    link: (
      parent: { linkId: Link["id"] },
      _args: any,
      _context: GraphQLContext,
    ) => {
      return { __typename: "Link", id: parent.linkId };
    },
  },
};
