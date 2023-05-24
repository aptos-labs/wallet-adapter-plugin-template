# Aptos wallet plugin template for wallet builders to interact with the Aptos Wallet Adapter

This repo provides wallet builders a pre-made class with all required wallet functionality following the [wallet standard](https://aptos.dev/standards/wallets) for easy and fast development to interact with the [Aptos Wallet Adapter](https://github.com/aptos-labs/aptos-wallet-adapter)

---

### Usage

- `fork` this repo
- run `npm install` or `yarn install`
- Open `src/index.ts`
- Change all `AptosWindow` appereances to `<Your-Wallet-Name>Window`
- Change `AptosWalletName` to be `<Your-Wallet-Name>WalletName`
- Change `url` to match your website url
- Change `icon` to your wallet icon (pay attention to the required format)

- Change `window.aptos` to be `window.<your-wallet-name>`

> **_NOTE:_** Ensure the `name` prop is the same as the `window.<name>`. The adapter will look for the matching name when detecting a wallet. For example, if your wallet's name prop is `Petra`, then the window should be `window.petra`.

> **_NOTE2_** window object key (i.e `window.<name>`) has to be lowercase exact match (`petra`). Wallet name prop can have capitalization (`Petra` / `PetraWallet`)

- Make sure the `Window Interface` has `<your-wallet-name>` as a key (instead of `aptos`)
- Open `__tests/index.test.tsx` and change `AptosWallet` to `<Your-Wallet-Name>Wallet`
- Run tests with `npm run test` - all tests should pass

At this point, you have a ready wallet class with all required properties and functions to integrate with the Aptos Wallet Adapter.

### Publish as a Package

Next step is to publish your wallet as a npm package so dapps can install it as a dependency.

- Make sure to update `package.json` name, description, author and any other properties.
- Run `npm install` then `npm run build` - a `dist` folder should be available
- (optional) Run `npm publish --dry-run` to see what would get published (make sure there is a `dist` folder)

Creating and publishing scoped public packages
https://docs.npmjs.com/creating-and-publishing-scoped-public-packages

Creating and publishing unscoped public packages
https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages

### Add your name to the wallets list

Once the package is published, you can create a PR against the [aptos-wallet-adapter](https://github.com/aptos-labs/aptos-wallet-adapter) repo and add your wallet name as a url to the npm package to the [supported wallet list](https://github.com/aptos-labs/aptos-wallet-adapter#supported-wallet-packages) on the README file.

---

> **_Note:_** if your wallet provides function that is not included, you should open a PR against [aptos-wallet-adapter](https://github.com/aptos-labs/aptos-wallet-adapter) in the [core package](https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/WalletCore.ts) so it would support this functionality.
> You can take a look at the `signTransaction` on the wallet [core package](https://github.com/aptos-labs/aptos-wallet-adapter/blob/main/packages/wallet-adapter-core/src/WalletCore.ts)
