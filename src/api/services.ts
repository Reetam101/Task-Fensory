import { PoolType } from "./../lib/types";
const pools = [
  {
    category: "Lending",
    chain: "Ethereum",
    project: "aave-v3",
    poolId: "db678df9-3281-4bc2-a8bb-01160ffdd648",
  },
  {
    category: "Lending",
    chain: "Ethereum",
    project: "compound-v3",
    poolId: "c1ca08e4-d618-415e-ad63-fcee58705469",
  },
  {
    category: "Lending",
    chain: "Ethereum",
    project: "maple",
    poolId: "8edffd02-cdbb-43f7-bca6-954e5fe56813",
  },
  {
    category: "Liquid Staking",
    chain: "Ethereum",
    project: "lido",
    poolId: "747c1d2a-c668-4682-b9f9-296708a3dd90",
  },
  {
    category: "Liquid Staking",
    chain: "Ethereum",
    project: "binance-staked-eth",
    poolId: "80b8bf92-b953-4c20-98ea-c9653ef2bb98",
  },
  {
    category: "Liquid Staking",
    chain: "Ethereum",
    project: "stader",
    poolId: "90bfb3c2-5d35-4959-a275-ba5085b08aa3",
  },
  {
    category: "Yield Aggregator",
    chain: "Ethereum",
    project: "cian-yield-layer",
    poolId: "107fb915-ab29-475b-b526-d0ed0d3e6110",
  },
  {
    category: "Yield Aggregator",
    chain: "Ethereum",
    project: "yearn-finance",
    poolId: "05a3d186-2d42-4e21-b1f0-68c079d22677",
  },
  {
    category: "Yield Aggregator",
    chain: "Ethereum",
    project: "beefy",
    poolId: "1977885c-d5ae-4c9e-b4df-863b7e1578e6",
  },
];

const poolIdsMap = new Map(pools.map((obj) => [obj.poolId, obj.category]));

export const getPoolsData = async () => {
  const res = await fetch("https://yields.llama.fi/pools");
  if (res.ok) {
    const { status, data } = await res.json();
    // return only those items whose poolId matches with the one we have in the array
    const result = data
      .filter((d: PoolType) => poolIdsMap.has(d.pool))
      .map((item: PoolType) => {
        console.log(item);
        return {
          ...item,
          category: poolIdsMap.get(item.pool),
        };
      });
    return result;
  }
  return null;
};

export const getPoolData = async (poolId: string) => {
  const res = await fetch("https://yields.llama.fi/pools");
  if (res.ok) {
    const { status, data } = await res.json();

    const result = data.find((pool: PoolType) => pool.pool === poolId);

    if (!poolId) throw new Error("Pool not found!");

    const category = poolIdsMap.get(poolId);
    return {
      ...result,
      category: category || "unknown",
    };
  }
  return null;
};

export interface APYHistoryData {
  data: {
    timestamp: string;
    apy: number;
  }[];
}

export const fetchAPYHistory = async (
  poolId: string
): Promise<APYHistoryData> => {
  const response = await fetch(`https://yields.llama.fi/chart/${poolId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch APY history");
  }
  return response.json();
};
