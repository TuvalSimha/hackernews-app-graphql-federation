"use client";
import { useState } from "react";
import { useQuery, useMutation } from "urql";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { graphql } from "./__generated__/gql";
import { PostSortField, SortDirection } from "./__generated__/graphql";

const FeedQuery = graphql(/* GraphQL */ `
  query Feed($sort: PostSort) {
    feed(sort: $sort) {
      commentCount
      createdAt
      description
      id
      title
    }
  }
`);

const AddPostMutation = graphql(/* GraphQL */ `
  mutation AddPost($title: String!, $description: String!) {
    addNewPost(title: $title, description: $description) {
      id
      title
      description
    }
  }
`);

export default function Home() {
  const [sortField, setSortField] = useState<PostSortField>(
    PostSortField.CreatedAt,
  );
  const [sortDirection, setSortDirection] = useState<SortDirection>(
    SortDirection.Desc,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [{ data }] = useQuery({
    query: FeedQuery,
    variables: {
      sort: {
        field: sortField,
        direction: sortDirection,
      },
    },
  });

  const [{ fetching }, addPost] = useMutation(AddPostMutation);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addPost({ title, description });
    if (!result.error) {
      setTitle("");
      setDescription("");
      setIsOpen(false);
    }
  };

  return (
    <div className="p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Hacker News Feed</CardTitle>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Add Post</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Button type="submit" disabled={fetching}>
                    {fetching ? "Creating..." : "Create Post"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={sortField}
              onValueChange={(value) => setSortField(value as PostSortField)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CREATED_AT">Date</SelectItem>
                <SelectItem value="TITLE">Title</SelectItem>
                <SelectItem value="COMMENT_COUNT">Comments</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={sortDirection}
              onValueChange={(value) =>
                setSortDirection(value as SortDirection)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASC">Ascending</SelectItem>
                <SelectItem value="DESC">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {data?.feed?.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="block p-3 hover:bg-muted rounded-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{post.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </div>
                <span>{post.commentCount} Comments</span>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
