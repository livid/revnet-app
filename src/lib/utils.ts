import { ChainIdToEtherscanUrlBase } from "@/app/constants";
import { clsx, type ClassValue } from "clsx";
import { formatDuration, intervalToDuration } from "date-fns";
import { JBRulesetData, getTokenAToBQuote } from "juice-sdk-core";
import { JBChainId, JBTokenContextData } from "juice-sdk-react";
import { twMerge } from "tailwind-merge";
import { Chain, formatEther } from "viem";
import { mainnet } from "viem/chains";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSeconds(seconds: number) {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 }); // convert seconds to milliseconds
  return formatDuration(duration, {
    format:
      seconds > 2592000 // if greater than 30 days, only show 'months'
        ? ["months", "days"]
        : seconds > 86400 // if greater than a day, only show 'days'
          ? ["days", "hours"]
          : seconds > 3600 // if greater than an hour, only show 'hours' and 'minutes'
            ? ["hours", "minutes"]
            : ["minutes", "seconds"],
    delimiter: ", ",
  });
}

export function etherscanLink(
  addressOrTxHash: string,
  opts: {
    type: "address" | "tx";
    chain?: Chain;
  }
) {
  const { type, chain = mainnet } = opts;

  const baseUrl = ChainIdToEtherscanUrlBase[chain.id as JBChainId];

  switch (type) {
  case "address":
    return `https://${baseUrl}/address/${addressOrTxHash}`;
  case "tx":
    return `https://${baseUrl}/tx/${addressOrTxHash}`;
  }
}

export function formatEthAddress(
  address: string,
  opts: {
    truncateTo?: number;
  } = {
    truncateTo: 4,
  }
) {
  if (!opts.truncateTo) return address;

  const frontTruncate = opts.truncateTo + 2; // account for 0x
  return (
    address.substring(0, frontTruncate) +
    "..." +
    address.substring(address.length - opts.truncateTo, address.length)
  );
}

/**
 * Return percentage of numerator / denominator (e.g. 69 for 69%)
 */
export function formatPortion(numerator: bigint, denominator: bigint) {
  if (numerator === 0n || denominator === 0n) return 0;
  return parseFloat(((numerator * 1000n) / denominator).toString()) / 10;
}

/**
 * Ensure token symbol has $ in front of it
 */
export function formatTokenSymbol(token?: JBTokenContextData["token"] | string) {
  if (typeof token === "string") {
    if (!token) return "$TOKEN";
    if (!token.includes("$")) return `$${token}`;
    return token;
  }
  if (!token?.data?.symbol) return "$TOKEN";
  if (!token?.data?.symbol.includes("$")) return `$${token?.data?.symbol}`;
  return token.data.symbol;
}

/**
 * Get start date for ruleset
 */
export function rulesetStartDate(ruleset?: JBRulesetData) {
  if (!ruleset) return undefined;
  return new Date(ruleset.start * 1000);
}


/**
 * Hex formated wei from Relayr API to Ether
 */
export const formatHexEther = (hexWei: `0x${string}` | undefined, fixed = 8) => {
  if (!hexWei) return "0";
  return Number(formatEther(BigInt(hexWei)))
    .toFixed(fixed);
};
