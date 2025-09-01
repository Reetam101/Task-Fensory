export type PoolType = {
  pool: string;
  chain: string;
  project: string;
  category: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase: number;
  apyReward: number;
  rewardTokens: string[];
  underlyingTokens: string[];
  poolMeta: string;
  url: string;
  predictions: {
    predictedClass: string;
    predictedProbability: number;
    binnedConfidence: number;
  };
};
