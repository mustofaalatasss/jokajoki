# Desain Database Joka Joki

Dokumen ini mendeskripsikan struktur database PostgreSQL (Supabase) untuk sistem Joka Joki, mencakup multitenancy, sesi live, antrean, fast track, dan riwayat.

## 1. `organizations`
Menyimpan akun streamer atau entitas bisnis.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier unik organisasi |
| `name` | String | Nama organisasi / streamer |
| `slug` | String (Unique) | URL slug organisasi |
| `logo_url` | String | URL logo organisasi |
| `timezone` | String | Zona waktu operasional (mis. Asia/Jakarta) |
| `created_at` | Timestamp | Waktu pembuatan |
| `updated_at` | Timestamp | Waktu pembaruan terakhir |

## 2. `profiles`
Menyimpan profil pengguna yang tersinkronisasi dengan Supabase Auth.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Berelasi dengan auth.users |
| `full_name` | String | Nama lengkap pengguna |
| `avatar_url` | String | URL foto profil |
| `created_at` | Timestamp | Waktu pendaftaran |
| `updated_at` | Timestamp | Waktu pembaruan terakhir |

## 3. `organization_members`
Menghubungkan pengguna dengan organisasi beserta hak aksesnya.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier unik |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `user_id` | UUID (FK) | Relasi ke `profiles` |
| `role` | Enum | `pemilik`, `streamer`, `admin`, `operator` |
| `is_active` | Boolean | Status keanggotaan aktif/tidak |
| `created_at` | Timestamp | Waktu bergabung |

## 4. `live_sessions`
Menyimpan sesi live streamer yang bertindak sebagai wadah antrean pada hari/waktu tertentu.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier unik sesi |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `session_name` | String | Nama sesi (mis: Mabar Malam Minggu) |
| `status` | Enum | `belum_dimulai`, `aktif`, `istirahat`, `selesai`, `dibatalkan` |
| `default_price_per_match` | Integer | Harga default per match (Rupiah) |
| `default_fast_track_fee` | Integer | Biaya tambahan default fast track (Rupiah) |
| `maximum_active_slots` | Integer | Maksimal pemain aktif dalam squad (default: 4) |
| `started_at` | Timestamp | Waktu sesi dimulai |
| `ended_at` | Timestamp | Waktu sesi diakhiri |
| `created_by` | UUID (FK) | Operator yang membuat sesi |
| `created_at` | Timestamp | Waktu record dibuat |
| `updated_at` | Timestamp | Waktu record diperbarui |

## 5. `session_counters`
Menyimpan nomor urutan pendaftaran dan nomor pertandingan secara atomik (mencegah duplikasi).

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `live_session_id` | UUID (PK/FK) | Relasi 1:1 ke `live_sessions` |
| `next_registration_number`| Integer | Nomor urut pendaftaran selanjutnya |
| `next_match_number` | Integer | Nomor urut match selanjutnya |
| `updated_at` | Timestamp | Terakhir diupdate |

## 6. `customers`
Menyimpan entitas pelanggan Mobile Legends agar bisa dilacak riwayat lintas-sesinya.
**Data Unik:** Kombinasi `organization_id`, `ml_user_id`, dan `ml_server_id`.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier unik pelanggan |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `saweria_name` | String | Nama penyumbang di Saweria |
| `ml_nickname` | String | Nickname in-game MLBB |
| `ml_user_id` | String | User ID MLBB |
| `ml_server_id` | String | Server ID MLBB |
| `current_rank` | String | Rank terakhir yang diketahui |
| `primary_role` | String | Role utama (Roam/Mid/Gold/Exp/Jungler) |
| `secondary_role` | String | Role alternatif |
| `notes` | Text | Catatan khusus pelanggan |
| `created_at` | Timestamp | Waktu mendaftar pertama kali |
| `updated_at` | Timestamp | Pembaruan terakhir profil |

## 7. `mabar_entries`
Tabel operasional utama. Satu baris = satu pelanggan dalam satu sesi live.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier entry |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `live_session_id` | UUID (FK) | Relasi ke `live_sessions` |
| `customer_id` | UUID (FK) | Relasi ke `customers` |
| `registration_number` | Integer | Nomor urut pendaftaran di sesi ini |
| `registered_at` | Timestamp | Waktu mendaftar |
| `service_type` | Enum | `reguler`, `fast_track` |
| `status` | Enum | Lihat tabel Status di STATUS_TRANSITIONS.md |
| `primary_role` | String | Request role utama |
| `secondary_role` | String | Request role alternatif |
| `current_played_role` | String | Role yang sedang dimainkan saat ini |
| `rank_snapshot` | String | Rank saat mendaftar di sesi ini |
| `matches_purchased` | Integer | Total match yang dibeli |
| `matches_completed` | Integer | Total match yang sudah diselesaikan |
| `matches_remaining` | Integer | (matches_purchased - matches_completed) |
| `active_slot` | Integer | Nomor slot di squad (1-4). Null jika tidak main. |
| `squad_joined_at` | Timestamp | Waktu naik ke squad |
| `called_at` | Timestamp | Waktu dipanggil (opsional) |
| `ready_at` | Timestamp | Waktu konfirmasi siap |
| `completed_at` | Timestamp | Waktu seluruh match selesai (Riwayat) |
| `pause_count` | Integer | Berapa kali pelanggan ini dijeda |
| `notes` | Text | Catatan operasional entry ini |
| `created_by` | UUID (FK) | Siapa yang mendaftarkan |
| `created_at` | Timestamp | Waktu dibuat |
| `updated_at` | Timestamp | Waktu diperbarui |

## 8. `payments`
Mencatat transaksi masuk (Saweria dll). Nilai uang disimpan dalam Rupiah (integer bulat).

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier transaksi |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `live_session_id` | UUID (FK) | Relasi ke `live_sessions` |
| `mabar_entry_id` | UUID (FK) | Relasi ke `mabar_entries` |
| `customer_id` | UUID (FK) | Relasi ke `customers` |
| `payment_source` | String | Cth: `saweria`, `manual_cash` |
| `payment_type` | Enum | `pembelian_awal`, `tambah_match`, `biaya_fast_track`, `koreksi`, `pengembalian_dana` |
| `amount_rupiah` | Integer | Nominal asli Rupiah tanpa desimal |
| `matches_added` | Integer | Jumlah match yang ditambahkan dari payment ini |
| `fast_track_fee_rupiah`| Integer | Bagian uang yang dialokasikan untuk fee fast track |
| `raw_saweria_message` | Text | Payload/Pesan webhook asli dari saweria |
| `recorded_by` | UUID (FK) | Siapa yang memproses |
| `paid_at` | Timestamp | Waktu bayar aktual |
| `created_at` | Timestamp | Waktu record dibuat |

## 9. `matches`
Tabel pencatatan per-game/match yang dimainkan dalam sesi tersebut.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier match |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `live_session_id` | UUID (FK) | Relasi ke `live_sessions` |
| `match_number` | Integer | Pertandingan ke-berapa di sesi ini |
| `status` | Enum | `menunggu`, `sedang_berjalan`, `selesai`, `dibatalkan` |
| `started_at` | Timestamp | Waktu mulai (masuk land of dawn) |
| `completed_at` | Timestamp | Waktu selesai (base hancur) |
| `cancelled_at` | Timestamp | Waktu dibatalkan (opsional) |
| `notes` | Text | Catatan match (menang/kalah, dll) |
| `created_by` | UUID (FK) | Siapa yang memulai |
| `created_at` | Timestamp | Waktu record dibuat |

## 10. `match_players`
Relasi m-to-m antara `matches` dan `mabar_entries`. Mencatat siapa saja yang ada di dalam match tersebut.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `match_id` | UUID (FK) | Relasi ke `matches` |
| `mabar_entry_id` | UUID (FK) | Relasi ke `mabar_entries` |
| `customer_id` | UUID (FK) | Relasi ke `customers` |
| `slot_number` | Integer | Slot ke-berapa saat match dimulai (1-4) |
| `played_role` | String | Role in-game aktual yang dimainkan |
| `joined_match` | Boolean | True jika benar-benar bermain. (Sisa match hanya dikurangi jika ini True). |
| `created_at` | Timestamp | Waktu record dibuat |

## 11. `fast_track_replacements`
Melacak log/relasi pergantian pemain reguler oleh pemain Fast Track. 
**Aturan:** 1 FT hanya boleh menggantikan 1 Pemain. 1 Pemain hanya boleh dijeda oleh 1 FT aktif.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier unik |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `live_session_id` | UUID (FK) | Relasi ke `live_sessions` |
| `fast_track_entry_id` | UUID (FK) | Entry ID si pengguna Fast Track |
| `paused_entry_id` | UUID (FK) | Entry ID korban yang dijeda |
| `original_slot` | Integer | Nomor slot yang dirampas (1-4) |
| `selection_method` | Enum | `manual`, `urutan_pendaftaran`, `paling_lama_bermain`, `paling_baru_masuk`, `berdasarkan_role` |
| `status` | Enum | `menunggu`, `aktif`, `selesai`, `dibatalkan` |
| `started_at` | Timestamp | Kapan pergantian mulai terjadi (FT masuk squad) |
| `ended_at` | Timestamp | Kapan pergantian berakhir (Pemain reguler kembali) |
| `created_by` | UUID (FK) | Siapa yang mengeksekusi penggantian |
| `created_at` | Timestamp | Waktu direkam |

## 12. `activity_logs`
Mencatat seluruh aksi, audit trail, dan perubahan state yang terjadi.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|------------|
| `id` | UUID (PK) | Identifier |
| `organization_id` | UUID (FK) | Relasi ke `organizations` |
| `live_session_id` | UUID (FK) | Relasi ke `live_sessions` (nullable) |
| `actor_user_id` | UUID (FK) | Siapa yang melakukan aksi (`profiles`) |
| `action` | String | Nama aksi (mis: `FAST_TRACK_APPLIED`) |
| `entity_type` | String | Tabel target (mis: `mabar_entries`) |
| `entity_id` | UUID | ID target |
| `description` | Text | Deskripsi manusiawi dari aksi |
| `before_data` | JSONB | State JSON sebelum diubah |
| `after_data` | JSONB | State JSON setelah diubah |
| `created_at` | Timestamp | Waktu log |

---

## Aturan Bisnis & Ketentuan Integrasi

1. **Keamanan RLS**: Semua tabel wajib memiliki RLS policy berdasarkan `organization_id`. `profiles` hanya bisa membaca/menulis data organisasinya sendiri via join ke `organization_members`.
2. **Kalkulasi Matematis**: `matches_remaining` = `matches_purchased` - `matches_completed`. Aplikasi klien DILARANG menyentuh `matches_remaining` secara langsung. Hitung otomatis via trigger atau fungsi database.
3. **Pertandingan Selesai**: Dijalankan dalam 1 Database Transaction utuh. Mengubah `status` match, iterasi `match_players`, menambah `matches_completed` di `mabar_entries`, menangani logika FT selesai, dan log aktivitas.
4. **Riwayat Otomatis**: Jika `status = selesai` dan `matches_remaining = 0`, entri masuk kriteria "Riwayat" secara implisit. Tidak ada tabel terpisah untuk riwayat.
