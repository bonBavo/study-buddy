"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./Button";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // In a real app, you might fetch user info from an API or context
    // For now, let's try to get it from a local storage or session if available
    // though the best way is usually a specialized /api/auth/me endpoint
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/performance"); // Using an existing API that might return 401 if not logged in
        if (res.ok) {
           // If we had a /api/auth/me we'd use that.
           // For this demo, we'll just assume they are logged in if they can reach dashboard
        }
      } catch (e) {}
    };
    fetchUser();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Subjects", href: "/subjects" },
    { label: "Data Entry", href: "/data-entry" },
    { label: "Predictions", href: "/predictions" },
    { label: "Recommendations", href: "/recommendations" },
  ];

  // Don't show navbar on login/register/home pages if you prefer
  const hideOn = ["/", "/login", "/register"];
  if (hideOn.includes(pathname)) return null;

  return (
    <nav className="nav">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
          <Button variant="tab" active={pathname === item.href}>
            {item.label}
          </Button>
        </Link>
      ))}
      <div className="user-info" style={{ marginLeft: "auto" }}>
        <div className="user-profile">
          <span className="user-icon">👤</span>
          <span style={{ fontSize: "0.9rem" }}>User</span>
        </div>
        <Button variant="logout" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
};
