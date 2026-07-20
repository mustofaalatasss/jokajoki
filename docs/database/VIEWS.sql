-- ==========================================
-- TAHAP B6: DATABASE VIEWS
-- ==========================================

-- 1. v_active_squad
CREATE OR REPLACE VIEW v_active_squad AS
SELECT 
    me.id,
    me.organizationId,
    me.liveSessionId,
    me.customerId,
    c.mlNickname,
    c.primaryRole,
    c.secondaryRole,
    me.activeSlot,
    me.status,
    me.matchesRemaining
FROM "MabarEntry" me
JOIN "Customer" c ON me.customerId = c.id
WHERE me.activeSlot IS NOT NULL 
AND me.status IN ('sedang_main', 'siap', 'menunggu_siap', 'naik_ke_squad', 'dijeda_fast_track', 'kembali_bermain')
ORDER BY me.activeSlot ASC;


-- 2. v_regular_queue
CREATE OR REPLACE VIEW v_regular_queue AS
SELECT 
    me.id,
    me.organizationId,
    me.liveSessionId,
    me.registrationNumber,
    c.mlNickname,
    me.matchesPurchased,
    me.matchesRemaining,
    me.registeredAt
FROM "MabarEntry" me
JOIN "Customer" c ON me.customerId = c.id
WHERE me.serviceType = 'reguler'
AND me.status = 'menunggu_antrean'
ORDER BY me.registrationNumber ASC;


-- 3. v_waiting_fast_track
CREATE OR REPLACE VIEW v_waiting_fast_track AS
SELECT 
    me.id,
    me.organizationId,
    me.liveSessionId,
    me.registrationNumber,
    c.mlNickname,
    me.matchesPurchased,
    me.matchesRemaining,
    me.registeredAt
FROM "MabarEntry" me
JOIN "Customer" c ON me.customerId = c.id
WHERE me.serviceType = 'fast_track'
AND me.status = 'menunggu_pergantian'
ORDER BY me.registrationNumber ASC;


-- 4. v_paused_players
CREATE OR REPLACE VIEW v_paused_players AS
SELECT 
    me.id as paused_entry_id,
    me.organizationId,
    me.liveSessionId,
    c.mlNickname,
    me.matchesRemaining,
    ft.fastTrackEntryId,
    ft.originalSlot,
    ft.startedAt as paused_since
FROM "MabarEntry" me
JOIN "Customer" c ON me.customerId = c.id
JOIN "fast_track_replacements" ft ON me.id = ft.pausedEntryId
WHERE me.status = 'dijeda_fast_track'
AND ft.status = 'aktif';


-- 5. v_history
CREATE OR REPLACE VIEW v_history AS
SELECT 
    me.id,
    me.organizationId,
    me.liveSessionId,
    c.mlNickname,
    me.serviceType,
    me.matchesCompleted,
    me.completedAt
FROM "MabarEntry" me
JOIN "Customer" c ON me.customerId = c.id
WHERE me.status = 'selesai'
ORDER BY me.completedAt DESC;


-- 6. v_session_summary
CREATE OR REPLACE VIEW v_session_summary AS
SELECT 
    ls.id as liveSessionId,
    ls.organizationId,
    ls.sessionName,
    ls.status as session_status,
    (SELECT COUNT(*) FROM "MabarEntry" WHERE liveSessionId = ls.id AND activeSlot IS NOT NULL) as active_players_count,
    (SELECT COUNT(*) FROM "MabarEntry" WHERE liveSessionId = ls.id AND serviceType = 'reguler' AND status = 'menunggu_antrean') as regular_queue_count,
    (SELECT COUNT(*) FROM "MabarEntry" WHERE liveSessionId = ls.id AND serviceType = 'fast_track' AND status = 'menunggu_pergantian') as waiting_fast_track_count,
    (SELECT COUNT(*) FROM "MabarEntry" WHERE liveSessionId = ls.id AND status = 'dijeda_fast_track') as paused_players_count,
    (SELECT COUNT(*) FROM "mabar_matches" WHERE liveSessionId = ls.id) as total_matches_count,
    (SELECT COALESCE(SUM(matchesAdded), 0) FROM "Payment" WHERE liveSessionId = ls.id) as total_matches_sold,
    (SELECT COALESCE(SUM(amountRupiah - fastTrackFeeRupiah), 0) FROM "Payment" WHERE liveSessionId = ls.id) as match_revenue,
    (SELECT COALESCE(SUM(fastTrackFeeRupiah), 0) FROM "Payment" WHERE liveSessionId = ls.id) as fast_track_revenue,
    (SELECT COALESCE(SUM(amountRupiah), 0) FROM "Payment" WHERE liveSessionId = ls.id) as total_revenue
FROM "LiveSession" ls;
