// Loading skeleton for anonymous chat page
export default function Loading() {
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col animate-pulse">
      {/* Header */}
      <div className="bg-purple-50 border-b border-purple-200 p-4">
        <div className="h-6 w-56 bg-purple-200 rounded mb-2" />
        <div className="h-4 w-72 bg-purple-200 rounded" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden p-6 space-y-4">
        {/* AI Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <div className="h-4 w-2/3 bg-purple-100 rounded" />
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
        </div>

        {/* AI Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-4/5 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
          <div className="w-12 h-12 bg-purple-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
