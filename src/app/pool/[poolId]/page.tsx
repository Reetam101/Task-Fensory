"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { APYHistoryData, fetchAPYHistory, getPoolData } from "@/api/services";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Params = {
  params: Promise<{
    poolId: string;
  }>;
};

interface PoolData {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apyBase: number;
  apyReward: number;
  apy: number;
  rewardTokens: string[];
  underlyingTokens: string[];
  poolMeta?: string;
  url?: string;
  category?: string;
}

type TimeFilter = "30d" | "6m" | "12m";

// Function to extract data based on time filter
const extractAPYData = (data: APYHistoryData["data"], filter: TimeFilter) => {
  if (!data.length) return [];

  const now = Date.now();
  let cutoffDate: number;

  switch (filter) {
    case "30d":
      cutoffDate = now - 30 * 24 * 60 * 60 * 1000;
      break;
    case "6m":
      cutoffDate = now - 6 * 30 * 24 * 60 * 60 * 1000;
      break;
    case "12m":
    default:
      cutoffDate = now - 12 * 30 * 24 * 60 * 60 * 1000;
      break;
  }

  // Filter data based on cutoff date
  const filteredData = data.filter(
    (entry) => entry.timestamp >= cutoffDate.toString()
  );

  // For longer periods, we might want to sample the data to avoid too many points
  if (filter === "6m" || filter === "12m") {
    const sampledData: { timestamp: string; apy: number; date: string }[] = [];
    const dateMap = new Map<string, number>();

    // Sample data - take one point per week for better readability
    for (const entry of filteredData) {
      const date = new Date(entry.timestamp);
      const weekKey = filter.includes("m")
        ? `${date.getFullYear()}-${date.getMonth()}`
        : `${date.getFullYear()}-${date.getMonth()}-${Math.floor(
            date.getDate() / 7
          )}`;

      if (!dateMap.has(weekKey)) {
        dateMap.set(weekKey, entry.apy);
        sampledData.push({
          timestamp: entry.timestamp,
          apy: entry.apy,
          date: date.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
            year: filter === "12m" ? "numeric" : undefined,
          }),
        });
      }
    }
    return sampledData;
  }

  // For shorter periods, return all data points with formatted dates
  return filteredData.map((entry) => ({
    timestamp: entry.timestamp,
    apy: entry.apy,
    date: new Date(entry.timestamp).toLocaleDateString("default", {
      month: "short",
      day: "numeric",
      ...(filter === "30d" && { weekday: "short" }),
    }),
  }));
};

export default function PoolDetails({ params }: Params) {
  const { poolId } = React.use(params);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("12m");

  const {
    data: poolData,
    isLoading: poolLoading,
    error: poolError,
  } = useQuery({
    queryKey: ["poolDetails", poolId],
    queryFn: () => getPoolData(poolId),
  });

  const {
    data: apyHistory,
    isLoading: apyLoading,
    error: apyError,
  } = useQuery({
    queryKey: ["apyHistory", poolId],
    queryFn: () => fetchAPYHistory(poolId),
    enabled: !!poolId,
  });

  const chartData = useMemo(() => {
    if (!apyHistory) return [];
    return extractAPYData(apyHistory.data, timeFilter);
  }, [apyHistory, timeFilter]);

  console.log(chartData);

  const getChartTitle = () => {
    switch (timeFilter) {
      case "30d":
        return "APY History (Last 30 Days)";
      case "6m":
        return "APY History (Last 6 Months)";
      case "12m":
      default:
        return "APY History (Last 12 Months)";
    }
  };

  if (poolLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-10 w-40" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (poolError) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              Failed to load pool details: {(poolError as Error).message}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pools
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Pools
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Pool Details</h1>
        </div>
        {poolData?.category && (
          <Badge variant="secondary" className="text-sm">
            {poolData.category}
          </Badge>
        )}
      </div>

      {/* Pool Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Information</CardTitle>
          <CardDescription>
            Detailed information about {poolData?.project} pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span className="font-medium">{poolData?.pool}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chain:</span>
                    <Badge variant="default">{poolData?.chain}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project:</span>
                    <span className="font-medium">{poolData?.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symbol:</span>
                    <span className="font-medium">{poolData?.symbol}</span>
                  </div>
                  {poolData?.poolMeta && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pool Meta:</span>
                      <span className="font-medium">{poolData.poolMeta}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Financial Data</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVL:</span>
                    <span className="font-medium">
                      ${poolData?.tvlUsd?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">APY:</span>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      {poolData?.apy?.toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base APY:</span>
                    <span className="font-medium">
                      {poolData?.apyBase?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward APY:</span>
                    <span className="font-medium">
                      {poolData?.apyReward?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tokens Section */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {poolData?.rewardTokens && poolData.rewardTokens.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Reward Tokens</h4>
                  <div className="flex flex-wrap gap-2">
                    {poolData.rewardTokens.map(
                      (token: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {token}
                        </Badge>
                      )
                    )}
                  </div>
                </div>
              )}

              {poolData?.underlyingTokens &&
                poolData.underlyingTokens.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Underlying Tokens</h4>
                    <div className="flex flex-wrap gap-2">
                      {poolData.underlyingTokens.map(
                        (token: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {token}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {poolData?.url && (
            <div className="mt-6">
              <Button asChild variant="outline">
                <a
                  href={poolData.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on protocol
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* APY History Chart Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>{getChartTitle()}</CardTitle>
              <CardDescription>Historical APY performance</CardDescription>
            </div>
            <Tabs
              value={timeFilter}
              onValueChange={(value) => setTimeFilter(value as TimeFilter)}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                <TabsTrigger value="30d" className="text-xs">
                  30D
                </TabsTrigger>
                <TabsTrigger value="6m" className="text-xs">
                  6M
                </TabsTrigger>
                <TabsTrigger value="12m" className="text-xs">
                  12M
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {apyLoading && (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Skeleton className="h-8 w-32 mx-auto" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          )}

          {apyError && (
            <div className="h-96 flex items-center justify-center">
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Chart Error
                  </CardTitle>
                  <CardDescription>
                    Failed to load APY history: {(apyError as Error).message}
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}

          {chartData.length > 0 ? (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={timeFilter === "12m" ? -45 : 0}
                    textAnchor={timeFilter === "12m" ? "end" : "middle"}
                    height={timeFilter === "12m" ? 60 : 40}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value.toFixed(2)}%`}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)}%`,
                      "APY",
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="apy"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: "var(--primary)" }}
                    name="APY"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            !apyLoading &&
            !apyError && (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                No APY history data available for the selected time period.
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}
