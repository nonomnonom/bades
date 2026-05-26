import os
import re

# Mapping English (test expectation) -> Indonesian (actual error from app)
MAPPING = [
    ('Aggregate operation or field metadata not found (field: status)', 'Operasi agregasi atau metadata kolom tidak ditemukan (field: status)'),
    ('Config variable INVALID_VAR not found', 'Variabel konfigurasi INVALID_VAR tidak ditemukan'),
    ('Connect is not allowed for name on person', 'Connect is not allowed for name on penduduk'),
    ('Connection to internal IP address 10.0.0.1 is not allowed.', 'Koneksi ke alamat IP internal 10.0.0.1 tidak diizinkan.'),
    ('Failed to acquire lock for key: key', 'Gagal mendapatkan kunci untuk: key'),
    ('Failed to build config key for EmailDriverFactory. Original error: Unsupported email driver: invalid-driver', 'Failed to build config key for EmailDriverFactory. Original error: Driver email tidak didukung: invalid-driver'),
    ('Failed to build config key for FileStorageDriverFactory. Original error: Unsupported storage type: invalid-storage-type', 'Failed to build config key for FileStorageDriverFactory. Original error: Tipe storage tidak didukung: invalid-storage-type'),
    ('Filter group with id nonexistent not found', 'Grup filter dengan id nonexistent tidak ditemukan'),
    ('Group by subFieldName is required for composite fields (field: name)', 'groupBySubFieldName diperlukan untuk field komposit (field: name)'),
    ('Health indicator not found: invalid', 'Indikator kesehatan tidak ditemukan: invalid'),
    ('Invalid URL format for TEST_URL in HIDE_PASSWORD masking strategy', 'Format URL tidak valid untuk TEST_URL dalam strategi masking HIDE_PASSWORD'),
    ('Invalid date format', 'Format tanggal tidak valid'),
    ('Invalid email driver: invalid-driver', 'Driver email tidak valid: invalid-driver'),
    ('Invalid fruit: mango', 'fruit tidak valid: mango'),
    ('Invalid storage driver type: invalid-type', 'Tipe driver storage tidak valid: invalid-type'),
    ('Operand CONTAINS not supported for relation filter', 'Operand CONTAINS tidak didukung untuk filter relasi'),
    ('Operand CONTAINS not supported for uuid filter', 'Operand CONTAINS tidak didukung untuk filter uuid'),
    ('Request to internal IP address 10.0.0.1 is not allowed.', 'Request ke alamat IP internal 10.0.0.1 tidak diizinkan.'),
    ('Request to internal IP address 127.0.0.1 is not allowed.', 'Request ke alamat IP internal 127.0.0.1 tidak diizinkan.'),
    ('Request to internal IP address 169.254.169.254 is not allowed.', 'Request ke alamat IP internal 169.254.169.254 tidak diizinkan.'),
    ('Request to internal IP address 172.16.0.1 is not allowed.', 'Request ke alamat IP internal 172.16.0.1 tidak diizinkan.'),
    ('Request to internal IP address 192.168.1.1 is not allowed.', 'Request ke alamat IP internal 192.168.1.1 tidak diizinkan.'),
    ('Request to internal IP address ::1 is not allowed.', 'Request ke alamat IP internal ::1 tidak diizinkan.'),
    ('SMTP driver requires host and port to be defined', 'Driver SMTP memerlukan host dan port terdefinisi'),
    ('Sub field metadata not found', 'Metadata sub field tidak ditemukan'),
    ('Sub field order by value must be of type OrderByDirection', 'Nilai order by sub field harus berupa OrderByDirection'),
    ("Unknown action 'UNKNOWN'", "Action 'UNKNOWN' tidak dikenal"),
    ('Unknown resolver type: unknownType', 'Tipe resolver tidak dikenal: unknownType'),
    ('Unsupported email driver: invalid-driver', 'Driver email tidak didukung: invalid-driver'),
    ('Unsupported storage type: unsupported-type', 'Tipe storage tidak didukung: unsupported-type'),
    ('invalid-provider is not a valid auth provider.', 'invalid-provider bukan provider auth yang valid.'),
    ('locale=en', 'locale=id'),
]

count = 0
for root, dirs, files in os.walk('packages/server/src'):
    if 'node_modules' in root or 'dist' in root or 'build' in root:
        continue
    for f in files:
        if not (f.endswith('.spec.ts') or f.endswith('.test.ts') or f.endswith('.spec.tsx') or f.endswith('.test.tsx')):
            continue
        path = os.path.join(root, f)
        try:
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
        except Exception as e:
            continue
        original = content
        for en, idn in MAPPING:
            content = content.replace(en, idn)
        if content != original:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(content)
            count += 1
            print(f'Updated: {path}')

print(f'\nTotal updated: {count}')
