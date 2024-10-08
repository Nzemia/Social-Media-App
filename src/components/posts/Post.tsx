"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";
import { MessageSquare } from "lucide-react";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";

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
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>

          {/* Displaying the name of the user who posted the post  */}
          <div className="">
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium capitalize hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>

            {/* Displaying the date of the post , check my utils file for more info */}
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>

        {/* Displaying the more button for the user who posted the post  */}
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>

      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>

      {/** If there are media attachments, display them */}
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      {/**Likes */}
      <hr className="my-3 text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some((like) => like.userId === user.id),
          }}
        />
        {/**Bookmarks */}
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (bookmark) => bookmark.userId === user.id,
            ),
          }}
        />
      </div>
    </article>
  );
}



interface MediaPreviewsProps {
  attachments: Media[];
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

interface MediaPreviewProps {
  media: Media;
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (media.type === "VIDEO") {
    return (
      <div>
        <video
          src={media.url}
          controls 
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
}

// interface CommentButtonProps {
//   post: PostData;
//   onClick: () => void;
// }

// function CommentButton({ post, onClick }: CommentButtonProps) {
//   return (
//     <button onClick={onClick} className="flex items-center gap-2">
//       <MessageSquare className="size-5" />
//       <span className="text-sm font-medium tabular-nums">
//         {post._count.comments}{" "}
//         <span className="hidden sm:inline">comments</span>
//       </span>
//     </button>
//   );
// }