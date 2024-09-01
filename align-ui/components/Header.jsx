"use client";

import React from "react";
import Container from "./ui/container";
import Link from "next/link";

import Image from "next/image";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonStar, Sun } from "lucide-react";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="py-3 px-4 border-b ">
      <Container>
        <div className="w-full mx-auto px-4 6 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold flex">
                <div className="font-mono text-3xl font-medium align-middle underline">
                  ÆLIGN
                </div>
                <Image
                  src="/logo.png"
                  className="ml-2"
                  width={38}
                  height={38}
                  alt="Logo"
                />
              </h1>
            </Link>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              className="mr-3"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-8 w-8 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonStar className="absolute h-8 w-8 rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle Theme</span>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
