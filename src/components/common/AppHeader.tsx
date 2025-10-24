import Link from "next/link";
import ModeToggle from "./ModeToggle";

function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-center border-b-1 bg-background">
      <div className="flex w-full max-w-[1328px] items-center justify-between px-6 py-3">
        <nav className="flex flex-row items-center justify-between gap-8">
          <Link
            href="/"
            className="font-semibold text-muted-foreground text-xl transition-all hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="font-semibold text-muted-foreground text-xl transition-all hover:text-foreground"
          >
            blog
          </Link>
        </nav>
        <ModeToggle />
      </div>
    </header>
  );
}

export { AppHeader };
