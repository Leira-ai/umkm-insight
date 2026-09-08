# Dasbor Analitik Portofolio

> **Demo langsung: PENDING — belum tersedia.**
>
> Tautan deployment akan ditambahkan setelah aplikasi benar-benar diterbitkan dan diverifikasi. Jangan menganggap proyek ini sedang live atau siap produksi hanya berdasarkan dokumentasi ini.

Aplikasi web portofolio untuk menyajikan ringkasan performa usaha melalui dashboard, filter, pencarian, visualisasi, dan impor/ekspor data CSV. Proyek dibangun dengan Next.js, TypeScript, dan Supabase sebagai contoh penerapan frontend modern, analitik bisnis sederhana, serta kontrol akses berbasis pengguna.

## Status proyek

Proyek masih dalam pengembangan. Antarmuka, skema data, kebijakan akses, dan alur autentikasi dapat berubah. Data yang muncul pada mode demo adalah **data sintetis/contoh**, bukan transaksi, pendapatan, atau identitas pelanggan sebenarnya.

## Fitur yang dituju

- Landing page dan CTA menuju pengalaman demo.
- Dashboard responsif untuk desktop dan perangkat seluler.
- Ringkasan metrik, tren, filter rentang/kategori, dan pencarian.
- Tema terang/gelap yang dapat dipilih pengguna.
- Impor/ekspor CSV dengan validasi data.
- Autentikasi Supabase dan isolasi data per pengguna melalui Row Level Security (RLS).
- Pengujian unit untuk logika domain dan pengujian end-to-end untuk alur utama.

## Teknologi

- Next.js App Router dan React
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, dan RLS
- Recharts untuk visualisasi
- Zod dan Papa Parse untuk validasi serta CSV
- Vitest, Testing Library, dan Playwright untuk pengujian
- GitHub Actions untuk pemeriksaan kualitas

## Prasyarat

- Node.js 20 atau versi LTS yang kompatibel
- npm (gunakan lockfile yang disertakan)
- Proyek Supabase untuk fitur autentikasi/data persisten

## Instalasi lokal

1. Klon repositori dan masuk ke direktori proyek.
2. Pasang dependensi persis dari lockfile:

   ```bash
   npm ci
   ```

3. Salin konfigurasi contoh:

   ```bash
   cp .env.example .env.local
   ```

4. Isi nilai publik yang diperlukan di `.env.local`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   NEXT_PUBLIC_SITE_URL=
   ```

5. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

6. Buka `http://localhost:3000`.

`NEXT_PUBLIC_SITE_URL` sebaiknya berisi origin aplikasi tanpa path, misalnya `http://localhost:3000`. Jangan menambahkan service-role key ke variabel publik.

## Skrip yang diharapkan

Kontrak kualitas proyek mengharapkan skrip berikut tersedia di `package.json`:

| Skrip | Kegunaan |
| --- | --- |
| `npm run dev` | Menjalankan server pengembangan. |
| `npm run build` | Membuat production build. |
| `npm run lint` | Menjalankan pemeriksaan ESLint. |
| `npm run type-check` | Memeriksa TypeScript tanpa menghasilkan berkas. |
| `npm run test` | Menjalankan unit test Vitest. |
| `npm run test:e2e` | Menjalankan Playwright terhadap production build. |

Pada snapshot repositori tertentu, skrip kualitas yang belum terintegrasi mungkin belum tersedia. CI sengaja memakai kontrak di atas agar integrasi yang tidak lengkap gagal secara eksplisit, bukan terlewat diam-diam.

## Data demo dan privasi

Data demo harus bersifat sintetis dan hanya bertujuan menunjukkan perilaku UI. Angka, nama transaksi, kategori, tanggal, dan hasil analitik tidak merepresentasikan bisnis atau individu nyata. Jangan mengunggah data pribadi, rahasia, finansial sebenarnya, atau data yang tunduk pada kewajiban regulasi ke instance demo.

Data lokal atau contoh dapat direset tanpa pemberitahuan. Sebelum memakai data nyata, lakukan peninjauan privasi, retensi, pencadangan, kontrol akses, dan kepatuhan yang sesuai kebutuhan Anda.

## Arsitektur

Alur tingkat tinggi:

```text
Browser / Next.js UI
        |
        +-- komponen halaman dan dashboard
        +-- modul domain murni (formatting, analytics, CSV)
        +-- Supabase browser client (anon key)
                    |
                    +-- Supabase Auth
                    +-- PostgreSQL API
                            |
                            +-- RLS sebagai batas otorisasi
```

App Router menangani halaman dan layout. Logika domain murni ditempatkan di `src/lib` agar dapat diuji tanpa browser. Supabase menyediakan identitas dan penyimpanan; komponen UI tidak boleh diperlakukan sebagai batas keamanan. Analitik di sisi klien cocok untuk dataset demo berukuran kecil, sementara agregasi besar sebaiknya dipindahkan ke query/database yang terukur.

## Keamanan dan RLS

Supabase anon key memang dirancang untuk klien dan bukan sebuah rahasia, tetapi key tersebut **tidak memberikan otorisasi dengan sendirinya**. Semua tabel, view, fungsi, storage bucket, dan operasi yang terpapar harus dilindungi kebijakan RLS yang telah diuji untuk kondisi berikut:

- pengguna hanya dapat membaca dan mengubah baris miliknya;
- pengguna anonim tidak memperoleh akses yang tidak disengaja;
- operasi `insert`, `update`, dan `delete` memiliki `WITH CHECK`/policy yang tepat;
- data antarpengguna tidak bocor melalui join, view, RPC, atau storage;
- service-role key hanya digunakan di lingkungan server tepercaya dan tidak pernah dikirim ke browser.

Jangan menyimpan secret di Git, source code, workflow CI, screenshot, fixture, atau berkas `NEXT_PUBLIC_*`. Gunakan environment variables platform deployment untuk nilai lingkungan. Lihat [SECURITY.md](SECURITY.md) untuk pelaporan kerentanan.

## Pengujian

```bash
npm run lint
npm run type-check
npm run test
npm run build
npm run test:e2e
```

Unit test memvalidasi formatting, agregasi analitik, dan parsing/ekspor CSV. E2E menjalankan production build dan mencakup landing/CTA demo, filter serta pencarian dashboard, pergantian tema, overflow seluler, dan akses langsung ke dashboard. Skenario yang membutuhkan autentikasi produksi harus dilewati dengan aman saat kredensial khusus pengujian tidak tersedia; kredensial tidak boleh ditanam di test atau CI.

## Deployment

Contoh alur deployment ke Vercel:

1. Buat proyek deployment dari repositori.
2. Tambahkan tiga environment variables dari `.env.example` melalui pengaturan platform.
3. Atur `NEXT_PUBLIC_SITE_URL` ke origin deployment HTTPS.
4. Konfigurasikan URL aplikasi dan redirect URL yang diizinkan di Supabase Auth.
5. Terapkan migrasi database dan aktifkan kebijakan RLS sebelum membuka akses pengguna.
6. Jalankan lint, type-check, unit test, build, dan E2E terhadap kandidat rilis.
7. Verifikasi login/logout, isolasi akun, mobile layout, error handling, dan observabilitas di lingkungan deployment.

Deployment tidak otomatis membuat aplikasi aman atau berstatus produksi; Supabase dan platform hosting tetap perlu dikonfigurasi serta diaudit.

## Batasan free tier

Jika memakai paket gratis Vercel/Supabase, perhatikan batas kuota compute, bandwidth, build, penyimpanan, koneksi database, egress, rate limit, masa inaktivitas/pausing, retensi log, dan dukungan. Batas serta kebijakan penyedia dapat berubah. Aplikasi dapat melambat, tertidur, tidak tersedia, atau kehilangan kemampuan tertentu saat kuota tercapai. Periksa dokumentasi dan harga penyedia terkini sebelum deployment.

Free tier bukan jaminan tanpa biaya. Tetapkan budget alert dan pantau pemakaian sebelum mengundang pengguna.

## Catatan metrik laba kotor

Nilai **laba kotor (gross profit)** pada demo adalah estimasi analitik berdasarkan formula dan input yang tersedia, umumnya pendapatan dikurangi harga pokok/biaya langsung. Angka tersebut dapat tidak memasukkan pajak, retur, diskon, ongkos, fee, overhead, penyusutan, kurs, atau penyesuaian akuntansi lain. Hasil bukan laporan keuangan, audit, nasihat akuntansi, pajak, investasi, atau dasar tunggal untuk keputusan bisnis. Validasi definisi dan hasil dengan pencatatan sumber serta profesional yang berkualifikasi.

## Kontribusi

Sebelum membuka pull request, pastikan perubahan tidak membawa secret atau data nyata dan seluruh pemeriksaan kualitas lulus. Perubahan keamanan perlu menyertakan penjelasan model ancaman serta bukti pengujian RLS yang relevan.

## Lisensi

Proyek dilisensikan dengan [MIT License](LICENSE). Copyright © 2026 Leira.
