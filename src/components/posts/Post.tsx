import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-md">
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
          <Link href={`/posts/${post.id}`} className="block text-sm text-muted-foreground hover:underline">
            {formatRelativeDate(post.createdAt)}
          </Link>
        </div>
      </div>

      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
