# Naming Conventions

Gunakan rule ini untuk penamaan file, folder, simbol, dan suffix teknis di
repo Bades.

## Prinsip utama

- Ikuti pola yang sudah dominan di package yang disentuh, jangan memaksakan
  rename massal lintas repo tanpa task eksplisit.
- Untuk code baru, pilih nama yang deskriptif, konsisten, dan mudah dicari.
- Untuk konsep domain bisnis, prioritaskan istilah Indonesia bila tidak
  berbenturan dengan API/framework eksternal.

## File dan folder

- Folder gunakan `kebab-case`.
- File React component, provider, context view, dan story gunakan
  `PascalCase.tsx`.
- File hook gunakan `camelCase` dan diawali `use`, misalnya
  `useDataPenduduk.ts` atau `useCopyToClipboard.tsx`.
- File utilitas, helper, service, constant, dan runner non-component gunakan
  `kebab-case` atau suffix teknis yang sudah lazim di repo.
- Jangan membuat nama file generik seperti `utils.ts`, `helpers.ts`, atau
  `index2.ts` jika isinya spesifik.

## Symbol dan type

- Component React gunakan `PascalCase`.
- Type alias, props type, dan class gunakan `PascalCase`.
- Variable, function, hook, dan parameter gunakan `camelCase`.
- Constant module-level gunakan `camelCase` kecuali benar-benar konstanta global
  yang sudah lazim memakai `UPPER_SNAKE_CASE`.
- Enum label, option label, dan user-facing constant yang tampil ke user tetap
  harus mengikuti bahasa produk Bades.

## Suffix yang disukai

- Props component: `*Props`
- Hook: `use*`
- Service: `*.service.ts`
- Constant: `*.constant.ts`
- Util: `*.util.ts`
- Test frontend: `*.test.ts` atau `*.test.tsx`
- Test backend: `*.spec.ts`
- Integration test: `*.integration-spec.ts`
- Story: `*.stories.tsx`

## Hindari unused code

- Jangan tinggalkan `unused local`, `unused parameter`, import mati, atau
  variabel placeholder yang tidak dipakai di kode baru.
- Jika framework mewajibkan parameter hadir tetapi tidak dipakai, beri nama yang
  jelas dan gunakan prefix `_` hanya bila memang diperlukan.
- Saat mengedit file lama, bersihkan unused code di area yang disentuh jika aman
  dilakukan tanpa memperluas scope secara berlebihan.
