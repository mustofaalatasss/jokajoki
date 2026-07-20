# PROMPT TAHAP 1 — FONDASI FRONTEND SAJA

Jalankan prompt ini hanya setelah Tahap 0 selesai dan dokumennya sudah diperiksa.

---

Kerjakan **Fase F1 — Fondasi Frontend** untuk aplikasi **MABAR CTRL**.

Baca terlebih dahulu:

- `docs/PRD.md`
- `docs/DESIGN_SYSTEM.md`
- `.agents/skills/mabarvip-stepwise-delivery/SKILL.md`
- `IMPLEMENTATION_PLAN.md`
- `PROJECT_STRUCTURE.md`

## Ruang Lingkup yang Boleh Dikerjakan

1. Scaffold proyek Next.js dengan App Router, React, TypeScript, dan Tailwind CSS.
2. Gunakan struktur `src/`.
3. Pasang font heading condensed dan font body netral sesuai design system.
4. Buat design tokens global untuk warna, typography, radius, spacing, border, dan motion.
5. Buat komponen UI dasar:
   - Button
   - Badge
   - Card
   - Input
   - Select
   - Dialog shell
   - Drawer shell
   - Table shell
   - Toast shell
   - Empty state
6. Buat layout aplikasi:
   - sidebar desktop;
   - header/topbar;
   - content container;
   - drawer sidebar untuk layar kecil.
7. Buat navigasi placeholder berbahasa Indonesia:
   - Dashboard Live
   - Pelanggan
   - Riwayat
   - Pengaturan
8. Buat route placeholder untuk seluruh menu.
9. Buat halaman Dashboard Live sebagai placeholder terstruktur, tetapi JANGAN membangun kartu Squad Aktif, antrean, Fast Track, atau logika match pada tahap ini.
10. Buat satu halaman internal `/design-system` untuk memeriksa seluruh komponen dan token secara visual.
11. Gunakan ikon garis yang konsisten. Jangan memakai emoji.
12. Pastikan desain terasa gaming/esports premium dengan aksen merah, bukan template AI.

## Larangan

- Jangan membuat backend.
- Jangan memasang atau mengonfigurasi Supabase.
- Jangan membuat autentikasi nyata.
- Jangan membuat API route.
- Jangan membuat schema database.
- Jangan membuat integrasi Saweria.
- Jangan membuat logika antrean.
- Jangan membuat logika Fast Track.
- Jangan membuat mesin pertandingan.
- Jangan mengerjakan Fase F2 atau sesudahnya.
- Jangan memakai ungu/cyan neon, gradient blob, glassmorphism berlebihan, ikon sparkle/robot/AI, dan kartu terlalu bulat.
- Jangan memakai gambar atau logo Mobile Legends.

## Kualitas Kode

- komponen modular;
- TypeScript ketat;
- tidak menggunakan `any` tanpa alasan;
- tidak ada error console;
- semantic HTML;
- keyboard focus terlihat;
- kontras memadai;
- responsive pada 1440 px, 1280 px, 768 px, dan 390 px;
- tidak ada dead code.

## Verifikasi Wajib

1. Jalankan lint.
2. Jalankan type-check.
3. Jalankan production build.
4. Jalankan dev server.
5. Buka aplikasi melalui browser terintegrasi.
6. Periksa `/dashboard` dan `/design-system`.
7. Periksa tampilan desktop serta mobile.
8. Periksa console browser.
9. Ambil screenshot hasil desktop dan mobile bila Antigravity mendukung artifact screenshot.
10. Perbarui `WALKTHROUGH.md` dengan:
    - file yang dibuat/diubah;
    - keputusan desain;
    - hasil lint/type-check/build;
    - hasil pemeriksaan browser;
    - masalah yang masih tersisa.

Setelah Fase F1 selesai dan terverifikasi, BERHENTI. Jangan mulai membuat Dashboard Live lengkap. Tunggu instruksi Fase F2.
