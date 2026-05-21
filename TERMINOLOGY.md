# Terminologi CRM ke SID Bades

## Mapping Padanan

| Istilah CRM (English) | Padanan SID (Indonesia) | Catatan |
|----------------------|------------------------|---------|
| `Company` | `Penduduk` atau `Warga` | Entry utama - orang penduduk dengan NIK |
| `People` / `Contact` | `Warga` | Alias untuk penduduk yang memiliki relasi |
| `Opportunity` | `Permohonan Layanan` | Ketika warga mengajukan surat/layanan |
| `Pipeline` | `Alur Layanan` | Flow permohonan dariAjuan → approve → terbit |
| `Deal` | `Layanan` | Instance permohonan yang sedang diproses |
| `Task` | `Tugas` atau `Agenda` | Bisa tetap Tugas di konteksagenda rapat dll |
| `Workspace` | `Desa` | Instance/unit pemerintahan |
| `Account` | `Kartu Keluarga` atau `Keluarga` | Rekening keluarga (KK) |
| `Note` | `Catatan` | Catatan umum warga |
| `Activity` | `Aktivitas` | Aktivitas tracking layanan |
| `View` | `Tampilan` | View/list data |

## Terminologi Internal (Tidak User-Facing)

| Internal | Context |
|---------|---------|
| `company` (API field) | tetap `company` atau rename ke `person` |
| `opportunity` (API field) | rename ke `serviceRequest` |
| `pipelineStage` | `serviceStatus` |
| `dealStage` | `serviceStage` |

## Seed Data Mapping

| Twenty Seed | Bades Seed |
|-------------|------------|
| Demo Companies | Data Keluarga-example |
| Demo People | Data Penduduk-example |
| Demo Pipeline | Alur Permohonan Surat |
| Demo Opportunities | Permohonan Layanan Active |
| Demo Tasks | Agenda Musyawarah |
| Demo Notes | Catatan Desa |

## Labels UI Mapping

| Location | Twenty Label | Bades Label |
|----------|-------------|-------------|
| Nav Items | Companies / People | Penduduk / Warga |
| Object Name | Opportunity | Permohonan |
| Pipeline | Pipeline | Alur Layanan |
| Empty State | No companies yet | Belum ada data penduduk |
| Button | Add Company | Tambah Penduduk |