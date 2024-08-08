"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { PostDataInclude } from "@/lib/types";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  // remember this is not user readible error because they should never even reach this position
  if (!user) throw new Error("Unauthorized!");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found!");

  if (post.userId !== user.id) throw new Error("Unauthorized!");

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: PostDataInclude,
  });

  return deletedPost;
}