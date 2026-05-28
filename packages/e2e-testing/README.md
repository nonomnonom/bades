# Bades End-to-End (E2E) Testing

## Prasyarat

Install browser Playwright:

```
bunx nx setup e2e-testing
```

### Jalankan semua test

```
bunx nx test e2e-testing
```

### Mode UI interaktif

```
bunx nx test:ui e2e-testing
```

### Jalankan file test tertentu

```
bunx nx test e2e-testing <filename>
```

Contoh (path test relatif terhadap root package `e2e-testing`):

```
bunx nx test e2e-testing tests/login.spec.ts
```

### Mode debug

```
bunx nx test:debug e2e-testing
```

### Tampilkan report

```
bunx nx test:report e2e-testing
```

## Catatan

`path.resolve()` dipakai di banyak tempat agar root directory test konsisten
saat dijalankan lewat CLI maupun dari IDE.
