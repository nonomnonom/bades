# Legacy CRM Reference Audit - packages/front/src/

**Commit Context:** Server-side Company/Person/Opportunity objects removed (commit 0f4df009).
**Workspace Context:** Bades SID uses penduduk, keluarga, wilayah, jabatan, permohonanSurat, suratKeluar, programBantuan, penerimaBantuan, asetDesa.

## Critical Issues Found

### 1. Test Data with Legacy Object References (HIGH PRIORITY)

**File:** `packages/front/src/testing/mock-data/generated/data/timelineActivities/mock-timelineActivities-data.ts`  
**Issue:** TimelineActivity mock records reference deleted CRM objects.  
**Lines:** 26, 37-42, 49-52, 104+  
**Count:** 60 references across all mock activity records  
**Details:**
- `"name": "company.created"` (event names reference legacy company)
- `targetCompany`, `targetCompanyId` (non-null in multiple records)
- `targetPerson`, `targetPersonId`, `targetOpportunity`, `targetOpportunityId`

**Risk:** Runtime error if test data is loaded in components expecting server schema.

---

### 2. Mock Metadata with Stale Plural Name (HIGH PRIORITY)

**File:** `packages/front/src/testing/mock-data/generated/metadata/objects/mock-objects-metadata.ts`  
**Line:** 1569  
**Object:** `programBantuan` (Bades object)  
**Issue:** 
```json
"nameSingular": "programBantuan",
"namePlural": "opportunities"  // LEGACY - should be "programBantuan"
```

**Risk:** Navigation and pluralization logic will break for programBantuan routes.

---

### 3. Attachment Type Definition (MEDIUM PRIORITY)

**File:** `packages/front/src/modules/activities/files/types/Attachment.ts`  
**Line:** 20  
**Issue:** 
```typescript
targetPersonId?: string | null;  // Legacy, not mapped to penduduk
```

**Details:** Type still references deleted Person object. No targetPendudukId equivalent found in Attachment type.  
**Risk:** Dead property that won't resolve at runtime if activity targets penduduk.

---

### 4. Test Data - useActivityTargetObjectRecords Hook (MEDIUM PRIORITY)

**File:** `packages/front/src/modules/activities/hooks/__tests__/useActivityTargetObjectRecords.test.tsx`  
**Lines:** 27, 91  
**Issue:**
```typescript
targetCompany: null,
targetCompany {
  __typename: 'Company',
  id: '...',
  ...
}
```

**Details:** Test fixture references Company GraphQL type; also has `targetKeluargaId` (correct) but still carries legacy fields.  
**Risk:** Test may pass locally but schema mismatch with server.

---

### 5. Story Files with Hardcoded Routes (LOW - Stories Exempted)

**Files:**
- `packages/front/src/modules/page-layout/widgets/components/__stories__/WidgetRenderer.stories.tsx` (line 54, 100)
- `packages/front/src/modules/ui/navigation/navigation-drawer/components/__stories__/NavigationDrawer.stories.tsx` (lines 108, 111)

**Details:** Stories mock `company` object and reference routes `/companies`, `/people`.  
**Status:** Exempted (stories are isolated test fixtures), but note line 54 in WidgetRenderer tries to fetch mock Company object.

---

## Not Found (False Positives Excluded)

- No live hook usage (`useCompany`, `usePerson`, `useOpportunity`)
- No hardcoded `'company'`, `'person'`, `'opportunity'` strings in active client logic
- No `CoreObjectNameSingular.Company|Person|Opportunity` enums in non-test code
- No active route handlers for `/companies`, `/people`, `/opportunities` (only in stories)
- GraphQL types (Company, Person, Opportunity) not imported live—only in generated code and test fixtures

---

## Recommendations

1. **Regenerate** `mock-timelineActivities-data.ts` to remove all targetCompany/Person/Opportunity references
2. **Fix** `mock-objects-metadata.ts` line 1569: change `"namePlural": "opportunities"` → `"namePlural": "programBantuan"`
3. **Remove** `targetPersonId` from `Attachment.ts` type or add `targetPendudukId` equivalent if still needed
4. **Update** `useActivityTargetObjectRecords.test.tsx` to remove targetCompany fragment and mock data
5. **Verify** graphql.ts generated files don't expose Company/Person/Opportunity types (use grep on generated output)

---

**Status:** No live user-facing code breaks detected. All issues are in test/fixture layers.
