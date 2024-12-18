export type Link = {
  id: string;
  createdAt: string;
  url: string;
  description: string;
  comments?: Comment[];
};

export type Comment = {
  id: string;
  createdAt: string;
  body: string;
  linkId: string;
};

export const mockData: Link[] = [
  {
    id: "link-0",
    createdAt: "2021-08-01T00:00:00.000Z",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
    comments: [
      {
        id: "comment-0",
        createdAt: "2021-08-01T00:00:00.000Z",
        body: "This is a comment",
        linkId: "link-0",
      },
      {
        id: "comment-1",
        createdAt: "2021-08-02T00:00:00.000Z",
        body: "This is another comment",
        linkId: "link-0",
      },
    ],
  },
  {
    id: "link-1",
    createdAt: "2021-08-02T00:00:00.000Z",
    url: "www.graphql.org",
    description: "The official GraphQL website",
    comments: [
      {
        id: "comment-2",
        createdAt: "2021-08-03T00:00:00.000Z",
        body: "This is a third comment",
        linkId: "link-1",
      },
      {
        id: "comment-3",
        createdAt: "2021-08-04T00:00:00.000Z",
        body: "This is a fourth comment",
        linkId: "link-1",
      },
    ],
  },
  {
    id: "link-2",
    createdAt: "2021-08-03T00:00:00.000Z",
    url: "www.apollographql.com",
    description: "The official Apollo website",
    comments: [],
  },
];
