"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "urql";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { graphql } from "../../__generated__/gql";
import { LoadingSpinner } from "@/components/ui/loader";

const PostQuery = graphql(/* GraphQL */ `
  query Post($id: ID!) {
    feed {
      id
      title
      description
    }
    postComments(linkId: $id) {
      id
      body
      createdAt
    }
  }
`);

const AddCommentMutation = graphql(/* GraphQL */ `
  mutation AddComment($linkId: ID!, $text: String!) {
    addNewComment(linkId: $linkId, text: $text) {
      id
      body
      createdAt
    }
  }
`);

export default function CommentPage() {
  const params = useParams();
  const [comment, setComment] = useState("");

  const [result, reexecuteQuery] = useQuery({
    query: PostQuery,
    variables: { id: params.id as string },
  });

  const [{ fetching: mutationLoading }, addComment] =
    useMutation(AddCommentMutation);

  const post = result?.data?.feed?.find((post) => post.id === params.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addComment({
      linkId: params.id as string,
      text: comment,
    });
    reexecuteQuery();

    if (result.error) {
      console.error("Failed to add comment:", result.error);
      return;
    }

    setComment("");
  };

  if (result.fetching) return <LoadingSpinner />;

  return (
    <div className="p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Hacker News Feed</CardTitle>
          <h2 className="text-xl font-semibold mt-4">{post?.title}</h2>
          <p className="text-muted-foreground">{post?.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              placeholder="Write any comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              disabled={mutationLoading}
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={mutationLoading}>
                {mutationLoading ? "Sending..." : "Send Comment"}
              </Button>
            </div>
          </form>

          <div className="space-y-4">
            <h3 className="font-semibold">Comments</h3>
            <div className="space-y-4">
              {result.data?.postComments?.map((comment) => (
                <div key={comment.id} className="p-4 bg-muted rounded-lg">
                  <p>{comment.body}</p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </time>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
