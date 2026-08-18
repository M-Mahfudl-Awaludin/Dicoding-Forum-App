# Bukti Screenshot CI/CD & Branch Protection

Folder ini adalah tempat untuk melampirkan 3 screenshot bukti konfigurasi CI/CD dan branch
protection, sesuai catatan submission. Screenshot **harus diambil dari repository GitHub Anda
sendiri** setelah workflow berjalan, jadi tidak bisa dibuat otomatis lewat kode — ikuti langkah di
bawah untuk menghasilkannya lalu simpan filenya persis di folder ini sebelum di-zip untuk submission.

## 1. `1_ci_check_error.png`
Menunjukkan CI check **gagal** karena pengujian tidak lolos.
1. Buat branch baru, rusak salah satu test (mis. ubah `expect` di salah satu file `*.test.js`)
   atau ubah kode sumber sehingga ada test yang gagal.
2. Push branch tersebut lalu buka Pull Request ke `master`.
3. Tunggu workflow **CI** berjalan di tab **Checks** pada halaman PR — akan muncul tanda ❌.
4. Screenshot halaman tersebut (tab Checks / Conversation yang menampilkan status merah).

## 2. `2_ci_check_pass.png`
Menunjukkan CI check **lolos**.
1. Kembalikan/perbaiki kode agar semua test lolos, lalu push lagi ke branch yang sama.
2. Tunggu workflow **CI** selesai berjalan hingga muncul tanda ✅ pada PR yang sama.
3. Screenshot halaman tersebut.

## 3. `3_branch_protection.png`
Menunjukkan branch protection aktif pada halaman PR.
1. Di GitHub repo Anda: **Settings → Branches → Add branch protection rule**.
2. Isi `Branch name pattern` dengan `master`.
3. Aktifkan **Require a pull request before merging** dan **Require status checks to pass before
   merging**, lalu pilih job `test` (dari workflow CI) sebagai required check.
4. Simpan aturan, lalu buka kembali halaman Pull Request — akan terlihat status
   "Merging is blocked" / required check pada bagian bawah PR.
5. Screenshot bagian tersebut.

> Catatan: branch protection hanya bisa diaktifkan penuh pada repository **public**. Anda bisa
> mengubah repository menjadi **private** setelah proses penilaian submission selesai.

Setelah ketiga file gambar tersimpan di folder ini (`screenshots/1_ci_check_error.png`,
`screenshots/2_ci_check_pass.png`, `screenshots/3_branch_protection.png`), hapus file `README.md`
ini atau biarkan saja — reviewer hanya akan melihat ketiga file gambarnya.
