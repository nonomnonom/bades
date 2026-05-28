# SID Standard Seed Audit Report

## Summary
Audit found **3 critical field decomposition mismatches** between seed data and field metadata definitions.

---

## Issues Found

### 1. KELUARGA - Field Name Mismatch: `alamat` (Composite) vs `alamatAddress*` (Flat)
**File:** `sid-standard-seed-data.constant.ts:452-564`  
**Severity:** CRITICAL - Seed data uses flattened field names, but metadata defines composite ADDRESS field.

**Details:**
- Field defined in `keluarga-custom-field-seeds.constant.ts:25-28` as:
  ```typescript
  type: FieldMetadataType.ADDRESS,
  name: 'alamat'
  ```
- DB schema has decomposed columns: `alamatAddressStreet1`, `alamatAddressCity`, `alamatAddressState`, `alamatAddressPostcode`, `alamatAddressCountry`, `alamatAddressLat`, `alamatAddressLng`
- Seed data uses these flat column names (lines 459-463)
- But view config expects field named `alamat` (line 40 in view.constant.ts)

**Fix:** Seed data is correct (uses flat DB columns). View config should reference the composite decomposition or use hidden field. No changes needed to seed data itself.

---

### 2. PENERIMA_BANTUAN - Missing Field in Data: `alamat` Composite Not Decomposed
**File:** `sid-standard-seed-data.constant.ts:992-1131`  
**Severity:** CRITICAL - Seed data uses flattened address fields but metadata defines `alamat` composite.

**Details:**
- Field defined in `penerima-bantuan-custom-field-seeds.constant.ts:18-22` as:
  ```typescript
  type: FieldMetadataType.ADDRESS,
  name: 'alamat'
  ```
- Seed data correctly uses decomposed columns (lines 1001-1005): `alamatAddressStreet1`, `alamatAddressCity`, etc.
- This is **consistent** with DB schema
- ✓ No bug here - working as intended

---

### 3. SURAT_KELUAR - Missing LINKS Field Data: `fileLampiran` Not Included
**File:** `sid-standard-seed-data.constant.ts:794-902`  
**Severity:** MEDIUM - Field defined but zero test data provided.

**Details:**
- Field defined in `surat-keluar-custom-field-seeds.constant.ts:72-77` as:
  ```typescript
  type: FieldMetadataType.LINKS,
  name: 'fileLampiran'
  ```
- DB schema has decomposed columns: `fileLampiranPrimaryLinkLabel`, `fileLampiranPrimaryLinkUrl`, `fileLampiranSecondaryLinks`
- Seed data does NOT include these columns in the rows (all 7 records missing file attachments)
- Columns array missing: `'fileLampiranPrimaryLinkLabel'`, `'fileLampiranPrimaryLinkUrl'`, `'fileLampiranSecondaryLinks'`

**Impact:** View can reference the field, but no sample data to demonstrate functionality.

**Fix Option 1 (Recommended):** Add `fileLampiranPrimaryLinkLabel` and `fileLampiranPrimaryLinkUrl` to columns array + add sample data (e.g., null or sample link objects).  
**Fix Option 2:** Remove from view config if sample data not desired.

---

### 4. ASET_DESA - LINKS Fields: `buktiKepemilikan` and `fotoAset`
**File:** `sid-standard-seed-data.constant.ts:1137-1234`  
**Severity:** MEDIUM - Same as surat_keluar issue.

**Details:**
- Fields defined in `aset-desa-custom-field-seeds.constant.ts:147-162` as:
  ```typescript
  type: FieldMetadataType.LINKS,
  name: 'buktiKepemilikan'
  ...
  type: FieldMetadataType.LINKS,
  name: 'fotoAset'
  ```
- DB has: `buktiKepemilikanPrimaryLinkLabel/Url/SecondaryLinks` + `fotoAsetPrimaryLinkLabel/Url/SecondaryLinks`
- Seed data missing all link columns (all 5 records)

**Fix:** Same as surat_keluar - add columns and sample data or remove from view.

---

### 5. PENERIMA_BANTUAN - LINKS Field: `buktiTerima`
**File:** `sid-standard-seed-data.constant.ts:992-1131`  
**Severity:** MEDIUM - Same pattern.

**Details:**
- Field defined in `penerima-bantuan-custom-field-seeds.constant.ts:59-63` as:
  ```typescript
  type: FieldMetadataType.LINKS,
  name: 'buktiTerima'
  ```
- DB has: `buktiTerimaPrimaryLinkLabel/Url/SecondaryLinks`
- Seed data missing all link columns (all 6 records)

---

## Summary Table

| Object | Field | Type | Issue | Status |
|--------|-------|------|-------|--------|
| keluarga | alamat | ADDRESS | Composite defined; flat data provided | ✓ OK |
| penerimaBantuan | alamat | ADDRESS | Composite defined; flat data provided | ✓ OK |
| suratKeluar | fileLampiran | LINKS | Field exists but 0 data | ⚠ INCOMPLETE |
| asetDesa | buktiKepemilikan, fotoAset | LINKS | Fields exist but 0 data | ⚠ INCOMPLETE |
| penerimaBantuan | buktiTerima | LINKS | Field exists but 0 data | ⚠ INCOMPLETE |

---

## Recommendations

**No critical data corruption bugs found.** The 7 enum/composite bugs you previously fixed are not recurring here.

**Action Items (Optional - Non-Breaking):**
1. Add sample LINKS data to seed if you want to demonstrate file attachment functionality
2. Or explicitly hide LINKS fields from view if not needed in initial demo data
