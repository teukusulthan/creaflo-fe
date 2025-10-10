"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  PenTool,
  Target,
  Lightbulb,
  Hash,
  History,
  Bookmark,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { logoutRequest } from "@/services/auth.services";

function matchPath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  {
    href: "/dashboard/tools/caption",
    label: "Caption Generator",
    icon: PenTool,
  },
  { href: "/dashboard/tools/hook", label: "Hook Generator", icon: Target },
  { href: "/dashboard/tools/idea", label: "Idea Generator", icon: Lightbulb },
  { href: "/dashboard/tools/hashtag", label: "Hashtag Generator", icon: Hash },
  {
    href: "/dashboard/history",
    label: "History",
    icon: History,
    section: "sep" as const,
  },
  { href: "/dashboard/saved", label: "Saved", icon: Bookmark },
];

export function Sidebar() {
  const router = useRouter(); // ✅ Sekarang bisa dipakai
  const pathname = usePathname() || "/";

  const onLogout = async () => {
    try {
      await logoutRequest();
      toast.success("Logged out");
      router.push("/login");
      router.refresh();
    } catch (e: any) {
      const msg = e?.message || "Logout failed";
      toast.error(msg);
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background pt-16 md:block">
      <nav className="flex h-full flex-col px-4 py-4">
        <ul className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = matchPath(pathname, it.href);
            return (
              <li key={it.href}>
                {it.section === "sep" && (
                  <div className="my-3 h-px w-full bg-border" />
                )}
                <Link
                  href={it.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition
                     ${
                       active
                         ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                         : "hover:bg-muted"
                     }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-3">
          <button
            onClick={onLogout}
            className="flex cursor-pointer w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}
