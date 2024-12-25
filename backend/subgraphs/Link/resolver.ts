import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../prisma";
import { Link, Comment } from "@prisma/client";
import { PostSortField, SortDirection, TimeRange, PostSort } from "../types";

export const resolvers = {
  Query: {
    feed: async (
      _parent: any,
      args: { sort?: PostSort },
      context: GraphQLContext,
    ) => {
      const orderBy: any = {};
      if (args.sort) {
        switch (args.sort.field) {
          case PostSortField.CREATED_AT:
            orderBy.createdAt = args.sort.direction.toLowerCase();
            break;
          case PostSortField.TITLE:
            orderBy.title = args.sort.direction.toLowerCase();
            break;
          case PostSortField.COMMENT_COUNT:
            orderBy.comments = { _count: args.sort.direction.toLowerCase() };
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
      args: { timeRange: TimeRange; sort?: PostSort },
      context: GraphQLContext,
    ) => {
      const date = new Date();
      switch (args.timeRange) {
        case TimeRange.DAY:
          date.setDate(date.getDate() - 1);
          break;
        case TimeRange.WEEK:
          date.setDate(date.getDate() - 7);
          break;
        case TimeRange.MONTH:
          date.setMonth(date.getMonth() - 1);
          break;
      }

      return context.prisma.link.findMany({
        where: {
          createdAt: { gte: date },
        },
        orderBy: {
          comments: { _count: "desc" },
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
