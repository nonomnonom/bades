<p align="center">
  <a href="https://bades.id">
    <img src="./packages/front/public/bd.svg" width="100px" alt="Bades.id logo" />
  </a>
</p>

<h2 align="center" >Sistem Informasi Desa Open Source</h2>

<p align="center"><a href="https://bades.id"><img src="./packages/website/public/images/readme/globe-icon.svg" width="12" height="12"/> Website</a> · <a href="https://docs.bades.id"><img src="./packages/website/public/images/readme/book-icon.svg" width="12" height="12"/> Dokumentasi</a> · <a href="https://github.com/badesid/bades"><img src="./packages/website/public/images/readme/map-icon.svg" width="12" height="12"/> Roadmap </a> · <a href="https://discord.gg/badesid"><img src="./packages/website/public/images/readme/discord-icon.svg" width="12" height="12"/> Discord</a></p>

<p align="center">
  <a href="https://bades.id">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/website/public/images/readme/github-cover-dark.webp" />
      <source media="(prefers-color-scheme: light)" srcset="./packages/website/public/images/readme/github-cover-light.webp" />
      <img src="./packages/website/public/images/readme/github-cover-light.webp" alt="Bades.id banner" />
    </picture>
  </a>
</p>

<br />

# Why Bades.id

Bades.id memberikan blok bangunan untuk Sistem Informasi Desa (SID) yang disesuaikan dengan kebutuhan pemerintahan desa dan dapat beradaptasi dengan cepat seiring perkembangan desa. Bades.id adalah SID yang Anda bangun, kirim, dan versioning seperti bagian lain dari stack Anda.

<a href="https://bades.id/resources/why-bades"><img src="./packages/website/public/images/readme/star-icon.svg" width="14" height="14"/> Pelajari lebih lanjut tentang mengapa kami membangun Bades.id</a>

<br />

# Instalasi

### <img src="./packages/website/public/images/readme/globe-icon.svg" width="14" height="14"/> Cloud

Cara tercepat untuk memulai. Daftar di [bades.id](https://bades.id) dan buat workspace dalam waktu kurang dari satu menit, tanpa infrastruktur yang harus dikelola dan selalu terbaru.

### <img src="./packages/website/public/images/readme/book-icon.svg" width="14" height="14"/> Bangun aplikasi

Scaffold aplikasi baru dengan Bades CLI:

```bash
npx create-bades-app my-app
```

Definisikan objek, field, dan view sebagai kode:

```ts
import { defineObject, FieldType } from 'bades-sdk/define';

export default defineObject({
  nameSingular: 'layanan',
  namePlural: 'layanan',
  labelSingular: 'Layanan',
  labelPlural: 'Layanan',
  fields: [
    { name: 'name', label: 'Nama', type: FieldType.TEXT },
    { name: 'jumlah', label: 'Jumlah', type: FieldType.CURRENCY },
    { name: 'tanggal', label: 'Tanggal', type: FieldType.DATE_TIME },
  ],
});
```

Luego envíalo a tu espacio de trabajo:

```bash
npx bades app:publish --private
```

Consulta la [guía de desarrollo de aplicaciones](https://docs.bades.id/developers/extend/apps/getting-started) para objetos, vistas, agentes y funciones lógicas.

### <img src="./packages/website/public/images/readme/rocket-icon.svg" width="14" height="14"/> Self-hosting

Ejecuta Bades.id en tu propia infraestructura con [Docker Compose](https://docs.bades.id/developers/self-host/capabilities/docker-compose), o contribuye localmente a través de la [guía de configuración local](https://docs.bades.id/developers/contribute/capabilities/local-setup).

<br />
<br />

# Todo lo que necesitas

Bades.id te proporciona los bloques de construcción de un SID moderno (objetos, vistas, flujos de trabajo y agentes) y te permite extendarlos como código. Aquí hay un recorrido de lo que hay en la caja.

¿Quieres profundizar? Lee la <a href="https://docs.bades.id/user-guide/introduction"><img src="./packages/website/public/images/readme/planner-icon.svg" width="14" height="14"/> Guía del Usuario</a> para tutoriales del producto, o la <a href="https://docs.bades.id"><img src="./packages/website/public/images/readme/book-icon.svg" width="14" height="14"/> Documentación</a> para referencia del desarrollador.

<table align="center">
  <tr>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./packages/website/public/images/readme/v2-build-apps-dark.webp" />
        <source media="(prefers-color-scheme: light)" srcset="./packages/website/public/images/readme/v2-build-apps-light.webp" />
        <img src="./packages/website/public/images/readme/v2-build-apps-light.webp" alt="Crea tus aplicaciones" />
      </picture>
      <p align="center"><a href="https://docs.bades.id/developers/extend/apps/getting-started"><img src="./packages/website/public/images/readme/code-icon.svg" width="16" height="16"/> Más información sobre aplicaciones en docs</a></p>
    </td>
    <td width="50%">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="./packages/website/public/images/readme/v2-version-control-dark.webp" />
        <source media="(prefers-color-scheme: light)" srcset="./packages/website/public/images/readme/v2-version-control-light.webp" />
        <img src="./packages/website/public/images/readme/v2-version-control-light.webp" alt="Mantente al día con control de versiones" />
      </picture>
      <p align="center"><a href="https://docs.bades.id/developers/extend/apps/publishing"><img src="./packages/website/public/images/readme/monitor-icon.svg" width="16" height="16"/> Más información sobre control de versiones en docs</a></p>
    </td>
  </tr>
</table>

<br />

# Stack

- <a href="https://www.typescriptlang.org/"><img src="./packages/website/public/images/readme/stack-typescript.svg" width="14" height="14"/> TypeScript</a>
- <a href="https://nx.dev/"><img src="./packages/website/public/images/readme/stack-nx.svg" width="14" height="14"/> Nx</a>
- <a href="https://nestjs.com/"><img src="./packages/website/public/images/readme/stack-nestjs.svg" width="14" height="14"/> NestJS</a>, dengan <a href="https://bullmq.io/">BullMQ</a>, <a href="https://www.postgresql.org/"><img src="./packages/website/public/images/readme/stack-postgresql.svg" width="14" height="14"/> PostgreSQL</a>, <a href="https://redis.io/"><img src="./packages/website/public/images/readme/stack-redis.svg" width="14" height="14"/> Redis</a>
- <a href="https://reactjs.org/"><img src="./packages/website/public/images/readme/stack-react.svg" width="14" height="14"/> React</a>, dengan <a href="https://jotai.org/">Jotai</a>, <a href="https://linaria.dev/">Linaria</a> dan <a href="https://lingui.dev/">Lingui</a>

<br />

# Bergabung dengan Komunitas

<p><a href="https://github.com/badesid/bades"><img src="./packages/website/public/images/readme/star-icon.svg" width="12" height="12"/> Berikan star repo</a> · <a href="https://discord.gg/badesid"><img src="./packages/website/public/images/readme/discord-icon.svg" width="12" height="12"/> Discord</a> · <a href="https://github.com/badesid/bades/discussions"><img src="./packages/website/public/images/readme/message-icon.svg" width="12" height="12"/> Permintaan fitur</a> · <a href="https://x.com/badesid"><img src="./packages/website/public/images/readme/x-icon.svg" width="12" height="12"/> X</a> · <a href="https://www.linkedin.com/company/badesid/"><img src="./packages/website/public/images/readme/linkedin-icon.svg" width="12" height="12"/> LinkedIn</a> · <a href="https://github.com/badesid/bades/contribute"><img src="./packages/website/public/images/readme/code-icon.svg" width="12" height="12"/> Berkontribusi</a></p>
