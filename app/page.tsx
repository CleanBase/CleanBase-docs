import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { MoveUpRightIcon, TerminalIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex sm:min-h-[91vh] min-h-[88vh] flex-col items-center justify-center text-center px-2 py-8">
      <Link
        href="https://github.com/CleanBase/CleanArchitecture-Template"
        target="_blank"
        className="mb-5 sm:text-lg flex items-center gap-2 underline underline-offset-4"
      >
        Follow nuget on GitHub{""}
        <MoveUpRightIcon className="w-4 h-4 font-extrabold" />
      </Link>
      <h1 className="text-3xl font-bold mb-4 sm:text-7xl">
        CleanBase NuGet Documentation for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9780e5] via-[#e666cc] to-[#e666cc]">ASP.NET</span>
      </h1>
      <p className="mb-8 sm:text-xl max-w-[800px] text-muted-foreground">
      An Nuget library support to setup dotnet Clean Architecture with high flexible.

      </p>
      <div className="flex flex-row items-center gap-5">
        <Link
          href={`/docs${page_routes[0].href}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Get Stared
        </Link>
        <Link
          href="https://www.nuget.org/packages?q=cleanbase"
          className={buttonVariants({
            variant: "outline",
            className: "px-6",
            size: "lg",
          })}
        >
          Nuget Package
        </Link>
      </div>
      <span className="flex flex-row items-center gap-2 text-zinc-400 text-md mt-7 -mb-12 max-[800px]:mb-12">
        <TerminalIcon className="w-4 h-4 mr-1" /> ~ paket add CleanBase.Core --version 1.0.7.3
      </span>
    </div>
  );
}
