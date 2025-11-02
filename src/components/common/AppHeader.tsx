import Link from "next/link";
import ModeToggle from "./ModeToggle";

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-13 w-full items-center justify-center border-b bg-background">
      <div className="flex h-full w-full max-w-5xl items-center justify-between gap-8 px-4">
        <Link
          href="/"
          className="flex h-full items-center justify-center font-semibold text-2xl text-foreground transition-all"
        >
          Seokjun's blog
        </Link>

        <nav className="hidden h-full flex-1 flex-row items-stretch justify-start gap-2 sm:flex">
          <Link
            href="/posts"
            className="flex items-center justify-center px-3 font-semibold text-lg text-muted-foreground transition-all hover:bg-accent hover:text-primary"
          >
            작성글
          </Link>
          {/* <Link
            href="/tags"
            className="flex items-center justify-center px-3 font-semibold text-lg text-muted-foreground transition-all hover:bg-accent hover:text-primary"
          >
            태그
          </Link> */}
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}

export { AppHeader };
