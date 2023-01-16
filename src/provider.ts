import { AccountInfo, NetworkInfo, NetworkName, PluginProvider, SignMessagePayload } from "@aptos-labs/wallet-adapter-core";
import { HexString } from "aptos";
import { MSafeWallet } from "msafe-wallet";

const toNetworkName = (network: string) => network as NetworkName;

export function toPluginProvider(msafe: MSafeWallet):PluginProvider{
    return {
      connect: () => {
        return msafe.connect();
      },
      account: () => {
        return msafe.account();
      },
      disconnect: () => {
        return msafe.disconnect();
      },
      signAndSubmitTransaction: async (transaction: any, options?: any) => {
        const result = await msafe.signAndSubmit(transaction, options);
        return { hash: HexString.fromUint8Array(result).hex()};
      },
      signMessage: (message: SignMessagePayload) => {
        throw "unpported";
      },
      network: () => {
        return msafe.network().then(network=>toNetworkName(network));
      },
      onAccountChange: async (listener: (newAddress: AccountInfo) => Promise<void>) => {
        return msafe.onChangeAccount(newAddress=>listener(newAddress));
      },
      onNetworkChange: async (listener: (network: {
        networkName: NetworkInfo;
      }) => Promise<void>) => {
        const listenerProxy = async (network: string) => {
          const chainId = await msafe.chainId();
          const networkName = {
            name: toNetworkName(network),
            chainId: chainId.toString(),
          };
          listener({ networkName });
        };
        return msafe.onChangeNetwork(network=>listenerProxy(network));
      },
    }
  }