import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getActiveCategories } from "@/lib/settings";
import NewPostClient from "./NewPostClient";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!isAuthenticated()) {
    redirect("/admin/login");
  }

  const categories = await getActiveCategories();

  return <NewPostClient categories={categories} />;
}
