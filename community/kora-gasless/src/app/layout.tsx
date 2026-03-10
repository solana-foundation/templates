import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';

export const metadata = {
  title: 'Kora Gasless Demo',
  description: 'Gasless transactions with Kora',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
