import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getActiveCategories } from "@/lib/settings";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }

  const [posts, categories] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    }),
    getActiveCategories(),
  ]);

  const serializedPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  }));

  return (
    <AdminDashboardClient
      initialPosts={serializedPosts}
      initialCategories={categories}
    />
  );
}
