"use client";

import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type UserMenuProps = {
  fullName: string;
  email: string;
  imageUrl?: string;
};

export function UserMenu({ fullName, email, imageUrl }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="group relative z-50" ref={menuRef}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Div trigger requested */}
      <div
        className="flex cursor-pointer list-none items-center gap-2 border border-transparent px-3 py-1.5 text-sm text-foreground transition hover:border-ink-600"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={fullName}
            width={28}
            height={28}
            className="h-7 w-7 border border-ink-600 object-cover"
          />
        ) : (
          <span className="font-display inline-flex h-7 w-7 items-center justify-center bg-accent text-accent-ink">
            {fullName.charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className={`text-xs text-muted transition ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>

      <div
        className={`absolute right-0 z-50 mt-2 w-64 border border-ink-600 bg-ink-900 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${
          isOpen ? "" : "hidden"
        }`}
      >
        <div className="flex items-center gap-2">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={fullName}
              width={36}
              height={36}
              className="h-9 w-9 border border-ink-600 object-cover"
            />
          ) : (
            <span className="font-display inline-flex h-9 w-9 items-center justify-center bg-accent text-accent-ink">
              {fullName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {fullName}
            </p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
        </div>
        <div className="my-3 h-px bg-ink-700" />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-left text-sm font-semibold uppercase tracking-[0.06em] text-accent transition hover:bg-accent hover:text-accent-ink"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
