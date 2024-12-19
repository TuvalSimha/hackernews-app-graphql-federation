export type Link = {
  id: string;
  comments: { id: string }[];
  createdAt: string;
  url: string;
  description: string;
};

export const LINKS: Link[] = [
  {
    id: "link:0",
    comments: [{ id: "comment:1" }, { id: "comment:2" }],
    createdAt: "2021-08-01T00:00:00.000Z",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: "link:1",
    comments: [{ id: "comment:5" }],
    createdAt: "2021-08-02T00:00:00.000Z",
    url: "www.graphql.org",
    description: "The official GraphQL website",
  },
  {
    id: "link:2",
    comments: [],
    createdAt: "2021-08-03T00:00:00.000Z",
    url: "www.apollographql.com",
    description: "The official Apollo website",
  },
  {
    id: "link:3",
    comments: [],
    createdAt: "2021-08-03T00:00:00.000Z",
    url: "www.apollographql.com",
    description: "The official Apollo website",
  },
];

export type Comment = {
  id: string;
  createdAt: string;
  body: string;
  linkId: string;
};

export const COMMENTS: Comment[] = [
  {
    id: "comment:1",
    linkId: "link:0",
    createdAt: "2021-08-01T00:00:00.000Z",
    body: "Great tutorial!",
  },
  {
    id: "comment:2",
    linkId: "link:0",
    createdAt: "2021-08-01T00:00:00.000Z",
    body: "I love GraphQL!",
  },
  {
    id: "comment:3",
    linkId: "link:0",
    createdAt: "2021-08-01T00:00:00.000Z",
    body: "I love GraphQL!",
  },
  {
    id: "comment:4",
    linkId: "link:0",
    createdAt: "2021-08-01T00:00:00.000Z",
    body: "I love GraphQL!",
  },
  {
    id: "comment:5",
    linkId: "link:1",
    createdAt: "2021-08-02T00:00:00.000Z",
    body: "GraphQL is awesome!",
  },
];
