"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-md">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          {/* Displaying avatar of the user who posted the post  */}
          <Link href={`/users/${post.user.username}`}>
            <UserAvatar avatarUrl={post.user.avatarUrl} />
          </Link>

          {/* Displaying the name of the user who posted the post  */}
          <div className="">
            <Link
              href={`/users/${post.user.username}`}
              className="block font-medium capitalize hover:underline"
            >
              {post.user.displayName}
            </Link>

            {/* Displaying the date of the post , check my utils file for more info */}
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>

        {/* Displaying the more button for the user who posted the post  */}
        {post.user.id === user.id && (
          <PostMoreButton post={post} className="opacity-0 transition-opacity group-hover/post:opacity-100" />
        )}
      </div>

      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
