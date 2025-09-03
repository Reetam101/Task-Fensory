"use client";
import { getPoolsData } from "@/api/services";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PoolType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { columns } from "./columns";
import { TableSkeleton } from "@/components/table-skeleton";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { useWallet } from "@/context/WalletContext";

export default function Home() {
  const { data, isLoading, isError } = useQuery<PoolType[]>({
    queryKey: ["pools"],
    queryFn: getPoolsData,
  });

  // Categories filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Filter data based on selected categories
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (selectedCategories.length === 0) return data; // no filter applied
    return data.filter(
      (pool) => selectedCategories.includes(pool.category) // assuming pool.category exists
    );
  }, [data, selectedCategories]);

  const { address, isConnected, isConnecting } = useWallet();
  console.log(address);
  console.log(isConnected);
  return (
    <div className="h-full">
      <h1 className="text-2xl font-bold py-5">All Pools</h1>
      {/* <WalletConnectButton /> */}
      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Categories</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {["Lending", "Liquid Staking", "Yield Aggregator"].map((cat) => (
              <DropdownMenuCheckboxItem
                key={cat}
                checked={selectedCategories.includes(cat)}
                onCheckedChange={() => toggleCategory(cat)}
              >
                {cat}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="py-5 mt-5">
        {isLoading && <TableSkeleton />}
        {filteredData?.length !== 0 && (
          <DataTable data={filteredData} columns={columns} />
        )}
      </div>
    </div>
  );
}
