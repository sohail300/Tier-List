"use client";

import { SignOutButton } from "@clerk/nextjs";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
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
        className="flex cursor-pointer list-none items-center gap-2 px-3 py-1.5 text-sm text-zinc-200 transition"
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
            className="h-7 w-7 rounded-full border border-zinc-600 object-cover"
          />
        ) : (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/20 font-semibold text-orange-300">
            {fullName.charAt(0).toUpperCase()}
          </span>
        )}
        <span
          className={`text-xs text-zinc-400 transition ${isOpen ? "rotate-180" : ""}`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </div>

      <div
        className={`absolute right-0 z-50 mt-2 w-64 rounded-xl border border-zinc-700 bg-zinc-900 p-3 shadow-xl ${
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
              className="h-9 w-9 rounded-full border border-zinc-600 object-cover"
            />
          ) : (
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 font-semibold text-orange-300">
              {fullName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-zinc-100">
              {fullName}
            </p>
            <p className="truncate text-xs text-zinc-400">{email}</p>
          </div>
        </div>
        <div className="my-3 h-px bg-zinc-700" />
        <SignOutButton>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-medium text-red-400 transition hover:bg-red-900/10 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
