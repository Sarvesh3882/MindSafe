// Loading skeleton for check-in page
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-pulse">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="h-8 w-3/4 bg-gray-200 rounded mx-auto mb-4" />
            <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto" />
          </div>

          {/* Options */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-lg" />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div className="h-10 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
