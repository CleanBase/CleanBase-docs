import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HeartIcon, Package, TriangleIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t w-full h-16">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-2">
        <div className="flex items-center gap-3">
          <p className="text-center">
            Flow me at{" "}
            <Link
              className="px-1 underline underline-offset-2"
              href="https://github.com/hoangvh238"
            >
              hoangvh238.dev
            </Link>
          </p>
        </div>

        <div className="gap-4 items-center hidden md:flex">
          <FooterButtons />
        </div>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://www.nuget.org/packages?q=cleanBase+hoangvh&includeComputedFrameworks=true&prerel=true&sortby=relevance"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Package className="h-[0.8rem] w-4 mr-2 text-primary fill-current" />
        Visit nuget
      </Link>
      <Link
        href="https://github.com/sponsors/nisabmohd"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <HeartIcon className="h-4 w-4 mr-2 text-red-600 fill-current" />
        Donate
      </Link>
    </>
  );
}
