// Loading skeleton for chat page
export default function Loading() {
  return (
    <div className="h-[calc(100vh-200px)] flex flex-col animate-pulse">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="h-6 w-48 bg-gray-200 rounded" />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden p-6 space-y-4">
        {/* AI Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>

        {/* User Message */}
        <div className="flex gap-3 justify-end">
          <div className="flex-1 space-y-2 flex flex-col items-end">
            <div className="h-4 w-2/3 bg-blue-100 rounded" />
            <div className="h-4 w-1/3 bg-blue-100 rounded" />
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-200 flex-shrink-0" />
        </div>

        {/* AI Message */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-5/6 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex gap-3">
          <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
