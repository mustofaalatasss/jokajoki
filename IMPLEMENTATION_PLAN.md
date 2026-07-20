# IMPLEMENTATION PLAN — Joka Joki

Berikut adalah roadmap implementasi Joka Joki secara bertahap (F0 sampai F5) sesuai dengan PRD dan panduan desain.

> [!WARNING]
> **PENTING: Backend tidak boleh dibuat sebelum seluruh frontend selesai disetujui. Backend baru dimulai pada Fase B1.**

## Fase F0 — Aturan Proyek (Tahap Saat Ini)
- Membaca dokumen spesifikasi (`docs/PRD.md`, `docs/DESIGN_SYSTEM.md`, `.agents/SKILL.md`).
- Membuat `IMPLEMENTATION_PLAN.md` dan `PROJECT_STRUCTURE.md`.
- Verifikasi konsistensi dokumen.

## Fase F1 — Fondasi Frontend
- Menginisialisasi proyek Next.js (App Router), React, TypeScript, Tailwind CSS.
- Menambahkan font (Barlow Condensed, Inter).
- Membangun *design tokens* global (warna, tipografi, ukuran) di `globals.css` sesuai dengan Design System.
- Membangun komponen UI *shell* dasar (Button, Badge, Card, Input, Select, Dialog, Drawer, Table, Toast, Empty state).
- Membuat *layout* aplikasi utama (Sidebar, Header, Content container, Mobile Drawer).
- Menyiapkan rute *placeholder* untuk Dashboard Live, Pelanggan, Riwayat, Pengaturan, dan `/design-system`.
- Menggunakan ikon berbasis garis (tidak memakai emoji atau ilustrasi berlebihan).
- Memverifikasi hasil melalui *lint*, *build*, dan tampilan visual di *browser*.

## Fase F2 — Dashboard Live Statis
- Membangun komponen antarmuka spesifik halaman Dashboard Live.
- Menyusun data *mock* tersentralisasi untuk mensimulasikan antrean, Squad Aktif, dan Fast Track.
- Menampilkan kartu Squad Aktif dengan indikator slot, rank, progres match, dan status.
- Membangun tabel Antrean Reguler dan panel kontrol pertandingan secara statis.

## Fase F3 — Form dan Interaksi Lokal
- Menambahkan formulir Tambah Pelanggan dengan validasi (memilih Reguler/Fast Track).
- Menambahkan *state* lokal di React untuk memperbarui antarmuka secara interaktif (mengubah status *Siap*, dsb).
- Menangani form penggantian *role* dan penambahan jumlah *match*.

## Fase F4 — Mesin Simulasi Match dan Fast Track
- Mengaktifkan tombol Mulai dan Selesaikan pertandingan.
- Menjalankan logika bisnis: mengurangi sisa *match* secara otomatis.
- Mengelola status *Fast Track*: mengganti pemain reguler dan menjeda sisa *match* pemain terkait dengan aman.
- Memindahkan pemain dengan sisa *match* nol secara instan ke Riwayat tanpa tersisa di Squad Aktif.
- Memunculkan kembali pemain yang dijeda setelah sesi *Fast Track* habis.

## Fase F5 — Halaman Pendukung dan QA
- Melengkapi halaman Pelanggan, Riwayat, dan Pengaturan.
- Memastikan responsivitas penuh (desktop 1440px turun ke mobile 390px) serta *accessibility*.
- Validasi akhir UI/UX dan pengujian kelayakan kode.

---

> Setelah Fase F5 selesai dan disetujui, proyek baru akan beralih ke desain arsitektur backend, Supabase, API, database, autentikasi, serta integrasi sistem nyata (Fase B1).
