"use client";

import { PoolType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<PoolType>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "project",
    header: "Project",
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
  },
  {
    accessorKey: "tvlUsd",
    header: "tvlUsd",
  },
  {
    accessorKey: "apy",
    header: "apy",
  },
  {
    accessorKey: "predictions",
    header: "prediction",
    cell: ({ row }) => {
      console.log(row.original.predictions);
      if (
        row.original.predictions.predictedClass.includes("Up") ||
        row.original.predictions.predictedClass.includes("Stable")
      ) {
        return (
          <span>
            <p className="text-green-600 font-bold">
              {row.original.predictions.predictedProbability.toFixed(3)}
            </p>
          </span>
        );
      } else {
        return (
          <span>
            <p className="text-red-600 font-bold">
              {row.original.predictions.predictedProbability.toFixed(3)}
            </p>
          </span>
        );
      }
    },
  },
  {
    accessorKey: "sigma",
    header: "sigma",
  },
  {
    accessorKey: "apyMean30d",
    header: "apyMean30d",
  },
];
