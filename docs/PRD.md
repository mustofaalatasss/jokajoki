# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## MABAR CTRL — Sistem Operasional Mabar VIP untuk Streamer

**Status:** Draft siap implementasi frontend  
**Nama produk:** MABAR CTRL (nama kerja; harus mudah diganti dari satu konstanta)  
**Platform awal:** Web desktop-first  
**Bahasa antarmuka:** Bahasa Indonesia  
**Target pengguna:** Streamer Mobile Legends dan admin/operator live  
**Metode pencatatan pembayaran:** Manual berdasarkan transaksi/pesan Saweria  
**Fokus produk:** Mabar VIP saja; tidak mengelola donasi biasa

---

## 1. Ringkasan Produk

MABAR CTRL adalah dashboard operasional untuk membantu streamer Mobile Legends mengelola pelanggan Mabar VIP selama live. Streamer atau admin mencatat pelanggan yang telah membayar melalui Saweria, menentukan role, jumlah match, dan jenis layanan Reguler atau Fast Track.

Sistem menampilkan empat slot pelanggan yang sedang bermain bersama streamer, antrean reguler berdasarkan urutan pendaftaran, pemain yang dijeda oleh Fast Track, Fast Track yang menunggu pergantian, dan riwayat pelanggan yang seluruh hak match-nya sudah selesai.

Produk tidak menyediakan pendaftaran pelanggan, checkout pelanggan, akun pelanggan, pembayaran internal, atau pengelolaan donasi biasa pada MVP.

---

## 2. Masalah yang Diselesaikan

Streamer dan admin saat ini sering mencatat pelanggan melalui Notes atau spreadsheet sehingga terjadi:

- urutan antrean sulit dipantau;
- sisa match sering salah hitung;
- pemain yang selesai masih tercampur dengan pemain aktif;
- Fast Track sulit dikelola dengan adil;
- pemain yang dijeda Fast Track dapat terlupakan;
- role dan data Mobile Legends sulit dicari;
- riwayat dan pendapatan sesi tidak tercatat rapi;
- operator kesulitan mengelola data sambil live.

---

## 3. Tujuan Produk

1. Mempercepat input pelanggan Mabar VIP.
2. Menampilkan empat slot pelanggan aktif secara jelas.
3. Mengurangi sisa match secara otomatis setelah pertandingan selesai.
4. Memindahkan pemain dengan sisa match nol langsung ke Riwayat.
5. Menjalankan antrean reguler berdasarkan siapa yang lebih dahulu didaftarkan.
6. Mendukung Fast Track sebagai penggantian langsung terhadap pemain aktif.
7. Menjaga hak sisa match pemain yang dijeda Fast Track.
8. Mengembalikan pemain yang dijeda setelah Fast Track penggantinya selesai.
9. Menyimpan role utama, role alternatif, dan role yang dimainkan.
10. Menyediakan dashboard cepat, padat, dan mudah digunakan saat live.

---

## 4. Di Luar Ruang Lingkup MVP

- pendaftaran atau login pelanggan;
- halaman checkout pelanggan;
- payment gateway;
- integrasi API Saweria otomatis;
- pengelolaan donasi biasa;
- marketplace jasa;
- chat internal;
- aplikasi mobile native;
- penyimpanan password akun Mobile Legends;
- AI recommendation;
- backend, autentikasi, dan database pada tahap frontend awal.

---

## 5. Pengguna Sistem

### 5.1 Pemilik/Streamer

- membuka dan menutup sesi live;
- melihat dashboard live;
- memasukkan pelanggan;
- menjalankan pertandingan;
- menentukan pengaturan Fast Track;
- melihat riwayat dan laporan;
- mengubah seluruh data.

### 5.2 Admin/Operator

- memasukkan data Saweria;
- mengelola antrean;
- memanggil pemain;
- mengubah status kesiapan;
- menjalankan pergantian Fast Track;
- menyelesaikan pertandingan;
- memperbaiki data pelanggan.

Untuk frontend awal, role pengguna hanya disimulasikan dengan data contoh.

---

## 6. Istilah Utama

| Istilah | Definisi |
|---|---|
| Squad Aktif | Maksimal empat pelanggan yang memperoleh slot bermain bersama streamer |
| Antrean Reguler | Pelanggan yang menunggu berdasarkan urutan pendaftaran |
| Fast Track | Pelanggan yang membayar lebih dan langsung mengambil slot pemain aktif pada pertandingan berikutnya |
| Pemain Dijeda | Pemain aktif yang diturunkan sementara karena digantikan Fast Track |
| Fast Track Menunggu | Fast Track yang sudah dicatat tetapi menunggu pertandingan berjalan selesai atau belum tersedia pemain reguler yang dapat digantikan |
| Sisa Match | Hak pertandingan pelanggan yang belum dimainkan |
| Riwayat | Data pelanggan selesai dengan sisa match nol |
| Sesi Live | Satu periode operasional live streaming |
| Urutan Pendaftaran | Urutan tetap berdasarkan waktu pelanggan dicatat ke sistem |

---

## 7. Aturan Bisnis Inti

### 7.1 Kapasitas Squad

- Squad aktif terdiri atas satu streamer dan maksimal empat pelanggan.
- Streamer tidak dihitung sebagai pelanggan.
- Jumlah slot pelanggan dapat dibuat dapat dikonfigurasi di masa depan, tetapi nilai awalnya empat.

### 7.2 Antrean Reguler

- Antrean reguler menggunakan prinsip siapa yang lebih dahulu didaftarkan, dia lebih dahulu mendapat giliran.
- Jumlah match yang dibeli tidak memengaruhi urutan.
- Sistem menyimpan nomor urut dan waktu pendaftaran.
- Perubahan urutan manual dapat disediakan untuk admin, tetapi harus terlihat sebagai tindakan khusus dan kelak dicatat dalam log aktivitas.

### 7.3 Penyelesaian Pertandingan

Saat operator menekan **Selesaikan Pertandingan**:

1. hanya pemain yang tercatat mengikuti pertandingan aktif yang diproses;
2. jumlah match selesai bertambah satu;
3. sisa match berkurang satu;
4. pemain dengan sisa match lebih dari nol tetap aktif;
5. pemain dengan sisa match nol langsung dikeluarkan dari Squad Aktif;
6. pemain tersebut langsung masuk Riwayat dan tidak lagi tampil di tabel aktif;
7. slot kosong diproses menurut aturan prioritas.

### 7.4 Urutan Pengisian Slot Kosong

Gunakan urutan berikut sesuai konteks:

1. pemain yang mempunyai hak kembali karena Fast Track penggantinya selesai;
2. Fast Track yang menunggu pergantian;
3. pelanggan pertama dalam antrean reguler.

Hak kembali selalu terkait dengan Fast Track tertentu dan slot tertentu.

### 7.5 Fast Track

- Fast Track bukan sekadar antrean prioritas.
- Fast Track mengambil slot pemain reguler aktif meskipun pemain tersebut masih mempunyai sisa match.
- Pergantian tidak dilakukan di tengah pertandingan.
- Jika pertandingan sedang berjalan, Fast Track berstatus **Menunggu Pergantian** dan masuk pada pertandingan berikutnya.
- Pemain reguler yang digantikan menjadi **Dijeda Fast Track**.
- Sisa match pemain yang dijeda tidak berkurang selama tidak bermain.
- Fast Track memainkan jatah match-nya sampai habis.
- Setelah sisa Fast Track nol, Fast Track langsung masuk Riwayat.
- Pemain yang dijeda oleh Fast Track tersebut otomatis kembali ke slotnya dan melanjutkan sisa match.
- Hubungan Fast Track dan pemain yang dijeda harus disimpan satu lawan satu.
- Fast Track aktif tidak dipilih oleh metode otomatis untuk dijeda Fast Track lain.
- Jika seluruh slot aktif berisi Fast Track, Fast Track baru menunggu sampai tersedia slot atau Fast Track lain selesai.

### 7.6 Metode Memilih Pemain yang Dijeda

Pengaturan tersedia:

1. **Pilih Manual**  
   Operator memilih pemain reguler aktif.

2. **Berdasarkan Urutan Pendaftaran**  
   Sistem memilih pemain reguler aktif yang paling dahulu didaftarkan. Ini menjadi nilai bawaan yang direkomendasikan.

3. **Paling Lama Bermain**  
   Sistem memilih pemain reguler yang paling lama berada dalam Squad Aktif.

4. **Paling Baru Masuk Squad**  
   Sistem memilih pemain reguler yang paling baru masuk Squad Aktif.

5. **Berdasarkan Role yang Digantikan**  
   Sistem mencocokkan role utama Fast Track, lalu role alternatif. Jika lebih dari satu kandidat cocok, gunakan urutan pendaftaran paling awal sebagai penentu.

Metode tidak boleh menggunakan jumlah atau sisa match sebagai dasar prioritas.

### 7.7 Role

Setiap pelanggan wajib memiliki:

- role utama;
- role alternatif opsional;
- role yang dimainkan pada pertandingan.

Pilihan role:

- Jungler
- Roamer
- Gold Lane
- Mid Lane
- EXP Lane
- Multirole

### 7.8 Penambahan Match

- Operator dapat menambah jumlah match pelanggan.
- Total dibeli dan sisa match diperbarui.
- Penambahan match tidak mengubah posisi antrean.
- Penambahan match Fast Track ketika ada pemain yang dijeda membutuhkan konfirmasi operator.

---

## 8. Status Berbahasa Indonesia

| Status | Penggunaan |
|---|---|
| Menunggu Antrean | Pelanggan berada di antrean reguler |
| Menunggu Pergantian | Fast Track menunggu pertandingan selesai atau slot penggantian |
| Naik ke Squad | Baru dipromosikan ke Squad Aktif |
| Dipanggil | Sedang dipanggil oleh streamer/admin |
| Menunggu Siap | Belum masuk lobby atau belum siap |
| Siap | Sudah siap di lobby |
| Sedang Main | Sedang mengikuti pertandingan |
| Dijeda Fast Track | Diturunkan sementara karena Fast Track |
| Kembali Bermain | Kembali setelah Fast Track selesai |
| Dilewati | Dilewati sementara |
| Selesai | Sisa match nol; hanya tampil di Riwayat |
| Dibatalkan | Pesanan dibatalkan |

Label **Fast Track** tetap menggunakan nama tersebut sebagai jenis layanan, bukan status.

---

## 9. Data Pelanggan

Form input pelanggan berisi:

| Kolom | Ketentuan |
|---|---|
| Nama Saweria | Wajib |
| Nickname Mobile Legends | Wajib |
| ID Pengguna | Wajib |
| ID Server | Wajib |
| Rank | Wajib |
| Role Utama | Wajib |
| Role Alternatif | Opsional |
| Jumlah Match | Wajib, minimal 1 |
| Harga per Match | Diambil dari pengaturan sesi, dapat disunting |
| Biaya Fast Track | Muncul hanya jika Fast Track |
| Total Pembayaran | Dihitung otomatis, dapat dikoreksi operator |
| Jenis Layanan | Reguler atau Fast Track |
| Catatan | Opsional |
| Waktu Pendaftaran | Otomatis |

Nomor WhatsApp tidak diwajibkan pada MVP.

---

## 10. Halaman dan Fitur Frontend

### 10.1 Halaman Masuk

- tampilan sederhana;
- email dan kata sandi dummy;
- tombol Masuk ke Dashboard;
- tidak terhubung autentikasi pada frontend awal;
- tersedia akun demo.

### 10.2 Dashboard Live

Header sesi menampilkan:

- nama sesi;
- status sesi;
- nomor pertandingan;
- pemain aktif;
- jumlah antrean reguler;
- jumlah pemain dijeda;
- jumlah Fast Track menunggu;
- pendapatan sesi;
- tombol Mulai/Tutup Sesi.

Bagian utama:

1. empat kartu Squad Aktif;
2. kontrol pertandingan;
3. panel Fast Track Menunggu;
4. panel Pemain Dijeda;
5. tabel Antrean Reguler;
6. tombol Tambah Pelanggan;
7. aktivitas terbaru.

### 10.3 Kartu Squad Aktif

Setiap kartu menampilkan:

- nomor slot;
- nickname;
- badge Reguler/Fast Track;
- role utama dan role yang dimainkan;
- rank;
- progres match, contoh 3 dari 5;
- sisa match;
- status;
- waktu masuk squad;
- tombol Dipanggil, Siap, Edit Role, Tambah Match, dan tindakan lainnya.

### 10.4 Kontrol Pertandingan

- **Mulai Pertandingan**
- **Selesaikan Pertandingan**
- **Batalkan Pertandingan**
- indikator pertandingan berjalan;
- waktu mulai;
- daftar empat peserta yang benar-benar ikut;
- konfirmasi sebelum menyelesaikan.

### 10.5 Antrean Reguler

Kolom:

- nomor antrean;
- nama Saweria;
- nickname;
- role utama;
- role alternatif;
- rank;
- jumlah match;
- waktu daftar;
- status;
- tindakan.

Urutan visual berdasarkan waktu daftar.

### 10.6 Fast Track Menunggu

Menampilkan:

- urutan masuk Fast Track;
- nickname;
- role;
- jumlah match;
- biaya Fast Track;
- status;
- kandidat pemain yang akan dijeda;
- metode pemilihan;
- tombol Proses Pergantian.

### 10.7 Pemain Dijeda

Menampilkan:

- urutan hak kembali;
- nickname;
- role;
- sisa match;
- Fast Track yang menggantikan;
- slot asal;
- waktu mulai dijeda;
- status;
- tombol Kembalikan Manual jika diperlukan.

### 10.8 Riwayat

Kolom:

- waktu selesai;
- nickname;
- ID dan server;
- role;
- total match;
- total pembayaran;
- jenis Reguler/Fast Track;
- biaya Fast Track;
- nama sesi;
- tindakan lihat detail.

Pemain dengan sisa match nol muncul di sini dan tidak muncul di Squad Aktif atau antrean.

### 10.9 Pelanggan

- pencarian nickname, nama Saweria, atau ID;
- detail pelanggan;
- riwayat sesi;
- total match;
- total transaksi;
- role;
- catatan.

### 10.10 Pengaturan

- harga per match;
- harga Fast Track;
- metode memilih pemain yang dijeda;
- metode cadangan;
- konfirmasi pergantian;
- izinkan penambahan match Fast Track;
- durasi panggilan;
- nama streamer;
- nama produk dan logo teks.

---

## 11. Desain Antarmuka

### 11.1 Arah Visual

Tampilan harus terasa seperti panel kontrol turnamen/esports yang premium, bukan template dashboard AI.

Karakter:

- gelap, padat, tegas, dan profesional;
- aksen merah digunakan secara terkendali;
- tidak menggunakan neon ungu/biru;
- tidak menggunakan efek kaca berlebihan;
- tidak menggunakan gradient blob;
- tidak menggunakan ikon robot, otak, sparkle, atau elemen khas aplikasi AI;
- tidak menggunakan sudut kartu yang terlalu bulat;
- tidak menggunakan ilustrasi atau aset berhak cipta Mobile Legends;
- fokus pada data, status, dan aksi cepat.

### 11.2 Palet Warna

| Token | Nilai |
|---|---|
| Latar utama | `#08090B` |
| Panel utama | `#101216` |
| Panel sekunder | `#16191F` |
| Border | `#2A2E36` |
| Merah gelap | `#7F1724` |
| Merah utama | `#B91F2E` |
| Merah sorotan | `#E23B49` |
| Teks utama | `#F4F5F7` |
| Teks sekunder | `#969DA8` |
| Berhasil | `#36B873` |
| Peringatan | `#E2A33B` |
| Berbahaya | `#D74343` |

Merah sebaiknya mengisi kurang lebih 10–15% tampilan, bukan seluruh layar.

### 11.3 Tipografi

- heading: Barlow Condensed atau font sans-serif condensed sejenis;
- body dan data: Inter atau font sans-serif netral;
- heading dapat menggunakan huruf kapital dengan tracking ringan;
- angka statistik memakai tabular numerals;
- jangan menggunakan font futuristik yang sulit dibaca.

### 11.4 Bentuk dan Detail

- radius kartu 6–8 px;
- border tipis;
- bayangan lembut;
- aksen garis merah;
- bagian header kartu boleh memiliki potongan diagonal ringan;
- tombol utama merah solid;
- tombol sekunder gelap dengan border;
- badge status padat dan mudah dibaca;
- tabel ringkas dengan tinggi baris efisien;
- animasi 120–200 ms tanpa efek berlebihan.

### 11.5 Tata Letak

Desktop 1440 px:

- sidebar 232–248 px;
- header aplikasi;
- area konten lebar;
- Squad Aktif dalam grid empat kolom;
- tabel antrean menggunakan lebar penuh;
- panel Pemain Dijeda dan Fast Track Menunggu dapat berdampingan.

Laptop:

- grid aktif dua kolom.

Tablet/mobile:

- sidebar menjadi drawer;
- Squad Aktif menjadi satu kolom;
- tabel berubah menjadi kartu ringkas;
- tombol tindakan utama tetap mudah dijangkau.

---

## 12. Teknologi Frontend

- Next.js dengan App Router;
- React;
- TypeScript;
- Tailwind CSS;
- komponen kustom, tidak menyalin tampilan default library UI;
- ikon Lucide atau ikon garis sejenis;
- data mock tersentral;
- state lokal React atau store ringan;
- localStorage hanya untuk demo frontend jika diperlukan;
- tidak ada Supabase, API, autentikasi nyata, atau database pada fase frontend;
- lint dan build harus berhasil.

Struktur yang disarankan:

```text
src/
  app/
  components/
    layout/
    dashboard/
    queue/
    fast-track/
    match/
    history/
    customers/
    settings/
    ui/
  data/
    mock-data.ts
  lib/
  types/
  hooks/
  styles/
```

---

## 13. Data Mock Minimum

Sediakan data simulasi:

- empat pemain aktif;
- enam pelanggan antrean reguler;
- satu Fast Track menunggu;
- satu pemain dijeda;
- lima riwayat selesai;
- satu sesi live aktif;
- beberapa role dan rank berbeda.

Data harus menggunakan nama fiktif Indonesia dan tidak menggunakan data pribadi nyata.

---

## 14. Interaksi Frontend yang Harus Disimulasikan

Setelah fase tampilan statis disetujui:

- membuka form Tambah Pelanggan;
- memilih Reguler/Fast Track;
- validasi form;
- menambahkan pelanggan ke squad atau antrean;
- memilih metode pemain yang dijeda;
- memproses Fast Track;
- memindahkan pemain reguler ke Pemain Dijeda;
- mengembalikan pemain setelah Fast Track selesai;
- memulai pertandingan;
- menyelesaikan pertandingan;
- mengurangi sisa match;
- memindahkan sisa nol ke Riwayat;
- menaikkan antrean pertama;
- menambah match;
- mengganti role;
- menampilkan toast dan dialog konfirmasi.

Semua berjalan dengan data lokal sampai backend dibangun.

---

## 15. Kriteria Penerimaan Frontend

Frontend dianggap selesai jika:

1. seluruh antarmuka menggunakan Bahasa Indonesia;
2. desain terasa gaming/esports premium dan merah gelap;
3. tidak terlihat seperti template AI generik;
4. empat slot aktif terlihat jelas;
5. antrean reguler diurutkan berdasarkan waktu pendaftaran;
6. jumlah order tidak mengubah urutan;
7. Fast Track dapat menggantikan pemain reguler;
8. pemain yang digantikan tampil di Pemain Dijeda;
9. pemain yang dijeda tidak kehilangan sisa match;
10. pemain selesai langsung hilang dari aktif dan masuk Riwayat;
11. seluruh role tampil konsisten;
12. desktop, laptop, tablet, dan mobile dapat digunakan;
13. tidak ada error console;
14. lint dan production build berhasil;
15. belum ada backend, Supabase, atau integrasi Saweria.

---

## 16. Roadmap Bertahap

### Fase F0 — Aturan Proyek

- membuat PRD;
- membuat design system;
- membuat project skill/guardrail;
- belum membuat aplikasi.

### Fase F1 — Fondasi Frontend

- scaffold Next.js, TypeScript, Tailwind;
- token desain;
- font;
- komponen dasar;
- layout aplikasi;
- sidebar dan header;
- route placeholder;
- belum membuat logika bisnis.

### Fase F2 — Dashboard Live Statis

- kartu Squad Aktif;
- kontrol pertandingan;
- Fast Track Menunggu;
- Pemain Dijeda;
- tabel Antrean Reguler;
- aktivitas terbaru;
- data mock saja.

### Fase F3 — Form dan Interaksi Lokal

- Tambah Pelanggan;
- edit pelanggan;
- status kesiapan;
- tambah match;
- pencarian;
- local state.

### Fase F4 — Mesin Simulasi Match dan Fast Track

- mulai/selesai pertandingan;
- pengurangan sisa;
- Riwayat otomatis;
- penggantian Fast Track;
- hak kembali pemain dijeda;
- semua metode pemilihan.

### Fase F5 — Halaman Pendukung dan QA

- Pelanggan;
- Riwayat;
- Pengaturan;
- responsive;
- accessibility;
- lint/build/browser verification.

### Fase B1 dan Seterusnya — Backend

Backend baru dimulai setelah frontend disetujui:

- desain database PostgreSQL/Supabase;
- autentikasi;
- Row Level Security;
- API/server actions;
- realtime;
- audit log;
- deployment.

Setiap fase wajib berhenti setelah selesai dan tidak boleh mengerjakan fase berikutnya tanpa instruksi baru.
