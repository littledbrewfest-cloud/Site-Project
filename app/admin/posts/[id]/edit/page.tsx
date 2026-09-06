import React from "react";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getActiveCategories } from "@/lib/settings";
import PostEditClient from "./PostEditClient";

export const dynamic = "force-dynamic";

interface PostEditPageProps {
  params: {
    id: string;
  };
}

export default async function PostEditPage({ params }: PostEditPageProps) {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }

  const [post, categories] = await Promise.all([
    prisma.post.findUnique({
      where: { id: params.id },
    }),
    getActiveCategories(),
  ]);

  if (!post) {
    notFound();
  }

  const serializedPost = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImageUrl: post.coverImageUrl,
    category: post.category,
    tags: post.tags,
    status: post.status,
  };

  return <PostEditClient post={serializedPost} categories={categories} />;
}
