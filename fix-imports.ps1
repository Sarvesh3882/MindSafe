# Fix Supabase imports in API routes

$files = @(
    "src/app/api/prescriptions/suggest/route.ts",
    "src/app/api/prescriptions/my-prescriptions/route.ts",
    "src/app/api/prescriptions/student/[studentId]/route.ts",
    "src/app/api/prescriptions/[id]/route.ts",
    "src/app/api/prescription-messages/send/route.ts",
    "src/app/api/prescription-messages/[prescriptionId]/route.ts",
    "src/app/api/prescription-messages/edit/[id]/route.ts",
    "src/app/api/prescription-messages/unread-count/route.ts",
    "src/app/api/meetings/generate/route.ts",
    "src/app/api/meetings/session/[sessionId]/route.ts",
    "src/app/api/meetings/cleanup/route.ts"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Replace the import
        $content = $content -replace "import \{ createRouteHandlerClient \} from '@supabase/auth-helpers-nextjs';", "import { createClient } from '@/lib/supabase/server';"
        
        # Remove cookies import if it exists
        $content = $content -replace "import \{ cookies \} from 'next/headers';\r?\n", ""
        
        # Replace createRouteHandlerClient usage
        $content = $content -replace "const supabase = createRouteHandlerClient\(\{ cookies \}\);", "const supabase = await createClient();"
        
        Set-Content $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    }
}

Write-Host "All files fixed!"
