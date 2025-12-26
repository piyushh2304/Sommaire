import { Skeleton } from "@/components/ui/skeleton";
import BgGradient from "@/components/common/bg-gradient";

export default function Loading() {
  return (
    <main className="min-h-screen">
      <BgGradient
        className="from-emerald-200 
      via-teal-200 to-cyan-200"
      />
      <div className="container mx-auto flex flex-col gap-4">
        <div className="px-2 py-12 sm:py-24">
          <div className="flex gap-4 mb-8 justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-64 bg-gray-200" />
              <Skeleton className="h-4 w-96 bg-gray-200" />
            </div>
            <Skeleton className="h-10 w-32 bg-rose-100" />
          </div>

          <div
            className="grid grid-cols-1 gap-4 sm:gap-6
          md-grid-cols-2 lg:grid-cols-3 sm_px-0"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative group space-y-3 p-4 rounded-xl border border-gray-100 bg-white/70 backdrop-blur-sm h-[200px]"
              >
                  <Skeleton className="h-4 w-1/3 bg-gray-200" />
                  <Skeleton className="h-6 w-3/4 bg-gray-200" />
                  <div className="pt-4">
                      <Skeleton className="h-20 w-full bg-gray-100/50" />
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
