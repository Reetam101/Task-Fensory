"use client";

import { useWallet } from "@/context/WalletContext";
import { PoolType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { Lock, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<PoolType>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;
      return (
        <div className="flex items-center gap-2">
          <span className={isLocked ? "opacity-60" : ""}>{pool.category}</span>
          {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
        </div>
      );
    },
  },
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      return (
        <div className="flex items-center gap-2">
          <span className={isLocked ? "opacity-60" : ""}>{pool.project}</span>
          {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
        </div>
      );
    },
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      return (
        <span className={isLocked ? "opacity-60" : ""}>{pool.symbol}</span>
      );
    },
  },
  {
    accessorKey: "tvlUsd",
    header: "TVL (USD)",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      return (
        <span className={isLocked ? "opacity-60" : ""}>
          ${pool.tvlUsd?.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "apy",
    header: "APY",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      return (
        <span className={isLocked ? "opacity-60" : ""}>
          {pool.apy?.toFixed(2)}%
        </span>
      );
    },
  },
  {
    accessorKey: "predictions",
    header: "Prediction",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      if (isLocked) {
        return (
          <span className="opacity-60 text-muted-foreground">Connect</span>
        );
      }

      if (
        pool.predictions?.predictedClass?.includes("Up") ||
        pool.predictions?.predictedClass?.includes("Stable")
      ) {
        return (
          <span className="text-green-600 font-bold">
            {pool.predictions?.predictedProbability?.toFixed(3)}
          </span>
        );
      } else {
        return (
          <span className="text-red-600 font-bold">
            {pool.predictions?.predictedProbability?.toFixed(3)}
          </span>
        );
      }
    },
  },
  {
    accessorKey: "sigma",
    header: "Sigma",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      if (isLocked) {
        return (
          <span className="opacity-60 text-muted-foreground">Connect</span>
        );
      }

      return <span>{pool.sigma?.toFixed(4)}</span>;
    },
  },
  {
    accessorKey: "apyMean30d",
    header: "APY Mean (30d)",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      if (isLocked) {
        return (
          <span className="opacity-60 text-muted-foreground">Connect</span>
        );
      }

      return <span>{pool.apyMean30d?.toFixed(2)}%</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      // const { isConnected } = useWallet();
      const pool = row.original;
      // const isYieldAggregator = pool.category === "Yield Aggregator";
      // const isLocked = isYieldAggregator && !isConnected;
      const isLocked = false;

      if (isLocked) {
        return (
          <div className="flex flex-row gap-2">
            <Button variant="outline" size="sm" disabled className="opacity-60">
              <Lock className="w-4 h-4 mr-2" />
              Locked
            </Button>
          </div>
        );
      }

      return (
        <Button asChild size="sm">
          <Link href={`/pool/${pool.pool}`}>View Details</Link>
        </Button>
      );
    },
  },
];
