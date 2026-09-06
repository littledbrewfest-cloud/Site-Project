import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }

  const [posts, categories] = await Promise.all([
    getSafePublishedPosts(),
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
    createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
    publishedAt: p.publishedAt ? (typeof p.publishedAt === "string" ? p.publishedAt : p.publishedAt.toISOString()) : null,
  }));

  return (
    <AdminDashboardClient
      initialPosts={serializedPosts}
      initialCategories={categories}
    />
  );
}
