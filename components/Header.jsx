"use client";

import React from "react";
import Container from "./ui/container";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { MoonStar, Sun, Settings2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "@/components/ui/switch";
import ld from "lodash";

import preferencesStore from "@/stores/preferences";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { preferences, setPreference, setNumTopArticles } = preferencesStore();

  return (
    <header className="py-3 px-4 border-b ">
      <Container>
        <div className="w-10/12 mx-auto px-4 6 flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold flex">
                <span className="text-3xl font-medium align-middle">Ælign</span>
                <Image
                  src="/logo.png"
                  className="ml-2"
                  width={35}
                  height={35}
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
            <Dialog>
              <DialogTrigger>
                <Settings2 className="h-8 w-8 mr-3" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View Preferences</DialogTitle>
                  <DialogDescription>
                    Set your permanent view preferences for the search results
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-5">
                  <h2>Toggle view settings</h2>
                  {ld.keys(preferences).map((name) => (
                    <div
                      key={name}
                      className="flex items-center space-x-2 mt-3"
                    >
                      <Switch
                        checked={preferences[name].checked}
                        onCheckedChange={() => setPreference(name)}
                      />
                      <Label>{preferences[name].title}</Label>
                    </div>
                  ))}
                  <div className="items-center mt-5">
                    <Label>
                      Numer of Top Articles ({preferences["articles"].top})
                    </Label>
                    <Slider
                      className="mt-2"
                      defaultValue={[preferences.articles.top]}
                      max={100}
                      step={1}
                      onValueChange={(data) => setNumTopArticles(data[0])}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="https://ui.shadcn.com/avatars/01.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
