import { Loader2 } from "lucide-react";

export default function PageLoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-[#E92628] mx-auto" />
          <p className="mt-4 text-gray-700 text-lg font-medium">Loading ...</p>
        </div>
      </div>
    </div>
  );
}
