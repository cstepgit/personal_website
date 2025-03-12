"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="mt-16 pb-8">
      <Separator className="mb-8" />
      <div className="flex justify-between items-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Cooper Stepanain. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/cstepgit"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://linkedin.com/in/cooper-stepanian"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://www.instagram.com/cooper.stepanian/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}
