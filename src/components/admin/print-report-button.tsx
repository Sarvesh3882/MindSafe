'use client';

export function PrintReportButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-[#3DBE29] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#32A822] transition-colors shadow-sm"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Download PDF
    </button>
  );
}
