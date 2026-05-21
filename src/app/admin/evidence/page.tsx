import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DocumentUploadForm } from '@/components/admin/document-upload-form';
import { EvidenceGalleryClient } from '@/components/admin/evidence-gallery-client';

export default async function AdminEvidencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Get admin profile
  const { data: adminProfile } = await supabase
    .from('users')
    .select('college_id, role')
    .eq('id', user.id)
    .single();

  if (!adminProfile || adminProfile.role !== 'admin') {
    redirect('/login');
  }

  // Fetch all evidence for this college
  const { data: evidence } = await supabase
    .from('naac_evidence')
    .select('*')
    .eq('college_id', adminProfile.college_id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E2E]">NAAC Evidence Management</h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Upload and manage documents for NAAC compliance reporting
        </p>
      </div>

      {/* Upload Form */}
      <DocumentUploadForm collegeId={adminProfile.college_id} />

      {/* Evidence Gallery */}
      <div>
        <h2 className="text-xl font-bold text-[#1E1E2E] mb-4">Uploaded Documents</h2>
        <EvidenceGalleryClient evidence={evidence || []} />
      </div>
    </div>
  );
}
