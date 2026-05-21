#!/usr/bin/env python3
"""
Translate Indonesian PO file for Bades rebrand.
"""

import re

PO_FILE = "D:/bades/packages/server/src/engine/core-modules/i18n/locales/id-ID.po"
OUTPUT_FILE = "D:/bades/packages/server/src/engine/core-modules/i18n/locales/id-ID.po"

# Translation dictionary - key translations for Bades rebrand
TRANSLATIONS = {
    # Object labels - Bades rebrand (CRM → Village Admin)
    "A company": "Sebuah desa",
    "A connected account": "Akun terhubung",
    "A dashboard": "Sebuah ringkasan",
    "A note": "Sebuah catatan",
    "A person": "Sebuah penduduk",
    "A task": "Sebuah kegiatan",
    "A task target": "Target kegiatan",
    "A note target": "Target catatan",
    "A workflow": "Sebuah alur kerja",
    "A workflow automated trigger": "Pemicu otomatis alur kerja",
    "A workflow run": "Eksekusi alur kerja",
    "A workflow version": "Versi alur kerja",
    "A workspace member": "Anggota ruang kerja",
    "An attachment": "Lampiran",
    "An opportunity": "Sebuah permohonan",

    # Plural forms
    "Companies": "Daftar Desa",
    "People": "Penduduk",
    "Tasks": "Kegiatan",
    "Opportunities": "Permohonan",
    "Dashboards": "Ringkasan",

    # Single forms
    "Company": "Desa",
    "Person": "Penduduk",
    "Task": "Kegiatan",
    "Opportunity": "Permohonan",
    "Dashboard": "Ringkasan",
    "Attachment": "Lampiran",
    "Workflow": "Alur Kerja",
    "Workflow Run": "Eksekusi Alur Kerja",
    "Workflow Version": "Versi Alur Kerja",
    "Workflow Automated Trigger": "Pemicu Otomatis Alur Kerja",

    # UI Labels
    "Create": "Buat",
    "Edit": "Edit",
    "Delete": "Hapus",
    "Save": "Simpan",
    "Cancel": "Batal",
    "Search": "Cari",
    "Filter": "Filter",
    "Add": "Tambah",
    "Remove": "Hapus",
    "Close": "Tutup",
    "Back": "Kembali",
    "Next": "Berikutnya",
    "Done": "Selesai",
    "Confirm": "Konfirmasi",
    "Cancel": "Batal",

    # Common actions
    "Action needed": "Tindakan diperlukan",
    "Active": "Aktif",
    "Archived": "Arsip",
    "Deactivated": "Dinonaktifkan",
    "Draft": "Konsep",
    "Completed": "Selesai",
    "Failed": "Gagal",
    "In progress": "Sedang berlangsung",
    "Pending": "Tertunda",
    "Enqueued": "Dalam antrian",

    # Error messages
    "A field with this name already exists.": "Field dengan nama ini sudah ada.",
    "A record with this value already exists.": "Rekor dengan nilai ini sudah ada.",
    "A required field is missing.": "Field yang wajib diisi belum diisi.",
    "A duplicate entry was detected.": "Duplikat entri terdeteksi.",
    "A name conflict occurred.": "Konflik nama occurred.",
    "A network error occurred.": "Kesalahan jaringan occurred.",
    "A temporary error occurred. Please try again.": "Kesalahan sementara. Silakan coba lagi.",
    "An error occurred.": "Terjadi kesalahan.",
    "An unexpected error occurred.": "Terjadi kesalahan tak terduga.",
    "An unexpected billing error occurred.": "Terjadi kesalahan penagihan tak terduga.",
    "Access denied.": "Akses ditolak.",
    "Authentication required.": "Autentikasi diperlukan.",
    "Authorization failed.": "Otorisasi gagal.",
    "Invalid input.": "Input tidak valid.",
    "Invalid email address.": "Alamat email tidak valid.",
    "Invalid configuration.": "Konfigurasi tidak valid.",
    "Not found.": "Tidak ditemukan.",
    "Already exists.": "Sudah ada.",
    "Field not found.": "Field tidak ditemukan.",
    "Record not found.": "Rekor tidak ditemukan.",
    "Object not found.": "Objek tidak ditemukan.",
    "User not found.": "Pengguna tidak ditemukan.",

    # Status messages
    "Accepted": "Diterima",
    "Declined": "Ditolak",
    "Pending": "Tertunda",

    # Time
    "12HRS": "12 JAM",
    "24HRS": "24 JAM",
    "Hour": "Jam",
    "Hours": "Jam",
    "Day": "Hari",
    "Days": "Hari",
    "Minute": "Menit",
    "Minutes": "Menit",

    # Common labels
    "Name": "Nama",
    "Email": "Email",
    "Phone": "Telepon",
    "Address": "Alamat",
    "Description": "Deskripsi",
    "Title": "Judul",
    "Body": "Isi",
    "Status": "Status",
    "Type": "Tipe",
    "Value": "Nilai",
    "Amount": "Jumlah",
    "Date": "Tanggal",
    "Time": "Waktu",
    "Date and time": "Tanggal dan waktu",
    "Created at": "Dibuat pada",
    "Updated at": "Diperbarui pada",
    "Deleted at": "Dihapus pada",
    "Created by": "Dibuat oleh",
    "Author": "Penulis",
    "Owner": "Pemilik",
    "Assignee": "Penanggung jawab",
    "Target": "Target",
    "Due date": "Tanggal jatuh tempo",
    "Close date": "Tanggal tutup",
    "Start date": "Tanggal mulai",
    "End date": "Tanggal akhir",

    # Calendar
    "Calendar": "Kalender",
    "Calendar event": "Acara kalender",
    "Calendar events": "Acara kalender",
    "Calendar channel": "Saluran kalender",
    "Calendar channels": "Saluran kalender",
    "Event": "Acara",
    "Events": "Acara",
    "Participant": "Peserta",
    "Participants": "Peserta",
    "Location": "Lokasi",
    "Subject": "Subjek",
    "Start Date and Time": "Tanggal dan Waktu Mulai",
    "End Date and Time": "Tanggal dan Waktu Akhir",

    # Messaging
    "Message": "Pesan",
    "Messages": "Pesan",
    "Thread": "Percakapan",
    "Threads": "Percakapan",
    "Folder": "Folder",
    "Folders": "Folder",
    "Inbox": "Kotak masuk",
    "Sent": "Terkirim",
    "Draft": "Konsep",
    "From": "Dari",
    "To": "Kepada",
    "Cc": "Cc",
    "Bcc": "Bcc",
    "Reply": "Balas",
    "Forward": "Teruskan",

    # Months
    "January": "Januari",
    "February": "Februari",
    "March": "Maret",
    "April": "April",
    "May": "Mei",
    "June": "Juni",
    "July": "Juli",
    "August": "Agustus",
    "September": "September",
    "October": "Oktober",
    "November": "November",
    "December": "Desember",

    # Days
    "Monday": "Senin",
    "Tuesday": "Selasa",
    "Wednesday": "Rabu",
    "Thursday": "Kamis",
    "Friday": "Jumat",
    "Saturday": "Sabtu",
    "Sunday": "Minggu",

    # Field labels
    "Account Owner": "Pemilik Akun",
    "Annual Recurring Revenue": "Pendapatan Berulang Tahunan",
    "Pipeline Value by Stage": "Nilai Pipeline berdasarkan Tahap",
    "Ideal Customer Profile": "Profil Pelanggan Ideal",
    "Domain Name": "Nama Domain",
    "Employees": "Karyawan",
    "City": "Kota",
    "Job title": "Jabatan",
    "Phone number": "Nomor telepon",
    "Linkedin": "LinkedIn",
    "URL": "URL",
    "Link": "Tautan",
    "Note": "Catatan",
    "Notes": "Catatan",
    "Activity": "Aktivitas",
    "Activities": "Aktivitas",
    "Timeline": "Linimasa",
    "Avatar": "Avatar",
    "Color Scheme": "Skema Warna",
    "Date format": "Format tanggal",
    "Time zone": "Zona waktu",
    "Language": "Bahasa",

    # Blocklist
    "Blocklist": "Daftar blokir",
    "Blocklists": "Daftar blokir",
    "Blocklisted": "Diblokir",

    # Settings
    "Settings": "Pengaturan",
    "General": "Umum",
    "Account": "Akun",
    "Accounts": "Akun",
    "Profile": "Profil",
    "Preferences": "Preferensi",
    "Appearance": "Tampilan",
    "Notifications": "Notifikasi",
    "Security": "Keamanan",
    "Privacy": "Privasi",

    # System messages
    "Workspace not found.": "Ruang kerja tidak ditemukan.",
    "Workspace member not found.": "Anggota ruang kerja tidak ditemukan.",
    "Role not found.": "Peran tidak ditemukan.",
    "Permission denied.": "Izin ditolak.",
    "Invalid token.": "Token tidak valid.",
    "Token expired.": "Token kedaluwarsa.",
    "Session expired.": "Sesi berakhir.",
    "Please sign in.": "Silakan masuk.",
    "Please try again.": "Silakan coba lagi.",

    # Misc
    "Yes": "Ya",
    "No": "Tidak",
    "OK": "OK",
    "Error": "Kesalahan",
    "Warning": "Peringatan",
    "Info": "Informasi",
    "Success": "Berhasil",
    "Loading": "Memuat",
    "Refresh": "Segarkan",
    "Retry": "Coba lagi",
    "Skip": "Lewati",
    "Help": "Bantuan",
    "Home": "Beranda",
    "Flow": "Alur",
    "Files": "Berkas",
    "File": "Berkas",
    "Fields": "Field",
    "Settings": "Pengaturan",
}

# Read the PO file
with open(PO_FILE, 'r', encoding='utf-8') as f:
    content = f.read()

# Track changes
translated_count = 0
skipped_count = 0

# Parse and translate
# Format is:
# #. js-lingui-id: XXXXX
# #: path/to/file.ts
# msgid "original text"
# msgstr ""

lines = content.split('\n')
output_lines = []
i = 0

while i < len(lines):
    line = lines[i]

    # Check if this is a msgid line
    if line.startswith('msgid "'):
        # Extract the msgid value
        match = re.match(r'^msgid "(.*)"$', line)
        if match:
            msgid_text = match.group(1)

            # Look ahead to see if this is multi-line msgid
            j = i + 1
            while j < len(lines) and not lines[j].startswith('msgstr'):
                if lines[j].startswith('"') and lines[j].endswith('"'):
                    msgid_text += lines[j].strip()[1:-1]
                j += 1

            # Find the msgstr line
            msgstr_line_idx = j
            while msgstr_line_idx < len(lines) and not lines[msgstr_line_idx].startswith('msgstr'):
                msgstr_line_idx += 1

            if msgstr_line_idx < len(lines):
                # Get current msgstr (might be empty or have value)
                current_msgstr_match = re.match(r'^msgstr "(.*)"$', lines[msgstr_line_idx])

                # Try to find translation
                translation = None

                # First try exact match
                if msgid_text in TRANSLATIONS:
                    translation = TRANSLATIONS[msgid_text]
                else:
                    # Try to find partial matches for common patterns
                    for key in TRANSLATIONS:
                        if msgid_text == key or msgid_text.replace('"', '') == key.replace('"', ''):
                            translation = TRANSLATIONS[key]
                            break

                if translation is not None:
                    # Update the msgstr line
                    lines[msgstr_line_idx] = f'msgstr "{translation}"'
                    translated_count += 1
                else:
                    # Keep original (empty or existing)
                    skipped_count += 1

    i += 1

# Write back
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Translation complete!")
print(f"Translated: {translated_count}")
print(f"Skipped (no translation found): {skipped_count}")