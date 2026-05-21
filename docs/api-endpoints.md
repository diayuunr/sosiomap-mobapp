# SosioMap — Supabase API Endpoints
Base URL: `https://ebfyrbnxrlyobzssgyot.supabase.co/rest/v1`

Headers yang wajib disertakan di setiap request:
apikey: <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74>
Authorization: Bearer <eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZnlyYm54cmx5b2J6c3NneW90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzODEzNzcsImV4cCI6MjA5Mzk1NzM3N30.wcOsKVRXIMuybsmUBhJKq8JUbu3rPniTAUD_UJKl_74>

## Peta
### Ambil semua wilayah + geom
GET /wilayah?select=id,nama,tipe,geom,parent_id

### Ambil klaster wilayah (untuk warna peta)
GET /klaster_wilayah?select=*&periode=eq.2024

### Ambil wilayah + klaster sekaligus
GET /wilayah?select=id,nama,tipe,geom,parent_id,klaster_wilayah(klaster_label,skor_risiko)

## Detail Zona (saat user tap wilayah)
### Ambil wajib pajak di wilayah tertentu
GET /wajib_pajak?wilayah_id=eq.{wilayah_id}

### Ambil kepatuhan pajak wajib pajak tertentu
GET /kepatuhan_pajak?wajib_pajak_id=eq.{wajib_pajak_id}

### Ambil rekomendasi kebijakan wilayah tertentu
GET /rekomendasi?wilayah_id=eq.{wilayah_id}

## Filter Data
### Filter by kelompok ekonomi
GET /wajib_pajak?wilayah_id=eq.{wilayah_id}&kelompok_ekonomi=eq.UMKM
Kelompok ekonomi: `Pensiunan`, `UMKM`, `Wirausaha`, `Pegawai Negeri`

### Filter by risiko tinggi
GET /klaster_wilayah?skor_risiko=eq.3&periode=eq.2024
Skor risiko: `1` = Hijau, `2` = Kuning, `3` = Merah

## Dashboard Statistik
### Total wajib pajak
GET /wajib_pajak?select=count

### Total tunggakan
GET /kepatuhan_pajak?status_bayar=eq.belum_lunas&select=nilai_tunggakan

### Persentase kepatuhan per wilayah
GET /kepatuhan_pajak?wajib_pajak_id=eq.{wajib_pajak_id}&periode=eq.2024

## Login

### Cek kredensial user
GET /users?username=eq.{username}&password=eq.{password}&role=eq.{role}

### Akun testing
| Username | Password | Role |
|----------|----------|------|
| analis01 | password123 | Analis |
| bapenda01 | password123 | Bapenda |
| admin01 | password123 | Admin |