"use client";
import { ToolScaffold } from "@/components/ToolScaffold";
export default function HookToolPage() {
  return (
    <ToolScaffold
      tool="hook"
      title="Hook Generator"
      description="Generate attention-grabbing video hooks that stop the scroll."
      placeholder="Enter a topic to generate hooks"
    />
  );
}
