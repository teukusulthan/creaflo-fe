// app/caption/page.tsx
"use client";
import { ToolScaffold } from "@/components/ToolScaffold";
export default function CaptionToolPage() {
  return (
    <ToolScaffold
      tool="caption"
      title="Caption Generator"
      description="Create 3 unique captions in seconds."
      placeholder="Enter topic or short description to generate ideas"
    />
  );
}
