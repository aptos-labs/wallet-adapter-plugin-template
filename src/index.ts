import {
  AptosWalletErrorResult,
  NetworkName,
  PluginProvider,
} from "@aptos-labs/wallet-adapter-core";
import type {
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
} from "@aptos-labs/wallet-adapter-core";
import { Types } from "aptos";
import { MSafeWallet } from "msafe-wallet";
import { toPluginProvider } from "./provider";
import { LOGO_PNG_BASE64 } from "./logo";

interface MSafeWindow extends Window {
  msafe?: PluginProvider;
}

declare const window: MSafeWindow;

export const MSafeWalletName = "MSafe" as WalletName<"MSafe">;

export class MSafeWalletAdapter implements AdapterPlugin {
  readonly name = MSafeWalletName;
  readonly icon = `data:image/png;base64,${LOGO_PNG_BASE64}` as const;

  private _origin?: string | string[];
  provider: PluginProvider | undefined = undefined;

  /**
   * @description create a MSafeWalletAdapter
   * @param origin allowlist of msafe website url, omit means accpets all msafe websites. you can pass a single url or an array of urls.
   * @example
   *  // 1. Initialize MSafeWalletAdapter with default allowlist:
   *      new MSafeWalletAdapter();
   *  // 2. Initialize MSafeWalletAdapter with a single MSafe url:
   *      new MSafeWalletAdapter('https://app.m-safe.io');
   *  // 3. Initialize MSafeWalletAdapter with an array of MSafe urls:
   *      new MSafeWalletAdapter(['https://app.m-safe.io', 'https://testnet.m-safe.io', 'https://partner.m-safe.io']);
   *  // 4. Initialize MSafeWalletAdapter with a single network type:
   *      new MSafeWalletAdapter('Mainnet');
   *  // 5. Initialize MSafeWalletAdapter with an array of network types:
   *      new MSafeWalletAdapter(['Mainnet', 'Testnet', 'Partner']);
   */
  constructor(origin?: string | string[]) {
    this._origin = origin;
    if (MSafeWallet.inMSafeWallet()) {
      MSafeWallet.new(origin)
        .then((msafe) => {
          window.msafe = this.provider = toPluginProvider(msafe);
        })
        .catch((e) => {
          console.error('MSafe connect error:', e);
        });
    }
  }

  get url() {
    const defaultOrigin = this._origin instanceof Array ? this._origin[0] : this._origin;
    if (typeof window === 'undefined' || typeof window.location === 'undefined' || typeof window.location.href === 'undefined') return MSafeWallet.getOrigin(defaultOrigin);
    return MSafeWallet.getAppUrl(defaultOrigin);
  }

  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${MSafeWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${MSafeWalletName} Account Error`;
    return response;
  }

  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  async signAndSubmitTransaction(
    transaction: Types.TransactionPayload,
    options?: any
  ): Promise<{ hash: Types.HexEncodedBytes }> {
    try {
      const response = await this.provider?.signAndSubmitTransaction(
        transaction,
        options
      );
      if ((response as AptosWalletErrorResult).code) {
        throw new Error((response as AptosWalletErrorResult).message);
      }
      return response as { hash: Types.HexEncodedBytes };
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${MSafeWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${MSafeWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${MSafeWalletName} Network Error`;
      return {
        name: response as NetworkName,
      };
    } catch (error: any) {
      throw error;
    }
  }

  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (newNetwork: {
        networkName: NetworkInfo;
      }): Promise<void> => {
        callback({
          name: newNetwork.networkName,
          chainId: undefined,
          api: undefined,
        });
      };
      await this.provider?.onNetworkChange(handleNetworkChange);
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  async onAccountChange(callback: any): Promise<void> {
    try {
      const handleAccountChange = async (
        newAccount: AccountInfo
      ): Promise<void> => {
        if (newAccount?.publicKey) {
          callback({
            publicKey: newAccount.publicKey,
            address: newAccount.address,
          });
        } else {
          const response = await this.connect();
          callback({
            address: response?.address,
            publicKey: response?.publicKey,
          });
        }
      };
      await this.provider?.onAccountChange(handleAccountChange);
    } catch (error: any) {
      console.log(error);
      const errMsg = error.message;
      throw errMsg;
    }
  }
}
