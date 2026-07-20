# Struktur Proyek Frontend Joka Joki

Proyek frontend Joka Joki akan menggunakan kerangka kerja Next.js dengan App Router, TypeScript, dan Tailwind CSS. Berikut adalah rencana struktur direktori yang akan digunakan pada Fase F1 dan seterusnya.

```text
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (font, metadata global)
│   ├── page.tsx                # Halaman login/landing (placeholder)
│   ├── dashboard/              # Halaman Dashboard Live
│   │   └── page.tsx
│   ├── customers/              # Halaman Pelanggan
│   │   └── page.tsx
│   ├── history/                # Halaman Riwayat
│   │   └── page.tsx
│   ├── settings/               # Halaman Pengaturan
│   │   └── page.tsx
│   └── design-system/          # Halaman visualisasi komponen UI (Fase F1)
│       └── page.tsx
├── components/                 # Komponen React yang dapat digunakan ulang
│   ├── layout/                 # Komponen struktur halaman utama
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── AppLayout.tsx
│   │   └── MobileDrawer.tsx
│   ├── dashboard/              # Komponen khusus halaman Dashboard Live
│   │   ├── ActiveSquad.tsx
│   │   ├── MatchControl.tsx
│   │   ├── QueueTable.tsx
│   │   └── ...
│   ├── ui/                     # Komponen antarmuka dasar (Design System)
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Dialog.tsx
│   │   ├── Toast.tsx
│   │   └── EmptyState.tsx
│   └── ...                     # Komponen domain lain (fast-track, match, dll)
├── data/                       # Data statis dan simulasi
│   └── mock-data.ts            # Data dummy untuk pengembangan UI tanpa backend
├── lib/                        # Utilitas fungsi murni (format tanggal, clsx, dll)
│   └── utils.ts
├── types/                      # Definisi tipe TypeScript (Interface pelanggan, status, dll)
│   └── index.ts
├── hooks/                      # Custom React Hooks
└── styles/                     # Styling global dan CSS Modules jika ada
    └── globals.css             # Konfigurasi Tailwind & Design Tokens
```

## Catatan Tambahan
- Seluruh file komponen antarmuka (`components/ui`) tidak akan menggunakan library UI bawaan secara mentah tanpa disesuaikan dengan Design System Joka Joki (aksen merah, premium esports).
- Tidak ada folder `api/` atau folder backend yang diinisialisasi sebelum persetujuan penuh untuk Fase Backend (B1).
