export function DashboardSkeleton() {
  return (
    <div className="space-y-8 pb-12 animate-pulse">
      {/* Mesh Gradient Background Effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#3DBE29]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#4A90E2]/10 blur-[120px]" />
      </div>

      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded-lg" />
        <div className="h-4 w-48 bg-gray-200 rounded" />
      </div>

      {/* Hero banner skeleton */}
      <div className="glass rounded-3xl p-6 border border-white/60">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="h-24 bg-gray-200 rounded-2xl" />
          </div>
          <div className="h-64 lg:h-80 bg-gray-200 rounded-2xl" />
        </div>
      </div>

      {/* Check-in tiles skeleton */}
      <div className="glass rounded-3xl p-6 border border-white/60">
        <div className="h-5 w-48 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Quick cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass rounded-3xl p-5 border border-white/60">
            <div className="w-10 h-10 bg-gray-200 rounded-xl mb-3" />
            <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-full bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
