// app/hashtag/page.tsx
"use client";
import { ToolScaffold } from "@/components/ToolScaffold";
export default function HashtagToolPage() {
  return (
    <ToolScaffold
      tool="hashtag"
      title="Hashtag Generator"
      description="Find the perfect hashtags to maximize your reach."
      placeholder="Enter keywords or a short post summary..."
    />
  );
}
