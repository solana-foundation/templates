import HomePageClient from '@/components/HomePageClient';
import Providers from '@/providers/provider';

export default function HomePage() {
  return (
    <Providers>
      <HomePageClient />
    </Providers>
  );
}
