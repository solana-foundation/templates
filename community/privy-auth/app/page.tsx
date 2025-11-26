import { Header } from "@/components/ui/header";
import { HomeContent } from "@/components/home-content";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      <HomeContent />
    </div>
  );
}

