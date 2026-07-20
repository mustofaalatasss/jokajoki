-- ==========================================
-- TAHAP B7: REALTIME REPLICATION
-- ==========================================
-- Instruksi: Jalankan ini di Supabase SQL Editor.
-- Mengaktifkan event realtime (WebSocket) untuk tabel operasional utama.

BEGIN;

-- 1. Pastikan publication 'supabase_realtime' ada
-- (Normalnya ini sudah otomatis ada di project Supabase baru)
-- CREATE PUBLICATION supabase_realtime;

-- 2. Tambahkan tabel-tabel operasional ke dalam publication agar perubahannya 
-- di-broadcast ke klien (Frontend).
ALTER PUBLICATION supabase_realtime ADD TABLE "LiveSession";
ALTER PUBLICATION supabase_realtime ADD TABLE "SessionCounter";
ALTER PUBLICATION supabase_realtime ADD TABLE "MabarEntry";
ALTER PUBLICATION supabase_realtime ADD TABLE "mabar_matches";
ALTER PUBLICATION supabase_realtime ADD TABLE "match_players";
ALTER PUBLICATION supabase_realtime ADD TABLE "fast_track_replacements";

COMMIT;
