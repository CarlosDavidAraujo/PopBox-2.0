import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

const links = [
  { href: "/users", label: "Usuários" },
  { href: "/departments", label: "Setores" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-grow flex-col">
      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={`/admin/${link.href}`}
            className={buttonVariants({ variant: "link" })}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}
