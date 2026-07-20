-- ==========================================
-- TAHAP B7: ROW LEVEL SECURITY (RLS)
-- ==========================================
-- Instruksi: Jalankan ini di Supabase SQL Editor.

-- 1. Enable RLS pada semua tabel bisnis
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrganizationMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LiveSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SessionCounter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MabarEntry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mabar_matches" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "match_players" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fast_track_replacements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;

-- 2. Fungsi Pembantu: Mengecek apakah user yang sedang login adalah member dari organisasi
-- Catatan: Karena menggunakan Better Auth ("User" table in public schema), 
-- dan auth.uid() dari Supabase Auth mungkin tidak terikat langsung.
-- Jika front-end mengirim kustom JWT dari Better Auth, Supabase perlu di-config 
-- untuk membaca claims tersebut. Asumsi di sini: User ID ter-set di request.jwt.claim.sub

CREATE OR REPLACE FUNCTION auth.user_is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public."OrganizationMember" 
    WHERE "organizationId" = org_id 
    AND "userId" = (current_setting('request.jwt.claims', true)::json->>'sub')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Membuat Kebijakan (Policies) berdasarkan Organization ID

-- Organization
CREATE POLICY "Member dapat melihat organisasi mereka"
ON "Organization" FOR SELECT
USING (auth.user_is_org_member(id));

-- OrganizationMember
CREATE POLICY "Member dapat melihat member lain di organisasi yang sama"
ON "OrganizationMember" FOR SELECT
USING (auth.user_is_org_member("organizationId"));

-- LiveSession
CREATE POLICY "Member dapat membaca/menulis sesi live mereka"
ON "LiveSession" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Customer
CREATE POLICY "Member dapat membaca/menulis pelanggan mereka"
ON "Customer" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- SessionCounter
CREATE POLICY "Member dapat membaca/menulis counter sesi mereka"
ON "SessionCounter" FOR ALL
USING (
  auth.user_is_org_member((SELECT "organizationId" FROM "LiveSession" WHERE id = "liveSessionId"))
)
WITH CHECK (
  auth.user_is_org_member((SELECT "organizationId" FROM "LiveSession" WHERE id = "liveSessionId"))
);

-- MabarEntry
CREATE POLICY "Member dapat membaca/menulis MabarEntry mereka"
ON "MabarEntry" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Payment
CREATE POLICY "Member dapat membaca/menulis transaksi pembayaran mereka"
ON "Payment" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Matches (mabar_matches)
CREATE POLICY "Member dapat membaca/menulis match mereka"
ON "mabar_matches" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Match Players
CREATE POLICY "Member dapat membaca/menulis pemain match mereka"
ON "match_players" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Fast Track Replacements
CREATE POLICY "Member dapat membaca/menulis pergantian fast track mereka"
ON "fast_track_replacements" FOR ALL
USING (auth.user_is_org_member("organizationId"))
WITH CHECK (auth.user_is_org_member("organizationId"));

-- Activity Logs
CREATE POLICY "Member dapat membaca log aktivitas mereka"
ON "activity_logs" FOR SELECT
USING (auth.user_is_org_member("organizationId"));

CREATE POLICY "Sistem dapat menulis log aktivitas"
ON "activity_logs" FOR INSERT
WITH CHECK (auth.user_is_org_member("organizationId"));
