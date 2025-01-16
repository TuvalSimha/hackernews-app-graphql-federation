import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../prisma";
import { Link } from "@prisma/client";
import {
  LinkResolvers,
  PostSort,
  PostSortField,
  TimeRange,
} from "../../__generated__/types-resolver";

export const resolvers: LinkResolvers = {
  Query: {
    feed: async (
      _parent: any,
      args: { sort?: PostSort },
      context: GraphQLContext,
    ) => {
      const orderBy: any = {};
      if (args.sort) {
        switch (args.sort.field) {
          case PostSortField.CreatedAt:
            orderBy.createdAt = args.sort.direction?.toLocaleLowerCase();
            break;
          case PostSortField.Title:
            orderBy.title = args.sort.direction?.toLocaleLowerCase();
            break;
          case PostSortField.CommentCount:
            orderBy.comments = { _count: args.sort.direction?.toLowerCase() };
            break;
        }
      }

      return context.prisma.link.findMany({
        orderBy,
        include: {
          _count: {
            select: { comments: true },
          },
        },
      });
    },

    trendingPosts: async (
      _parent: any,
      args: { timeRange: TimeRange },
      context: GraphQLContext,
    ) => {
      const now = new Date();
      const timeRange = args.timeRange === TimeRange.Day ? 1 : 7;
      const date = new Date(now);
      date.setDate(now.getDate() - timeRange);

      return context.prisma.link.findMany({
        where: {
          createdAt: {
            gte: date,
          },
        },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      });
    },
  },

  Mutation: {
    addNewPost: async (
      _parent: any,
      args: { title: Link["title"]; description: Link["description"] },
      context: GraphQLContext,
    ) => {
      const newLink = await context.prisma.link.create({
        data: {
          title: args.title,
          description: args.description,
        },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      });
      return newLink;
    },

    deletePost: async (
      _parent: any,
      args: { linkId: Link["id"] },
      context: GraphQLContext,
    ) => {
      const link = await context.prisma.link.findUnique({
        where: { id: args.linkId },
      });
      if (!link) {
        throw new GraphQLError("Link not found");
      }

      return context.prisma.link.delete({
        where: { id: args.linkId },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      });
    },

    updatePost: async (
      _parent: any,
      args: {
        linkId: Link["id"];
        title: Link["title"];
        description: Link["description"];
      },
      context: GraphQLContext,
    ) => {
      const link = await context.prisma.link.findUnique({
        where: { id: args.linkId },
      });
      if (!link) {
        throw new GraphQLError("Link not found");
      }

      return context.prisma.link.update({
        where: { id: args.linkId },
        data: {
          title: args.title,
          description: args.description,
        },
        include: {
          _count: {
            select: { comments: true },
          },
        },
      });
    },
  },

  Link: {
    commentCount: (parent: any) => parent._count.comments,

    __resolveReference: (
      reference: { id: Link["id"] },
      context: GraphQLContext,
    ) => {
      return context.prisma.link.findUnique({
        where: { id: reference.id },
        include: {
          comments: true,
          _count: {
            select: { comments: true },
          },
        },
      });
    },

    comments: (
      parent: { id: Link["id"] },
      _args: any,
      context: GraphQLContext,
    ) => {
      return context.prisma.comment.findMany({
        where: { linkId: parent.id },
      });
    },
  },
};
