import Link from "next/link";
import ModeToggle from "./ModeToggle";

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-center border-b bg-background">
      <div className="flex w-full max-w-5xl items-center justify-between gap-10 px-4 py-2">
        <Link
          href="/"
          className="font-semibold text-2xl text-foreground transition-all"
        >
          Seokjun's blog
        </Link>

        <nav className="flex flex-1 flex-row items-end justify-start gap-8">
          <Link
            href="/posts"
            className="font-semibold text-lg text-muted-foreground transition-all hover:text-foreground"
          >
            작성글
          </Link>
          <Link
            href="/tags"
            className="font-semibold text-lg text-muted-foreground transition-all hover:text-foreground"
          >
            태그
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}

export { AppHeader };
