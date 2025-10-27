"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export default function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleClick = () => {
    const current = theme === "system" ? resolvedTheme : theme;
    setTheme(current === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      title="테마 변경하기"
      className="hover:text-primary"
    >
      <Sun className="dark:-rotate-90 size-6 rotate-0 scale-100 transition-all dark:scale-0" />
      <Moon className="absolute size-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
