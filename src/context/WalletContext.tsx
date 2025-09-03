"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  const connectWallet = () => {
    const metamaskConnector = connectors.find((c) => c.id === "injected");
    console.log(metamaskConnector);
    if (metamaskConnector) {
      connect({ connector: metamaskConnector });
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connect: connectWallet,
        disconnect,
        isConnecting: isPending,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
