'use client';

// Meeting Link Component - ULTRA SIMPLE VERSION
// No polling, no syncing, no complexity
// Just read from database on page load
// Author: MindSafe India Development Team

import { Video, Clock, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';

interface MeetingLinkProps {
  sessionId: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus?: string;
  initialMeetingLink?: string | null;
}

export function MeetingLink({ 
  sessionId, 
  sessionStartTime, 
  sessionEndTime, 
  sessionStatus = 'scheduled',
  initialMeetingLink = null 
}: MeetingLinkProps) {

  // Don't show meeting link for completed, cancelled, or no_show sessions
  if (sessionStatus !== 'scheduled') {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <Video className="w-5 h-5" />
          <span className="text-sm">Session {sessionStatus === 'completed' ? 'completed' : sessionStatus === 'cancelled' ? 'cancelled' : 'ended'}</span>
        </div>
      </div>
    );
  }

  const getTimeUntilSession = () => {
    const now = new Date();
    const startTime = new Date(sessionStartTime);
    const diffMs = startTime.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 0) return 'Session started';
    if (diffMins < 60) return `Starts in ${diffMins} minutes`;
    if (diffHours < 24) return `Starts in ${diffHours} hours`;
    return `Starts in ${diffDays} days`;
  };

  const copyToClipboard = () => {
    if (initialMeetingLink) {
      navigator.clipboard.writeText(initialMeetingLink);
      alert('Meeting link copied to clipboard!');
    }
  };

  // Meeting link available - show it
  if (initialMeetingLink) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Video className="w-5 h-5" />
              <span className="text-sm font-semibold">Meeting Link Ready</span>
            </div>
            <p className="text-xs text-green-600 mb-2">
              Both participants can now join the video session
            </p>
            
            {/* Meeting URL Display */}
            <div className="bg-white border border-green-300 rounded-md p-2 mb-3">
              <p className="text-xs font-mono text-gray-700 break-all">{initialMeetingLink}</p>
            </div>
            
            <div className="flex gap-2">
              <a
                href={initialMeetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Join Video Session
              </a>
              
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 text-sm font-medium rounded-lg hover:bg-green-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-green-200">
          <p className="text-xs text-green-600">
            💡 Tip: Test your camera and microphone before joining
          </p>
        </div>
      </div>
    );
  }

  // No meeting link yet - show simple message to refresh
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">{getTimeUntilSession()}</span>
          </div>
          <p className="text-xs text-blue-600">
            Meeting link will appear here when generated. Refresh the page to see it.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Video className="w-4 h-4" />
          Refresh Page
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <p className="text-xs text-blue-600">
          💡 Ask the other participant to generate the link, then refresh this page
        </p>
      </div>
    </div>
  );
}
