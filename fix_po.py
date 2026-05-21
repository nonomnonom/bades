#!/usr/bin/env python3
import re

with open('id-ID.po', 'r', encoding='utf-8') as f:
    content = f.read()

fixes = [
    ('msgstr ""Enter ', 'msgstr "Masukkan "),
    ('msgstr ""Error ', 'msgstr "Kesalahan "),
    ('msgstr ""Last ', 'msgstr "Terakhir "),
    ('msgstr ""Email ', 'msgstr "Email "),
    ('msgstr ""Choose ', 'msgstr "Pilih "),
    ('msgstr ""Please ', 'msgstr "Mohon "),
    ('msgstr ""Cancel', 'msgstr "Batal'),
    ('msgstr ""Fields', 'msgstr "Field"),
    ('msgstr ""Is ', 'msgstr "Adalah "),
    ('msgstr ""Not ', 'msgstr "Tidak "),
    ('msgstr ""Allow ', 'msgstr "Izinkan "),
    ('msgstr ""Custom ', 'msgstr "Kustom "),
    ('msgstr ""Object ', 'msgstr "Objek "),
    ('msgstr ""Open ', 'msgstr "Buka "),
    ('msgstr ""Record ', 'msgstr "Rekaman "),
    ('msgstr ""Records', 'msgstr "Rekaman"),
    ('msgstr ""Role ', 'msgstr "Peran "),
    ('msgstr ""Roles', 'msgstr "Peran"),
    ('msgstr ""Allow ', 'msgstr "Izinkan "),
    ('msgstr ""Allowed ', 'msgstr "Diizinkan "),
    ('msgstr ""API ', 'msgstr "API "),
    ('msgstr ""or ', 'msgstr "atau "),
    ('msgstr ""And ', 'msgstr "Dan "),
    ('msgstr ""To ', 'msgstr "Ke "),
    ('msgstr ""In ', 'msgstr "Di "),
    ('msgstr ""By ', 'msgstr "Oleh "),
    ('msgstr ""For ', 'msgstr "Untuk "),
    ('msgstr ""On ', 'msgstr "Aktif "),
    ('msgstr ""From ', 'msgstr "Dari "),
    ('msgstr ""With ', 'msgstr "Dengan "),
    ('msgstr ""This ', 'msgstr "Ini "),
    ('msgstr ""That ', 'msgstr "Itu "),
    ('msgstr ""What ', 'msgstr "Apa "),
    ('msgstr ""When ', 'msgstr "Ketika "),
    ('msgstr ""Where ', 'msgstr "Di mana "),
    ('msgstr ""Which ', 'msgstr "Yang "),
    ('msgstr ""Why ', 'msgstr "Mengapa "),
    ('msgstr ""Who ', 'msgstr "Siapa "),
    ('msgstr ""How ', 'msgstr "Bagaimana "),
    ('msgstr ""Will ', 'msgstr "Akan "),
    ('msgstr ""Would ', 'msgstr "Akan "),
    ('msgstr ""Could ', 'msgstr "Bisa "),
    ('msgstr ""Should ', 'msgstr "Harus "),
    ('msgstr ""Must ', 'msgstr "Harus "),
    ('msgstr ""Can ', 'msgstr "Bisa "),
    ('msgstr ""May ', 'msgstr "Mungkin "),
    ('msgstr ""Has ', 'msgstr "Memiliki "),
    ('msgstr ""Have ', 'msgstr "Punya "),
    ('msgstr ""Had ', 'msgstr "Punya "),
    ('msgstr ""Does ', 'msgstr "Apakah "),
    ('msgstr ""Did ', 'msgstr "Melakukan "),
    ('msgstr ""Isnt ', 'msgstr "Bukan "),
    ('msgstr ""Was ', 'msgstr "Adalah "),
    ('msgstr ""Were ', 'msgstr "Adalah "),
]

for old, new in fixes:
    content = content.replace(old, new)

with open('id-ID.po', 'w', encoding='utf-8') as f:
    f.write(content)

print('Fixed more patterns')

# Count remaining
pattern = r'msgstr ""([A-Z][a-z][^"]{3,50})"'
untranslated = re.findall(pattern, content)
print(f'Untranslated remaining: {len(untranslated)}')

empty = content.count('msgstr ""')
print(f'Empty msgstr: {empty}')
print(f'Total: {len(untranslated) + empty}')