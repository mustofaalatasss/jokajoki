# DESIGN SYSTEM — MABAR CTRL

## Prinsip

1. Gaming/esports premium, bukan cyberpunk murahan.
2. Merah sebagai aksen, bukan memenuhi seluruh layar.
3. Data operasional harus lebih dominan daripada dekorasi.
4. Tidak memakai pola visual aplikasi AI generik.
5. Semua label dan status menggunakan Bahasa Indonesia.

## Hindari

- ungu/cyan neon;
- gradient blob;
- glassmorphism berlebihan;
- kartu terlalu bulat;
- ikon sparkle, robot, otak, bintang AI;
- ilustrasi Mobile Legends berhak cipta;
- teks gradient;
- background ramai;
- animasi berlebihan.

## Token

```css
:root {
  --bg: #08090B;
  --surface-1: #101216;
  --surface-2: #16191F;
  --surface-3: #1C2027;
  --border: #2A2E36;
  --red-dark: #7F1724;
  --red: #B91F2E;
  --red-bright: #E23B49;
  --text: #F4F5F7;
  --muted: #969DA8;
  --success: #36B873;
  --warning: #E2A33B;
  --danger: #D74343;
}
```

## Typography

- Heading: Barlow Condensed, fallback sans-serif.
- Body: Inter, fallback sans-serif.
- Statistik menggunakan tabular numerals.
- Heading uppercase seperlunya.

## Komponen Dasar

- Button: utama, sekunder, bahaya, ghost.
- Badge: status, role, jenis layanan.
- Card: radius 6–8 px, border tipis, aksen merah kecil.
- Table: compact, sticky header jika panjang.
- Dialog: konfirmasi tindakan penting.
- Drawer: form input cepat.
- Toast: berhasil, peringatan, gagal.
- Empty state: sederhana tanpa ilustrasi AI.
- Skeleton: panel gelap netral.

## Responsif

- 1440 px: sidebar dan 4 kartu aktif satu baris.
- 1280 px: kartu aktif dapat 2x2.
- Tablet: sidebar drawer.
- Mobile: tabel menjadi kartu; tindakan penting tetap terlihat.
