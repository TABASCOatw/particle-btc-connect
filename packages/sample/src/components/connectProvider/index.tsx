'use client';

import {
  ConnectProvider as BTCConnectProvider,
  OKXConnector,
  UnisatConnector,
  XverseConnector,
} from '@particle-network/btc-connectkit';

if (typeof window !== 'undefined') {
  (window as any).__PARTICLE_ENVIRONMENT__ = process.env.NEXT_PUBLIC_PARTICLE_ENV;
}

export default function ConnectProvider({ children }: { children: React.ReactNode }) {
  return (
    <BTCConnectProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
        clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY as string,
        appId: process.env.NEXT_PUBLIC_APP_ID as string,
        aaOptions: {
          accountContracts: {
            BTC: [
              {
                chainIds: [686868, 28206, 80001],
                version: '1.0.0',
              },
            ],
          },
        },
      }}
      connectors={[new UnisatConnector(), new OKXConnector(), new XverseConnector()]}
    >
      {children}
    </BTCConnectProvider>
  );
}
