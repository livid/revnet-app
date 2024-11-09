"use client";

import { chainIdMap, chainNames } from "@/app/constants";
import { formatTokenSymbol } from "@/lib/utils";
import {
  JBChainId,
  useJBContractContext,
  useJBProjectMetadataContext,
  useJBTokenContext,
  useSuckerPairs,
} from "juice-sdk-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useEffect } from "react";
import { zeroAddress } from "viem";
import { useConfig } from "wagmi";
import { ActivityFeed } from "../ActivityFeed";
import { DistributeReservedTokensButton } from "../DistributeReservedTokensButton";
import { NetworkDetailsTable } from "../NetworkDetailsTable";
import { PayCard } from "../PayCard/PayCard";
import { UserTokenBalanceCard } from "../UserTokenBalanceCard/UserTokenBalanceCard";
import { Header } from "./Header/Header";
import { DescriptionSection } from "./sections/DescriptionSection/DescriptionSection";
import { HoldersSection } from "./sections/HoldersSection/HoldersSection";
import { PriceSection } from "./sections/PriceSection";
import { SuckerPair } from "juice-sdk-core";

export function NetworkDashboard() {
  const { contracts, projectId } = useJBContractContext();
  const { token } = useJBTokenContext();
  const { metadata } = useJBProjectMetadataContext();
  const { name } = metadata?.data ?? {};
  const suckerPairs = useSuckerPairs();

  // set title
  // TODO, hacky, probably eventually a next-idiomatic way to do this.
  useEffect(() => {
    if (!token?.data?.symbol) return;
    document.title = `${formatTokenSymbol(token)} | REVNET`;
  }, [token]);

  const pageLoading = metadata.isLoading && contracts.controller.isLoading;
  if (pageLoading) {
    return null;
  }

  if (contracts.controller.data === zeroAddress) {
    notFound();
  }

  const payAndActivityBar = (
    <>
      <div className="mb-10">
        <PayCard />
      </div>
      <UserTokenBalanceCard />
      <ActivityFeed />
    </>
  );

  return (
    <div className="flex gap-10 w-full px-4 sm:container py-10 md:flex-nowrap flex-wrap mb-10">
      {/* Column 1 */}
      <div className="flex-1">
        <Header />
        <PriceSection />
        {/* Render Pay and activity after header on mobile */}
        <div className="sm:hidden mb-10">{payAndActivityBar}</div>

        <div className="max-w-4xl mx-auto">
          <section className="mb-10">
            <div className="mb-8">
              <NetworkDetailsTable />
            </div>

            <div className="mb-4">
              <HoldersSection />
            </div>

            <DistributeReservedTokensButton />
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-1">About</h2>
            <div className="flex gap-3">
              {(suckerPairs.data as SuckerPair[])?.map((pair) => {
                const networkName = chainIdMap[pair?.peerChainId as JBChainId];
                return (
                  <Link
                    className="underline"
                    key={networkName}
                    href={`/${networkName}/${pair?.projectId}`}
                  >
                    {chainNames[pair?.peerChainId as JBChainId]}
                  </Link>
                );
              })}
            </div>
            <DescriptionSection />
          </section>

          {/*
        <div>
          {totalTokenSupply && tokensReserved && token ? (
            <div>
              {formatUnits(totalTokenSupply, token.decimals)} {token.symbol} in
              circulation (+ {formatUnits(tokensReserved, token.decimals)}{" "}
              reserved)
            </div>
          ) : null}
        </div> */}

          {/* <div>
          Gen {(cycleData.number + 1n).toString()} buy price:{" "}
          {formatEther(nextCycleEthQuote)} ETH / {token?.data?.symbol} (+
          {formatEther(nextCycleEthQuote - ethQuote)} ETH)
        </div> */}
        </div>
      </div>

      {/* Column 2, hide on mobile */}
      <aside className="hidden md:w-[340px] md:block sm:mt-24">
        {payAndActivityBar}
      </aside>
    </div>
  );
}
