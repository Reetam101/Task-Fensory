"use client";

import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";

interface LockedTableRowProps {
  children: React.ReactNode;
  rowData: any;
  className?: string;
}

export function LockedTableRow({
  children,
  rowData,
  className,
}: LockedTableRowProps) {
  const { isConnected } = useWallet();

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
