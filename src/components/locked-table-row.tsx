"use client";

import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import { PoolType } from "@/lib/types";

// export type YieldPoolData = {
//   apy: number;
//   apyBase: number | null;
//   apyBase7d: number | null;
//   apyBaseInception: number | null;
//   apyMean30d: number;
//   apyPct1D: number;
//   apyPct7D: number;
//   apyPct30D: number;
//   apyReward: number;
//   category: string;
//   chain: string;
//   count: number;
//   exposure: string;
//   il7d: number | null;
//   ilRisk: string;
//   mu: number;
//   outlier: boolean;
//   pool: string;
//   poolMeta: string;
//   predictions: {
//     predictedClass: string;
//     predictedProbability: number;
//     binnedConfidence: number;
//   };
//   project: string;
//   rewardTokens: string[];
//   sigma: number;
//   stablecoin: boolean;
//   symbol: string;
//   tvlUsd: number;
//   underlyingTokens: string[];
//   volumeUsd1d: number | null;
//   volumeUsd7d: number | null;
// };

interface LockedTableRowProps {
  children: React.ReactNode;
  rowData: PoolType;
  className?: string;
}

export function LockedTableRow({
  children,
  rowData,
  className,
}: LockedTableRowProps) {
  const { isConnected } = useWallet();
  console.log(rowData);
  const isYieldAggregator = rowData?.category === "Yield Aggregator";
  const isLocked = isYieldAggregator && !isConnected;

  return (
    <tr
      className={cn(
        isLocked && "opacity-90 blur-[4px] bg-muted/30 pointer-events-none",
        "transition-all duration-300 ease-in-out",
        className
      )}
      data-locked={isLocked}
      data-category={rowData?.category}
    >
      {children}
    </tr>
  );
}
