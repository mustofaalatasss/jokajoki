---
name: mabarvip-stepwise-delivery
description: Menjaga pembangunan MABAR CTRL tetap bertahap, frontend-first, berbahasa Indonesia, sesuai PRD, dan selalu diverifikasi sebelum melanjutkan.
---

# MABAR CTRL Stepwise Delivery

Ikuti aturan berikut untuk seluruh tugas pada workspace ini.

## Sumber Kebenaran

1. Baca `docs/PRD.md`.
2. Baca `docs/DESIGN_SYSTEM.md`.
3. Kerjakan hanya ruang lingkup yang secara eksplisit disebut dalam prompt aktif.
4. Jika prompt bertentangan dengan PRD, hentikan bagian yang bertentangan dan jelaskan perbedaannya.

## Larangan Melompati Tahap

- Jangan mengerjakan fase berikutnya.
- Jangan menambahkan backend, database, Supabase, autentikasi nyata, API, webhook, atau integrasi Saweria sampai diminta secara eksplisit.
- Jangan membuat fitur tambahan di luar ruang lingkup aktif.
- Jangan melakukan refactor besar yang tidak diperlukan.
- Jangan menghapus file yang sudah bekerja tanpa alasan teknis yang jelas.

## Proses Wajib

Sebelum menulis kode:

1. inspeksi workspace;
2. buat atau perbarui `IMPLEMENTATION_PLAN.md`;
3. tulis daftar file yang akan dibuat atau diubah;
4. tulis kriteria verifikasi untuk tahap aktif.

Setelah menulis kode:

1. jalankan lint;
2. jalankan type-check jika tersedia;
3. jalankan production build;
4. jalankan aplikasi;
5. periksa melalui browser terintegrasi;
6. periksa console browser;
7. uji layout desktop dan mobile;
8. buat atau perbarui `WALKTHROUGH.md`;
9. jelaskan file yang berubah, hasil pengujian, dan masalah tersisa;
10. berhenti dan tunggu instruksi tahap berikutnya.

## Aturan UI

- Seluruh teks pengguna harus berbahasa Indonesia.
- Nama layanan `Fast Track` tetap digunakan.
- Desain gaming/esports premium dengan aksen merah gelap.
- Hindari ungu/cyan neon, gradient blob, glassmorphism berlebihan, ikon AI, dan kartu sangat bulat.
- Jangan memakai aset berhak cipta Mobile Legends.
- Gunakan data fiktif.
- Komponen harus modular dan dapat digunakan ulang.
- Utamakan aksesibilitas, keyboard focus, kontras, dan responsive layout.

## Aturan Bisnis Penting

- Antrean reguler mengikuti waktu pendaftaran paling awal.
- Jumlah match tidak memengaruhi urutan.
- Sisa match nol langsung masuk Riwayat dan hilang dari Squad Aktif.
- Fast Track menggantikan pemain reguler aktif pada pertandingan berikutnya.
- Pemain yang dijeda tidak kehilangan sisa match.
- Setelah Fast Track selesai, pemain yang dijeda olehnya mempunyai hak kembali.
- Metode otomatis tidak boleh memakai jumlah atau sisa match.
