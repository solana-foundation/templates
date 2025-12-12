import { Header } from "@/components/ui/header";
import { ProtectedContent } from "@/components/protected-content";

export default function ProtectedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header />
      <ProtectedContent />
    </div>
  );
}
