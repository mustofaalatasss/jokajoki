<div align="center">
  <img src="./public/brand/joka-joki-banner.gif" alt="Joka Joki Animated Logo Banner" width="680" />

  <h1>JOKA JOKI</h1>
  <p><strong>Multi-Tenant Esports Queue, Live Squad Rotation & Streamer Operations SaaS</strong></p>

  <p>
    <a href="https://jokajoki.my.id"><img src="https://img.shields.io/badge/Live_Platform-jokajoki.my.id-E23B49?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Website" /></a>
    <a href="https://jokajoki.my.id/demo"><img src="https://img.shields.io/badge/Interactive_Demo-Try_Dashboard-F59E0B?style=for-the-badge&logo=gamepad&logoColor=black" alt="Live Demo" /></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL_%26_Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=black" alt="Supabase" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

---

## Ringkasan Proyek (Executive Summary)

**Joka Joki** adalah platform **Software-as-a-Service (SaaS) Multi-Tenant** yang dirancang khusus untuk mendigitalisasi operasional *live streaming* **Mabar VIP (Main Bareng)** dan manajemen skuad bagi *Streamer* serta penjoki profesional *Mobile Legends: Bang Bang (MLBB)*.

Alih-alih mencatat donasi dan urutan pemain secara manual di *Notepad* atau membaca *spam live chat* yang rawan salah urutan, Joka Joki mengotomatiskan seluruh siklus operasional *live* dalam satu panel kelas turnamen: mulai dari **antrean berbasis *role* (*Role-Based Matchmaking*)**, **jalur prioritas VIP (*Non-Destructive Fast Track*)**, **sinkronisasi *overlay* OBS *real-time***, hingga **rekonsiliasi pendapatan otomatis per sesi**.

---

## Latar Belakang Masalah & Visi Produk

### Masalah Nyata di Lapangan (*The Problem*)
Ekosistem *live streaming* gaming di Indonesia berkembang pesat dengan monetisasi *Mabar Berbayar / Donasi VIP*. Namun, operasional di balik layar masih sangat manual dan tidak terstruktur:
1. **Kekacauan Antrean Manual:** Pencatatan di catatan teks membuat urutan pemain sering terlewat dan memicu komplain penonton (*"Bang, giliran gue kapan?"*).
2. **Tabrakan Komposisi *Role* (*Draft Conflict*):** Empat penonton masuk ke *lobby* dengan *role* yang sama (misal sama-sama *Jungler*), merusak kualitas pertandingan dan *win-rate* streamer.
3. **Dilema Monetisasi VIP vs Reguler:** Memasukkan donatur VIP secara mendadak sering kali menggeser penonton reguler secara tidak adil atau membuat pencatatan sisa kuota *match* berantakan.
4. **Buta Finansial Harian:** Streamer kesulitan melacak total *match* menang/kalah, jumlah pelanggan unik, sisa utang *match* (*carry-over*), dan estimasi omzet bersih setiap selesai *live*.

### Visi Produk (*Our Vision*)
> **"Menjadi sistem operasi (*Operating System*) standar industri bagi kreator gaming, streamer, dan agensi komunitas esports di Asia Tenggara untuk mengelola interaksi komersial bersama audiens secara otomatis, transparan, aman, dan berkeadilan."**

### Misi Utama
- **Operational Excellence:** Menghemat waktu *setup lobby* agar kreator dapat 100% fokus pada *gameplay* dan *entertainment*.
- **Fair & Maximized Monetization:** Menghadirkan algoritma antrean prioritas yang meningkatkan konversi pelanggan VIP (*Fast Track*) tanpa pernah menghanguskan hak bermain pelanggan reguler.
- **Zero-Credential Trust:** Menjamin keamanan 100% akun game karena sistem bekerja murni melalui manajemen *lobby* & ID/Nickname tanpa pernah meminta kredensial login game pengguna.
- **Scalable B2B SaaS:** Menyediakan infrastruktur *multi-tenant* siap pakai dengan sistem langganan mandiri bagi ratusan *streamer* secara bersamaan.

---

## Fitur Unggulan & Solusi Rekayasa (*Key Engineering Features*)

### 1. Smart Role-Based Priority Queue & Fast Track Preemption
- **Validasi *Role* Otomatis:** Mendukung pembagian *role* MLBB (`Jungler`, `Roamer`, `Mid Laner`, `Gold Laner`, `Exp Laner`, `Flex`) serta mengunci *role* utama Host/Joki agar tidak dipilih pelanggan.
- **Non-Destructive VIP Fast Track:** Ketika pesanan *Fast Track* masuk pada kondisi *lobby* penuh (sebelum *match* dimulai), sistem secara cerdas melakukan *preemptive pause* (`dijeda_fast_track`) pada pemain reguler dengan *role* serupa dan menempatkannya di prioritas teratas untuk slot kosong berikutnya—tanpa mengurangi jatah *match* mereka sedikit pun.
- **Deteksi Tabrakan Sesama VIP (*Collision Guard*):** Memberikan peringatan konfirmasi otomatis apabila dua pelanggan *Fast Track* memesan *role* spesifik yang sama di sesi aktif.

### 2. Automated Squad Lifecycle & Transactional Batch Processing
- **Auto-Pull Replacement:** Begitu suatu *match* berakhir dan kuota bermain pelanggan habis (atau pelanggan di-*kick* karena tidak responsif/`tidak_ada_kabar`), sistem otomatis menarik kandidat antrean teratas yang memiliki *role* sesuai ke slot kosong menggunakan transaksi database atomik (`prisma.$transaction`).
- **Quick Process Simulation:** Memungkinkan operator merangkum beberapa *match* sekaligus (input jumlah *match* & kalah) dan membiarkan sistem menghitung pengurangan kuota serta pergantian skuad secara otomatis.
- **Session Carry-Over & Financial Recap:** Fitur **Tutup Sesi** secara otomatis merekapitulasi *Win/Loss*, jumlah pelanggan unik, estimasi pendapatan berdasarkan *Rate Card* kustom (Reguler & Fast Track), serta memindahkan sisa antrean yang belum selesai ke sesi *live* berikutnya secara otomatis.

### 3. Real-Time OBS Live Overlay (`/live`)
- Widget *overlay* transparan berestetika turnamen esports yang dirancang khusus untuk dipasang sebagai *Browser Source* di **OBS Studio** atau **TikTok Live Studio**.
- Disinkronkan secara *real-time* menggunakan **Supabase Realtime (`postgres_changes`)** sehingga penonton di *live stream* dapat melihat skuad yang sedang bertanding, *timer* durasi *match* berjalan, dan 5 antrean berikutnya secara langsung tanpa *refresh* manual.

### 4. Multi-Tenant SaaS Architecture & Subscription Governance
- **Multi-Organization Data Isolation:** Setiap akun Joki/Streamer beroperasi di dalam ruang lingkup *tenant* tersendiri sehingga data pelanggan, riwayat sesi, dan keuangan terisolasi sepenuhnya.
- **SaaS Subscription Lifecycle:** Sistem manajemen masa aktif langganan otomatis (bulanan/harian), pemantauan metrik operasional global, serta proteksi akses akun kedaluwarsa secara *real-time*.
- **Read-Only Interactive Sandbox (`/demo`):** Pengunjung atau *recruiter* dapat mencoba seluruh antarmuka *Dashboard* secara langsung menggunakan data simulasi tanpa perlu mendaftar, dilindungi oleh *server-side mutation guard*.

### 5. Customer CRM & Anti-Toxic Moderation
- Pencatatan basis data pelanggan otomatis yang dikelompokkan per minggu, histori *match* komprehensif, fitur pemberian **Bonus Match**, serta fitur **Blacklist** instan bagi pemain yang AFK/*troll* agar otomatis ditolak pada pendaftaran berikutnya.

---

## Arsitektur Sistem (*System Architecture*)

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        Landing["Landing Page & Pricing"]
        Demo["Interactive Sandbox Demo"]
        Dashboard["Streamer Live Dashboard"]
        OBS["OBS Live Stream Overlay"]
        Admin["SaaS Management Console"]
    end

    subgraph NextApp["Application Layer (Next.js App Router)"]
        Auth["JWT Auth & Role-Based Access Guard"]
        Actions["Transactional Server Actions"]
    end

    subgraph DataLayer["Persistence & Real-Time Layer"]
        Prisma["Prisma ORM (ACID Transactions)"]
        Postgres[("PostgreSQL Database")]
        Realtime["Realtime Event Broadcast"]
    end

    Landing --> NextApp
    Demo --> NextApp
    Dashboard --> Auth --> Actions
    Admin --> Auth --> Actions
    Actions --> Prisma --> Postgres
    Postgres --> Realtime --> OBS
```

---

## Tech Stack

| Kategori | Teknologi | Peran dalam Sistem |
| :--- | :--- | :--- |
| **Framework Utama** | **Next.js (App Router)** & **React 19** | *Server Components*, *Server Actions*, *Routing*, dan optimasi performa rendering |
| **Bahasa Pemrograman** | **TypeScript** | *End-to-end static type safety* pada logika bisnis, skema data, dan komponen UI |
| **Database & Realtime** | **PostgreSQL** & **Supabase** | Penyimpanan relasional *multi-tenant* dan sinkronisasi data *real-time* untuk *overlay* |
| **ORM** | **Prisma ORM** | Pemodelan skema relasional kompleks dan eksekusi mutasi antrean dengan transaksi ACID |
| **Autentikasi & Keamanan** | **Better Auth** & **JWT (HTTP-Only Cookie)** | Otentikasi aman anti-XSS/CSRF serta *Role-Based Access Control (RBAC)* |
| **Styling & Animasi** | **Tailwind CSS v4**, **Framer Motion**, **Lucide** | *Design system* kustom bertema *Esports Tournament* dengan animasi interaktif berkecepatan tinggi |

---

## Eksplorasi Cepat untuk Recruiter & Perusahaan

Ingin melihat langsung bagaimana produk ini bekerja tanpa membuat akun?
1. **Landing Page & Value Proposition:** [https://jokajoki.my.id](https://jokajoki.my.id)
2. **Live Dashboard Sandbox (Tanpa Login):** [https://jokajoki.my.id/demo](https://jokajoki.my.id/demo) — *Eksplorasi tampilan manajemen skuad aktif, indikator antrean VIP Fast Track, CRM pelanggan, dan pengaturan Rate Card secara langsung.*

---

<div align="center">
  <p>Dikembangkan oleh <strong>Mustofa</strong> — Membangun solusi teknologi praktis untuk ekonomi kreator & komunitas esports Indonesia.</p>
</div>
