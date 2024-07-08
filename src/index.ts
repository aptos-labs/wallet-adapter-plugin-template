import {
  AptosWalletErrorResult,
  AccountInfo,
  AdapterPlugin,
  NetworkInfo,
  SignMessagePayload,
  SignMessageResponse,
  WalletName,
  PluginProvider,
} from "@aptos-labs/wallet-adapter-core";
import { TxnBuilderTypes, Types } from "aptos";

/**
 * WARNING - This template is for legacy Wallet plugins. 
 * This is NOT the recommended way to implement a Wallet Adapter plugin currently.
 * 
 * Instead, please follow the instructions here for implementing an AIP-62 compliant wallet:
 * https://aptos.dev/en/build/sdks/wallet-adapter/wallets
 * 
 * AIP-62 compliant wallets are backwards compatible with this legacy template.
 */

/**
 * Sections of the code which need to be revised will be marked with a "REVISION" comment.
 * We recommend using the REVISION comments like a checklist and deleting them as you go.
 * Ex. REVISION - Update this section.
 * 
 * Function implementations are for DEMONSTRATION PURPOSES ONLY. Please ensure you rewrite all features
 * to use your Wallet as the method of communicating on-chain.
 */

// REVISION - Rename AptosWindow to <Your Wallet Name>Window. Ex. "PetraWindow"
// Ensure that you update all references to AptosWindow with the new name.
interface AptosWindow extends Window {
  // REVISION - Rename "aptos" to your wallet name in all lowercase. Ex. "petra"
  // This must match your wallet's name property.
  // Ensure that you update all references to `AptosWindow.aptos` with the new name.
  aptos?: PluginProvider; 
}

/**
 * A window containing a DOM document; the document property points to the DOM document loaded in that window.
 * We have extended it to include the plugin provider you implement with the required features.
 */
declare const window: AptosWindow;

/**
 * REVISION - 
 * 1. Change the name of the variable to match your wallet (Ex. AptosWalletName -> PetraWalletName)
 * 2. Update the value to match your Wallet's name (Ex. "Aptos" -> "Petra" and WalletName<"Aptos"> -> WalletName<"Petra">)
 */
export const AptosWalletName = "Aptos" as WalletName<"Aptos">;

// REVISION AptosWallet
export class AptosWallet implements AdapterPlugin {
  // REVISION - Change the variable to your renamed "AptosWalletName" variable. (Ex. "PetraWalletName")
  readonly name = AptosWalletName; 

  // REVISION - Include the link to create an account using your wallet or your primary website. 
  // (Ex. https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?hl=en)
  readonly url = "";

  /**
   * REVISION - Set the icon to be a base64 encoding of your Wallet's logo.
   * 
   * The icon data must be of the format:
   * 1. "data:image/"
   * 2. The icon's file extension, which must be one of:
   *    - "svg+xml"
   *    - "webp"
   *    - "png"
   *    - "gif"
   * 3. ";base64,"
   * 4. The base64 encoding of the image file.
   * 
   * See the current value of icon for an example of this format.
   */ 
  readonly icon = "";

  // REVISION - Optionally set providerName to be the actual property name for "AptosWindow.aptos" if it is different than your AptosWalletName. 
  // Ex. If your WalletName was "AptosWallet", but your property on "AptosWindow" was still ".aptos", you could set providerName to "aptos".
  // readonly providerName = "aptos";

  /**
   * REVISION - deepLinkProvider is an optional property for wallets that supports mobile app.
   * By providing the `deeplinkProvider` prop, the adapter will redirect the user
   * from a mobile web browser to the wallet's mobile app on `connect`.
   *
   * `url` param is given by the provider and represents the current website url the user is on.
   */
  // deeplinkProvider(data: { url: string }): string {
  //   return `aptos://explore?url=${data.url}`;
  // }

  // REVISION - Ensure you update `window.aptos` to be the renamed property name. (Ex. window.petra)
  provider: PluginProvider | undefined =
    typeof window !== "undefined" ? window.aptos : undefined;

  /**
   * REVISION - Implement this function using your Wallet. 
   * Connect an account using this Wallet. 
   * This must wait for the user to sign in to the Wallet provider and confirm they are ok sharing
   * details with the dapp.
   * 
   * @returns Whether the user approved connecting their account, and account info.
   * @throws Error when unable to connect to the Wallet provider.
   */
  async connect(): Promise<AccountInfo> {
    try {
      const accountInfo = await this.provider?.connect();
      if (!accountInfo) throw `${AptosWalletName} Address Info Error`;
      return accountInfo;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * REVISION - Implement this function using your Wallet. 
   * Look up the account info for the currently connected wallet address on the chosen network. 
   * 
   * @returns Return account info.
   */
  async account(): Promise<AccountInfo> {
    const response = await this.provider?.account();
    if (!response) throw `${AptosWalletName} Account Error`;
    return response;
  }

  /**
   * REVISION - Implement this function using your Wallet. 
   * Remove the permission of the Wallet class to access the account that was connected.
   * 
   * @returns Resolves when done cleaning up.
   */
  async disconnect(): Promise<void> {
    try {
      await this.provider?.disconnect();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * @param transaction - A transaction that the user should have the ability to sign if they choose to.
   * @param options - Additional options for signing the transaction.
   * @returns The result of whether the user chose to sign the transaction or not.
   * @throws Error when unable to sign and submit the transaction.
   */
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

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * @param transaction - A BCS transaction that the user should have the ability to sign if they choose to.
   * @param options - Additional options for signing the BCS transaction.
   * @returns The result of whether the user chose to sign the BCS transaction or not.
   * @throws Error when unable to sign and submit the BCS transaction.
   */
  async signAndSubmitBCSTransaction(
    transaction: TxnBuilderTypes.TransactionPayload,
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

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * @param message - A message to sign with the private key of the connected account.
   * @returns A user response either with a signed message, or the user rejecting to sign.
   * @throws Error when unable to sign the message.
   */
  async signMessage(message: SignMessagePayload): Promise<SignMessageResponse> {
    try {
      if (typeof message !== "object" || !message.nonce) {
        `${AptosWalletName} Invalid signMessage Payload`;
      }
      const response = await this.provider?.signMessage(message);
      if (response) {
        return response;
      } else {
        throw `${AptosWalletName} Sign Message failed`;
      }
    } catch (error: any) {
      const errMsg = error.message;
      throw errMsg;
    }
  }

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * Return the name, chainId, and url of the network connection your wallet is using to connect to the Aptos chain.
   * 
   * @returns Which network the connected Wallet is pointing to.
   */
  async network(): Promise<NetworkInfo> {
    try {
      const response = await this.provider?.network();
      if (!response) throw `${AptosWalletName} Network Error`;
      return {
        name: response.name,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * When users indicate a Network change should occur, update your Wallet accordingly.
   * 
   * @returns when the logic is resolved.
   * @throws Error when unable to handle network change.
   */
  async onNetworkChange(callback: any): Promise<void> {
    try {
      const handleNetworkChange = async (
        networkName: NetworkInfo
      ): Promise<void> => {
        callback({
          name: networkName,
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

  /**
   * REVISION - Implement this function using your Wallet. 
   * 
   * An event which will be triggered anytime an Account changes.
   * 
   * @returns when the logic is resolved.
   * @throws Error when unable to handle account change.
   */
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
