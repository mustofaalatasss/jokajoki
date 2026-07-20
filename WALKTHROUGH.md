# WALKTHROUGH — Fase F1 (Fondasi Frontend)

## File yang Dibuat/Diubah
- `src/app/globals.css`: Menyimpan variabel *design tokens* (warna, font, spacing) sesuai dengan panduan `DESIGN_SYSTEM.md`.
- `src/app/layout.tsx`: Memuat font **Barlow Condensed** (untuk heading) dan **Inter** (untuk body) secara optimal melalui `next/font/google`. Font default Next.js dihapus.
- `src/lib/utils.ts`: Utilitas fungsi pembantu `cn` (Tailwind Merge dan clsx) untuk menyederhanakan penulisan CSS kelas yang kondisional.
- `src/components/ui/*.tsx`: Komponen antarmuka pengguna fundamental (*shell*), termasuk: `Button`, `Badge`, `Card`, `Input`, `Select`, `Dialog`, `Drawer`, `Table`, `Toast`, dan `EmptyState`.
- `src/components/layout/*.tsx`: Komponen tata letak aplikasi, seperti `Sidebar`, `Header`, dan `AppLayout` (termasuk *Mobile Drawer* untuk responsivitas).
- `src/app/(main)/*`: Menampung seluruh rute *placeholder* (`/dashboard`, `/customers`, `/history`, `/settings`, dan `/design-system`). Semuanya dibungkus dengan `MainLayout` yang memanggil `AppLayout`.

## Keputusan Desain
- **UI Murni Kustom:** Komponen antarmuka sengaja dibangun secara modular (*functional UI shell*) untuk menghindari ketergantungan berlebihan pada library eksternal secara langsung, memastikan tampilan tetap identik dengan prinsip UI *esports premium*.
- **Tanpa Turbopack (Sementara):** Karena kegagalan dalam mengunduh *native bindings* Turbopack untuk Windows x64 selama instalasi (isu jaringan), skrip *build* di `package.json` diubah untuk secara eksplisit memanggil Webpack (`next build --webpack`).

## Hasil Lint & Build
- `npm run lint` telah sukses berjalan tanpa hambatan (beberapa masalah TypeScript *empty interface* sudah diperbaiki menjadi *type alias*).
- `npm run build` berjalan dengan normal (menggunakan Webpack).

## Masalah Tersisa
- Tidak ada isu yang mendesak. Fitur logika bisnis dan interaktivitas penuh siap dikerjakan pada Fase F2 dan Fase F3.
