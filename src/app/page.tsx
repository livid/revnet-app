import { Button } from "@/components/ui/button";
import { FastForwardIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="container mt-40">
      <div className="flex flex-col items-left justify-left">
        <Image
          src="/assets/img/revnet-logo.svg"
          width={200}
          height={200}
          alt="Revnet logo"
        />
        <span className="sr-only">Revnet</span>
        <div className="text-2xl md:text-4xl mt-4 font-medium text-left">
          Revnets are an unstoppable growth engine for projects on the open internet
        </div>
        <div className="flex gap-4 mt-10">
          <Link href="/create">
            <Button className="md:h-20 h-16 text-xl md:text-2xl px-10 flex gap-2 bg-teal-500 hover:bg-teal-600">
              Ship yours
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-10 max-w-prose text-l md:text-2xl text-lg text-left">
        <div className="mt-10 mb-8 text-xl md:text-2xl text-left">
          Explore: $<Link href="https://revnet.app/sepolia/1" target="_blank"
            rel="noopener norefererr"
            className="underline hover:text-black/70 font-medium">NANA</Link> {"  |  "} $<Link href="https://revnet.app/sepolia/3" target="_blank"
            rel="noopener norefererr"
            className="underline hover:text-black/70 font-medium">REV</Link> {"  |  "} $<Link href="https://revnet.app/sepolia/4" target="_blank"
            rel="noopener norefererr"
            className="underline hover:text-black/70 font-medium">BAN</Link> {"  |  "} $<Link href="https://revnet.app/sepolia/2" target="_blank"
            rel="noopener norefererr"
            className="underline hover:text-black/70 font-medium">CPN</Link>
        </div>
        <p className="mb-4">
          A revnet serves as a hands-free, all-in-one token vending machine, cap table, and capital formation engine for leaders, workers, artists, researchers, investors, AI agents, and customers of growth-oriented businesses, brands, campaigns, experiments, communities, and indie projects on the open internet.
        </p>

        <p>
          Read the memo at {" "}
          <Link
            href="https://revnet.eth.sucks/memo"
            target="_blank"
            rel="noopener norefererr"
            className="underline"
          >
            revnet.eth.sucks/memo
          </Link>.
        </p>
        <div className="flex mb-40 text-sm">
          <Link href="https://discord.gg/8qdtvdep">
            <div className="mt-10 bg-white text-black hover:text-black/70 text-l md:text-l flex gap-2 underline">
              Plan your revnet with the community on Discord
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
