"use client";

import { cn } from "@/lib/utils";
import { Inbox, LibraryBig, UserCog } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Documentos",
    href: "/documents",
    icon: <LibraryBig className="h-4 w-4" />,
  },
  {
    label: "Repositórios",
    href: "/repositories",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    label: "Administrador",
    href: "/admin",
    icon: <UserCog className="h-4 w-4" />,
  },
];

export function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-muted-foreground hover:text-primary flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
            pathname.includes(link.href) && "bg-muted text-primary",
          )}
        >
          {link.icon}
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
