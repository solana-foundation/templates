# kit-expo-privy

This is an [Expo](https://expo.dev) project pre-configured with [Uniwind](https://uniwind.dev/) for styling and Solana libraries.

## Technologies

- [Expo](https://expo.dev)
- [Uniwind](https://uniwind.dev/) (Tailwind CSS for React Native)
- [@solana/kit](https://github.com/solana-labs/solana-web3.js)
- [@wallet-ui/react-native-kit](https://github.com/wallet-ui/wallet-ui)

## Set up Privy

1. Log in or sign up at the [Privy dashboard](https://dashboard.privy.io).
2. On the [organization overview](https://dashboard.privy.io/organization-overview), click `New app`.
3. Enter your app name, select `Mobile app`, and click `Create app`.
4. Save the `App ID`, then click `Close`.
5. Under `User management` in the sidebar, go to `Authentication`.
6. In the `External wallets` card, enable `SVM (Solana) wallets`.
7. Go to `App settings` > `Clients` and save the `Client ID` for the default mobile app client.
8. Copy `.env.example` to `.env` and set:

   ```bash
   EXPO_PUBLIC_PRIVY_APP_ID=your-privy-app-id
   EXPO_PUBLIC_PRIVY_CLIENT_ID=your-privy-client-id
   ```

Do not put the Privy app secret in `.env`; this Expo app only uses public client-side Privy identifiers.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

This steps builds the dependencies for the development client.

```bash
npm run android
```

In the output, you'll find options to open the app in a:

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Uniwind documentation](https://uniwind.dev/): Learn how to style your app with Tailwind CSS.
- [Solana documentation](https://solana.com/docs): Learn how to build on Solana.
