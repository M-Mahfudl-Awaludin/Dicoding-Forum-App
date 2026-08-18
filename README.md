# Dicoding Forum - Aplikasi Forum Diskusi

Aplikasi React untuk forum diskusi yang dibangun menggunakan Redux untuk state management dan terintegrasi dengan Dicoding Forum API.

🔗 **Live URL (Vercel):** _isi dengan URL Vercel Anda setelah deploy, contoh:_ `https://dicoding-forum-app.vercel.app`

## Fitur Utama

### Kriteria Utama
- ✅ **Autentikasi**: Daftar akun dan login
- ✅ **Daftar Thread**: Menampilkan semua thread dengan informasi lengkap
- ✅ **Detail Thread**: Menampilkan detail thread beserta komentar
- ✅ **Buat Thread**: Pengguna dapat membuat thread baru
- ✅ **Buat Komentar**: Pengguna dapat menambahkan komentar pada thread
- ✅ **Loading Indicator**: Menampilkan indikator loading saat memuat data

### Fitur Tambahan (Saran)
- ✅ **Voting System**: Upvote/downvote pada thread dan komentar dengan optimistic updates
- ✅ **Leaderboard**: Halaman leaderboard menampilkan pengguna dengan skor tertinggi
- ✅ **Filter Kategori**: Filter thread berdasarkan kategori
- ✅ **Automation Testing**: Reducer, thunk, component, dan E2E testing
- ✅ **CI/CD**: GitHub Actions (CI) + Vercel (CD) dengan branch protection
- ✅ **React Ecosystem**: Storybook untuk dokumentasi komponen (di luar daftar yang dikecualikan)

## Teknologi yang Digunakan

- **React 18.2.0** - Library UI
- **Redux Toolkit** - State management
- **React Router** - Routing
- **ESLint** - Code linting (Airbnb Style Guide)
- **React Testing Library + Jest (react-scripts test)** - Unit & component testing
- **redux-mock-store** - Thunk testing
- **Cypress** - End-to-end testing
- **Storybook** - React ecosystem tool untuk dokumentasi & pengembangan komponen UI secara terisolasi
- **GitHub Actions** - Continuous Integration
- **Vercel** - Continuous Deployment

## Struktur Proyek

```
.github/workflows/ci.yml   # GitHub Actions: lint, unit test, build, e2e
.storybook/                # Konfigurasi Storybook
cypress/
├── e2e/login.cy.js        # E2E test alur login
└── support/                # Custom command & support file Cypress
screenshots/                # Bukti CI/CD & branch protection (lihat screenshots/README.md)
src/
├── components/            # Komponen UI yang reusable
│   ├── ui/                # Header, Loading, Avatar, VoteButton (+ *.test.jsx, *.stories.jsx)
│   └── threads/           # ThreadItem, CommentItem (+ *.test.jsx)
├── pages/                 # Halaman aplikasi (+ LoginPage.test.jsx)
│   ├── ThreadListPage.jsx
│   ├── ThreadDetailPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── CreateThreadPage.jsx
│   └── LeaderboardPage.jsx
├── state/                 # Redux state management (+ *.test.js untuk reducer & thunk)
│   ├── auth/               # State autentikasi
│   ├── threads/             # State threads
│   ├── comments/           # State komentar
│   ├── leaderboards/       # State leaderboard
│   └── store.js            # Redux store configuration
├── utils/                  # Utility functions
│   ├── api.js               # API service layer
│   └── date.js               # Date formatting utilities
├── setupTests.js           # Setup jest-dom untuk React Testing Library
├── App.jsx                 # Root component
└── index.js                 # Entry point
vercel.json                 # Konfigurasi build/deploy Vercel
cypress.config.js            # Konfigurasi Cypress
```

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan aplikasi:
```bash
npm start
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

## Fitur Detail

### Autentikasi
- Pengguna dapat mendaftar dengan nama, email, dan password (minimal 6 karakter)
- Pengguna dapat login dengan email dan password
- Token disimpan di localStorage
- Pengguna yang sudah login dapat membuat thread dan komentar

### Thread
- Menampilkan daftar thread dengan informasi:
  - Judul thread
  - Potongan body thread
  - Waktu pembuatan
  - Jumlah komentar
  - Informasi pembuat (nama, avatar)
  - Kategori
- Filter thread berdasarkan kategori
- Voting pada thread (upvote/downvote)
- Detail thread menampilkan:
  - Judul lengkap
  - Body lengkap
  - Informasi pembuat
  - Semua komentar

### Komentar
- Menampilkan komentar dengan informasi:
  - Konten komentar
  - Waktu pembuatan
  - Informasi pembuat (nama, avatar)
- Voting pada komentar
- Form untuk menambah komentar baru (hanya untuk pengguna yang login)

### Leaderboard
- Menampilkan ranking pengguna berdasarkan skor
- Menampilkan informasi pengguna (nama, email, avatar)
- Top 3 pengguna ditampilkan dengan badge khusus

## Arsitektur

### State Management
- Menggunakan Redux Toolkit untuk state management
- Semua state dari API disimpan di Redux store
- Form input menggunakan controlled component (state lokal)
- Tidak ada pemanggilan API di dalam lifecycle/efek komponen

### Code Quality
- ESLint dengan konfigurasi Airbnb Style Guide
- React Strict Mode diaktifkan
- Komponen modular dan reusable
- Pemisahan kode UI dan State di folder terpisah

### Optimistic Updates
- Voting menggunakan optimistic updates untuk UX yang lebih baik
- UI langsung terupdate, kemudian sinkronisasi dengan server
- Rollback otomatis jika terjadi error

## API Endpoints

Aplikasi menggunakan Dicoding Forum API:
- Base URL: `https://forum-api.dicoding.dev/v1`
- Endpoints: Register, Login, Threads, Comments, Votes, Leaderboards

## Automation Testing

Proyek ini memiliki 4 lapis pengujian otomatis. Skenario setiap pengujian dituliskan dalam bentuk
blok `describe`/`it` pada masing-masing berkas `*.test.js` / `*.cy.js`.

### 1. Reducer Testing
Lokasi: `src/state/**/reducer.test.js`
- `auth/reducer.test.js` — menguji `authUserReducer` (default state, `SET_AUTH_USER`, `UNSET_AUTH_USER`, penggantian user).
- `threads/reducer.test.js` — menguji `threadsReducer`, `threadDetailReducer`, `loadingReducer`, `errorReducer`. Ini adalah reducer paling kompleks: banyak kondisi vote (upvote/downvote/neutral, toggle on/off, pindah dari down ke up dan sebaliknya) baik pada daftar thread maupun detail thread, termasuk efek dari action milik komentar (`ADD_COMMENT`, vote komentar) terhadap `threadDetail`.
- `comments/reducer.test.js` — menguji `commentsReducer` (tambah komentar, toggle vote).
- `leaderboards/reducer.test.js` — menguji `leaderboardsReducer`, `loadingReducer`, `errorReducer`.

### 2. Thunk Function Testing
Lokasi: `src/state/**/action.test.js` (menggunakan `redux-mock-store` + `jest.mock` pada `utils/api.js`)
- `auth/action.test.js` — `asyncSetAuthUser`, `asyncRegisterUser`, `asyncUnsetAuthUser`, `asyncGetOwnProfile` (skenario sukses & gagal).
- `threads/action.test.js` — `asyncReceiveThreads`, `asyncAddThread`, dan yang paling kompleks: `asyncToggleUpVoteThread` / `asyncToggleDownVoteThread`, yang men-dispatch banyak action berbeda tergantung state vote saat ini (optimistic update, neutralisasi, rollback ketika API gagal, serta guard ketika user belum login).
- `comments/action.test.js` — `asyncAddComment`, `asyncToggleUpVoteComment`, `asyncToggleDownVoteComment`.
- `leaderboards/action.test.js` — `asyncReceiveLeaderboards`.

### 3. React Component Testing
Lokasi: `src/components/**/*.test.jsx`, `src/pages/*.test.jsx` (menggunakan React Testing Library)
- `components/ui/VoteButton.test.jsx` — render, active state, klik, disabled state.
- `components/ui/Avatar.test.jsx` — render gambar vs placeholder inisial.
- `components/threads/ThreadItem.test.jsx` — render data thread, interaksi vote, pemotongan body panjang.
- `pages/LoginPage.test.jsx` — komponen terhubung Redux: render form, input, submit sukses (memanggil API via thunk), dan tampilan pesan error saat login gagal.

### 4. End-to-End Testing (alur Login)
Lokasi: `cypress/e2e/login.cy.js`
- Menampilkan halaman login dengan benar.
- Validasi browser saat form dikosongkan.
- Menampilkan pesan error saat kredensial salah.
- Login berhasil → redirect ke daftar thread & menampilkan nama pengguna di header.
- Logout mengembalikan ke tampilan belum login dan menghapus token.

### Menjalankan pengujian

```bash
# Unit test (reducer, thunk, component) sekali jalan
npm test

# Unit test mode watch selama development
npm run test:watch

# Unit test dengan laporan coverage
npm run test:coverage

# End-to-end test (otomatis menjalankan server di port 3001 lalu Cypress headless —
# port terpisah dari `npm start` biasa supaya tidak bentrok)
npm run e2e

# Membuka Cypress secara interaktif (opsional, untuk development)
npm run cypress:open
```

## React Ecosystem: Storybook

Storybook digunakan untuk mendokumentasikan dan mengembangkan komponen UI secara terisolasi.

```bash
npm run storybook        # menjalankan Storybook di http://localhost:6006
npm run build-storybook  # build versi statis Storybook
```

Story yang tersedia:
- `src/components/ui/VoteButton.stories.jsx` (5 variasi: up/down, aktif/nonaktif, disabled)
- `src/components/ui/Avatar.stories.jsx` (4 variasi: dengan gambar, placeholder inisial, ukuran kecil/besar)

## CI/CD

### Continuous Integration — GitHub Actions
Workflow `.github/workflows/ci.yml` berjalan otomatis pada setiap `push` ke branch selain `master`
dan setiap `pull_request` ke `master`. Tahapannya:
1. Checkout & setup Node.js
2. `npm ci`
3. `npm run lint` (ESLint Airbnb)
4. `npm run test:coverage` (reducer, thunk, component test)
5. `npm run build`
6. `npm run e2e` (Cypress, meng-cover alur login end-to-end)

### Continuous Deployment — Vercel
1. Buat project baru di [vercel.com](https://vercel.com), import repository GitHub ini.
2. Vercel akan mendeteksi framework `Create React App` secara otomatis (lihat `vercel.json`).
3. Setiap push/merge ke branch `master` akan otomatis men-deploy versi production.
4. Salin URL production Vercel dan tempelkan di bagian atas README ini serta di catatan submission.

### Branch Protection
1. Buka **Settings → Branches** pada repository GitHub → **Add branch protection rule**.
2. `Branch name pattern`: `master`.
3. Aktifkan **Require a pull request before merging**.
4. Aktifkan **Require status checks to pass before merging**, lalu pilih job CI (`test`) sebagai
   required check.
5. Simpan aturan. Sekarang branch `master` tidak bisa menerima push langsung maupun merge PR yang
   CI-nya gagal.

Bukti screenshot konfigurasi CI/CD & branch protection ada di folder [`screenshots/`](./screenshots)
(lihat `screenshots/README.md` untuk langkah pengambilannya).

## Lisensi

Proyek ini dibuat untuk submission kelas "Menjadi React Web Developer Expert" di Dicoding.

