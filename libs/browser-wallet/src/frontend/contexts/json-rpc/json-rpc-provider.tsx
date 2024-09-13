import { useMemo } from 'react';

import { useCreateClient } from './hooks/create-client';
import { createServer } from './hooks/create-server';
import { JsonRpcContext } from './json-rpc-context';

export type SendMessage<T = any> = (
  method: string,
  parameters?: any,
  propagateErrors?: boolean
) => Promise<T>;

export interface JsonRpcNotification {
  method: string;
  params: any;
  jsonrpc: '2.0';
}

/**
 * Provides the client and server for JSON-RPC communication
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const { client, request } = useCreateClient();
  const server = useMemo(() => createServer(), []);
  const value = useMemo(
    () => ({
      client,
      server,
      request,
    }),
    [client, request, server]
  );
  return (
    <JsonRpcContext.Provider value={value}>{children}</JsonRpcContext.Provider>
  );
};
