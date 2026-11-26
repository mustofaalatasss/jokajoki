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

### 4. Multi-Tenant SaaS Architecture & Owner Control Panel (`/owner`)
- **Multi-Organization Data Isolation:** Setiap akun Joki/Streamer beroperasi di dalam ruang lingkup `Organization` tersendiri sehingga data pelanggan, riwayat sesi, dan keuangan terisolasi sepenuhnya.
- **SaaS Subscription Management:** Panel khusus Administrator/Owner untuk memantau metrik global (total *tenant* aktif, akumulasi sesi *live*, total perputaran omzet), memperpanjang masa aktif langganan bulanan/harian, hingga memblokir akun yang kedaluwarsa (`/expired`).
- **Read-Only Interactive Sandbox (`/demo`):** Pengunjung atau calon klien dapat mencoba seluruh antarmuka *Dashboard* secara langsung menggunakan data simulasi tanpa perlu mendaftar, dilindungi oleh *server-side mutation guard* (`checkDemoMutation`).

### 5. Customer CRM & Anti-Toxic Moderation
- Pencatatan basis data pelanggan otomatis yang dikelompokkan per minggu, histori *match* komprehensif, fitur pemberian **Bonus Match**, serta fitur **Blacklist** instan bagi pemain yang AFK/*troll* agar otomatis ditolak pada pendaftaran berikutnya.

---

## Arsitektur Sistem (*System Architecture*)

```mermaid
flowchart TB
    subgraph Clients["Client Layer"]
        Landing["Landing Page & Pricing (/)"]
        Demo["Interactive Sandbox (/demo)"]
        Dashboard["Streamer Dashboard (/dashboard)"]
        OBS["OBS Live Stream Overlay (/live)"]
        Owner["SaaS Owner Console (/owner)"]
    end

    subgraph NextApp["Next.js 16 App Router (Serverless / Node Runtime)"]
        Proxy["JWT Auth & Role Guard (src/proxy.ts)"]
        Actions["Transactional Server Actions"]
        Webhook["CI/CD Auto-Deploy Webhook (/api/webhook)"]
    end

    subgraph DataLayer["Persistence & Real-Time Layer"]
        Prisma["Prisma ORM (ACID Transactions)"]
        Postgres[("PostgreSQL Database")]
        Realtime["Supabase Realtime (Postgres Changes)"]
    end

    Landing --> NextApp
    Demo --> NextApp
    Dashboard --> Proxy --> Actions
    Owner --> Proxy --> Actions
    Actions --> Prisma --> Postgres
    Postgres --> Realtime --> OBS
```

---

## Tech Stack

| Kategori | Teknologi | Peran dalam Sistem |
| :--- | :--- | :--- |
| **Framework Utama** | **Next.js 16 (App Router)** & **React 19** | *Server Components*, *Server Actions*, *Routing*, dan optimasi performa rendering |
| **Bahasa Pemrograman** | **TypeScript 5** | *End-to-end static type safety* pada logika bisnis, skema data, dan komponen UI |
| **Database & Realtime** | **PostgreSQL** & **Supabase** | Penyimpanan relasional *multi-tenant* dan penyiaran perubahan tabel *real-time* untuk *overlay* |
| **ORM** | **Prisma ORM** | Pemodelan skema relasional kompleks dan eksekusi mutasi antrean dengan transaksi ACID |
| **Autentikasi & Keamanan** | **Better Auth** & **JOSE (JWT)** | Manajemen sesi berbasis *HTTP-only cookie*, verifikasi token JWT, dan *Role-Based Access Control* (`ADMIN`, `JOKI`, `USER`) |
| **Styling & Animasi** | **Tailwind CSS v4**, **Framer Motion**, **Lucide** | *Design system* kustom bertema *Esports Tournament* dengan animasi interaktif berkecepatan tinggi |
| **Deployment & DevOps** | **PM2**, **Git Webhook**, **Linux VPS / Vercel** | *Zero-downtime background rebuild* otomatis melalui *secured deployment webhook* |

---

## Struktur Direktori Utama

```text
├── prisma/
│   ├── schema.prisma          # Skema database multi-tenant (User, Organization, LiveSession, MabarEntry, MabarMatch, dll.)
│   └── clear.ts               # Utilitas pembersihan data development
├── public/
│   └── brand/                 # Aset identitas visual & logo Joka Joki
├── src/
│   ├── app/
│   │   ├── (main)/            # Area terproteksi Streamer/Joki
│   │   │   ├── dashboard/     # Panel kontrol live: Skuad Aktif, Antrean, Fast Track, & Rekap Sesi
│   │   │   ├── customers/     # CRM pelanggan mingguan & statistik loyalitas
│   │   │   ├── history/       # Riwayat pertandingan & log sesi
│   │   │   └── settings/      # Konfigurasi identitas Joki, penguncian Role, & Rate Card harga
│   │   ├── demo/              # Sandbox interaktif publik tanpa login (Read-Only Guarded)
│   │   ├── live/              # Halaman widget transparan real-time untuk OBS / TikTok Live
│   │   ├── owner/             # Panel Super-Admin SaaS (manajemen langganan & analitik global)
│   │   ├── login/ & register/ # Alur autentikasi tenant & pembuatan organisasi otomatis
│   │   └── api/               # Endpoint Auth handler & automated CI/CD deployment webhook
│   ├── components/            # Komponen UI reusable (Design System Esports) & Layout
│   ├── lib/                   # Konfigurasi Prisma, Supabase client, JWT helper, & session resolver
│   └── proxy.ts               # Middleware/Proxy otorisasi rute berbasis JWT & Role
```

---

## Panduan Menjalankan Proyek Lokal (*Getting Started*)

### 1. Prasyarat
- **Node.js** `v20+`
- **npm** / **pnpm** / **bun**
- Database **PostgreSQL** (disarankan menggunakan **Supabase** untuk fitur *Realtime Overlay*)

### 2. Instalasi Dependensi
```bash
git clone https://github.com/mustofaalatasss/jokajoki.git
cd jokajoki
npm install
```

### 3. Konfigurasi Environment Variables
Buat file `.env` pada direktori utama proyek dan sesuaikan konfigurasi berikut:

```env
# Database Connection (Prisma & Supabase Pooler)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Supabase Public Keys (Untuk Live Stream Overlay Realtime)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# Authentication Secret
BETTER_AUTH_SECRET="your-strong-random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Sinkronisasi Skema Database & Menjalankan Server
```bash
# Generate Prisma Client & dorong skema ke database
npx prisma generate
npx prisma db push

# Jalankan server development (Turbopack)
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat halaman utama, atau kunjungi [http://localhost:3000/demo](http://localhost:3000/demo) untuk langsung mencoba simulasi *Dashboard*.

---

## Eksplorasi Cepat untuk Recruiter & Reviewer

Ingin melihat langsung bagaimana produk ini bekerja tanpa membuat akun?
1. **Landing Page & Value Proposition:** [https://jokajoki.my.id](https://jokajoki.my.id)
2. **Live Dashboard Sandbox (Tanpa Login):** [https://jokajoki.my.id/demo](https://jokajoki.my.id/demo) — *Eksplorasi tampilan manajemen skuad aktif, indikator antrean VIP Fast Track, CRM pelanggan, dan pengaturan Rate Card secara langsung.*

---

<div align="center">
  <p>Dikembangkan oleh <strong>Mustofa</strong> — Membangun solusi teknologi praktis untuk ekonomi kreator & komunitas esports Indonesia.</p>
</div>
