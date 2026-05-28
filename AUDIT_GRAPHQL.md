# GraphQL Client-Server Mismatch Audit Report

**Date:** 2026-05-28  
**Scope:** Cross-check `packages/front/src/**/graphql/**/*.ts` queries/mutations vs server resolvers  
**Findings:** 8 dead client-side GraphQL operations with no server resolver counterpart

---

## Executive Summary

Audit reveals **8 orphaned GraphQL operations** on the client that were never removed after commit 0f4df009 deleted CRM-related resolvers. Most are in the **timeline activities** module (calendar events, messaging threads). One **information banner** mutation and one field reference (`objects`) also lack server support.

- ✓ Total client GraphQL operations scanned: 292
- ✗ Dead operations found: 8
- Impact: Components attempting to fetch/refetch will fail silently in catch blocks or error handlers

---

## Dead Operations Detail

### 1. Timeline Calendar Events (3 variants)

| Field | Client Path | Usage |
|-------|-------------|-------|
| `getTimelineCalendarEventsFromPendudukId` | `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromPendudukId.ts` | **Active**: CalendarEventsCard.tsx (line 57) - conditional fetch for Penduduk records |
| `getTimelineCalendarEventsFromKeluargaId` | `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromKeluargaId.ts` | **Active**: CalendarEventsCard.tsx (line 62) - conditional fetch for Keluarga records |
| `getTimelineCalendarEventsFromProgramBantuanId` | `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromProgramBantuanId.ts` | **Active**: CalendarEventsCard.tsx (line 66) - conditional fetch for ProgramBantuan records |

**Root Cause:** Resolvers deleted in commit 0f4df009 during CRM module removal; client still references via `useCustomResolver` hook.

---

### 2. Timeline Message Threads (3 variants)

| Field | Client Path | Usage |
|-------|-------------|-------|
| `getTimelineThreadsFromPendudukId` | `/modules/activities/emails/graphql/queries/getTimelineThreadsFromPendudukId.ts` | **Active**: EmailsCard.tsx + useSendEmail.ts (line 64) - refetch after send |
| `getTimelineThreadsFromKeluargaId` | `/modules/activities/emails/graphql/queries/getTimelineThreadsFromKeluargaId.ts` | **Active**: EmailsCard.tsx + useSendEmail.ts (line 63) - refetch after send |
| `getTimelineThreadsFromProgramBantuanId` | `/modules/activities/emails/graphql/queries/getTimelineThreadsFromProgramBantuanId.ts` | **Active**: EmailsCard.tsx + useSendEmail.ts (line 65) - refetch after send |

**Root Cause:** Same as calendar events; useSendEmail.ts attempts to refetch but queries are dead.

---

### 3. Reconnect Account Banner Mutation

| Field | Client Path | Usage |
|-------|-------------|-------|
| `dismissReconnectAccountBanner` | `/modules/information-banner/graphql/mutations/dismissReconnectAccountBanner.ts` | **Active**: InformationBannerReconnectAccountEmailAliases.tsx (line 27) + InformationBannerReconnectAccountInsufficientPermissions.tsx – user action to dismiss reconnect prompts |

**Root Cause:** Unknown; mutation not implemented on server-side despite banner UI component using it.

---

### 4. Objects Query Root Field

| Field | Client Path | Usage |
|-------|-------------|-------|
| `objects` | Reference in generated types only | **Dead Import**: No actual query file exists for root `objects` field; referenced in generated-metadata/graphql.ts |

**Root Cause:** Likely orphaned from older metadata introspection system or partially removed refactor.

---

## Remediation Strategy

### Immediate Actions
1. **Comment out or remove** unused imports from CalendarEventsCard.tsx (lines 10–11 unused if queries don't exist)
2. **Remove refetch references** in useSendEmail.ts (lines 63–65) – replace with cache invalidation or remove stale operations
3. **Implement server resolver** for `dismissReconnectAccountBanner` OR remove hook + component usage
4. **Delete dead query files** once no component references remain

### Implementation Notes
- Do NOT delete query files yet; verify no stale Storybook stories or tests depend on them
- Calendar story uses getTimelineCalendarEventsFromKeluargaId mock (delete mock data too)
- Check if timeline modules have feature flags that disable them; if so, clean up UI entirely

---

## File Mapping

### Query Files (Delete After Refactor)
- `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromKeluargaId.ts`
- `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromPendudukId.ts`
- `/modules/activities/calendar/graphql/queries/getTimelineCalendarEventsFromProgramBantuanId.ts`
- `/modules/activities/emails/graphql/queries/getTimelineThreadsFromKeluargaId.ts`
- `/modules/activities/emails/graphql/queries/getTimelineThreadsFromPendudukId.ts`
- `/modules/activities/emails/graphql/queries/getTimelineThreadsFromProgramBantuanId.ts`
- `/modules/information-banner/graphql/mutations/dismissReconnectAccountBanner.ts`

### Component Files (Require Updates)
- `/modules/activities/calendar/components/CalendarEventsCard.tsx` – remove dead query imports
- `/modules/activities/emails/hooks/useSendEmail.ts` – remove refetch calls or implement cache strategy
- `/modules/information-banner/hooks/useDismissReconnectAccountBanner.ts` – delete if mutation not implemented
- `/modules/information-banner/components/reconnect-account/InformationBannerReconnectAccountEmailAliases.tsx` – conditionally disable or implement mutation
- `/modules/information-banner/components/reconnect-account/InformationBannerReconnectAccountInsufficientPermissions.tsx` – same

### Test Files (Update)
- `/modules/activities/emails/graphql/queries/__tests__/getTimelineThreadsFromKeluargaId.test.ts`
- `/modules/activities/emails/graphql/queries/__tests__/getTimelineThreadsFromPendudukId.test.ts`
- `/modules/activities/calendar/components/__stories__/Calendar.stories.tsx` – remove mock data for deleted queries

