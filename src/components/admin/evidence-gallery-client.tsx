'use client';

import { useRouter } from 'next/navigation';
import { EvidenceGallery } from './evidence-gallery';

interface Evidence {
  id: string;
  title: string;
  description: string | null;
  category: string;
  naac_metric: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  activity_date: string | null;
  activity_type: string | null;
  participants_count: number | null;
  created_at: string;
}

interface EvidenceGalleryClientProps {
  evidence: Evidence[];
}

export function EvidenceGalleryClient({ evidence }: EvidenceGalleryClientProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/admin/evidence/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data.error || 'Failed to delete document');
      return;
    }

    // Refresh the page to show updated list
    router.refresh();
  };

  return <EvidenceGallery evidence={evidence} onDelete={handleDelete} />;
}
