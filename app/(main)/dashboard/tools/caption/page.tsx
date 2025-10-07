"use client";
import { ToolScaffold } from "@/components/ToolScaffold";

export default function CaptionToolPage() {
  return (
    <ToolScaffold
      title="Caption Generator"
      description="Create 3 unique captions in seconds."
      placeholder="E.g., morning coffee routine, beach sunset, workout motivation..."
    />
  );
}
