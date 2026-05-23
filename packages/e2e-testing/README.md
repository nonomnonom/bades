# Bades End-to-End (E2E) Testing

## Prasyarat

Install browser Playwright:

```
npx nx setup e2e-testing
```

### Jalankan semua test

```
npx nx test e2e-testing
```

### Mode UI interaktif

```
npx nx test:ui e2e-testing
```

### Jalankan file test tertentu

```
npx nx test e2e-testing <filename>
```

Contoh (path test relatif terhadap root package `e2e-testing`):

```
npx nx test e2e-testing tests/login.spec.ts
```

### Mode debug

```
npx nx test:debug e2e-testing
```

### Tampilkan report

```
npx nx test:report e2e-testing
```

## Catatan

`path.resolve()` dipakai di banyak tempat agar root directory test konsisten
saat dijalankan lewat CLI maupun dari IDE.
