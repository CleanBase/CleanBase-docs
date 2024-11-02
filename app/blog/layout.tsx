import ClientWrapper from "@/components/ClientWrapper";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "AriaDocs - Template",
  metadataBase: new URL("https://ariadocs.vercel.app/"),
  description:
    "haaaaaaaaaaaaaaaaaaaaaaaaaaaa"
}

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col items-start justify-center pt-2 pb-10 md:w-[80%] mx-auto">
        <ClientWrapper>
          {children}
        </ClientWrapper>

    </div>
  );
}
