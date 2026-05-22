<div align="center">
  <a href="https://bades.id">
    <picture>
      <img alt="Bades logo" src="https://raw.githubusercontent.com/bades-id/bades/main/packages/bades-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>Create Bades App</h1>

<a href="https://www.npmjs.com/package/create-bades-app"><img alt="NPM version" src="https://img.shields.io/npm/v/create-bades-app.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/bades-id/bades/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=Bades&labelColor=000000&logoWidth=20"></a>

</div>

The official scaffolding CLI for building apps on top of [Bades.id](https://bades.id). Sets up a ready-to-run project with [bades-sdk](https://www.npmjs.com/package/bades-sdk).

## Quick start

```bash
npx create-bades-app@latest my-bades-app
cd my-bades-app
yarn bades dev
```

The scaffolder will:

1. Create a new project with TypeScript, linting, tests, and a preconfigured `bades` CLI
2. Start a local Bades server via Docker (pulls the latest image automatically)
3. Authenticate with the development API key

## Options

| Flag                               | Description                                                           |
| ---------------------------------- | --------------------------------------------------------------------- |
| `--name <name>`                    | Set the app name                                                      |
| `--display-name <displayName>`     | Set the display name                                                  |
| `--description <description>`      | Set the description                                                   |
| `--url <url>`                      | Bades workspace URL (default: `http://localhost:2020`)                |
| `--authentication-method <method>` | `oauth` or `apiKey` (default: `apiKey` for local, `oauth` for remote) |

## Documentation

Full documentation is available at **[docs.bades.id/developers/extend/apps](https://docs.bades.id/developers/extend/apps/getting-started/quick-start)**:

- [Quick Start](https://docs.bades.id/developers/extend/apps/getting-started/quick-start) — scaffold, run a local server, sync your code
- [Concepts](https://docs.bades.id/developers/extend/apps/getting-started/concepts) — how apps work: entity model, sandboxing, lifecycle
- [Operations](https://docs.bades.id/developers/extend/apps/operations/overview) — CLI, testing, CI, deploy and publish

## Troubleshooting

- Server not starting: check Docker is running (`docker info`), then try `yarn bades docker:logs`.
- Auth not working: run `yarn bades remote:add --local` to re-authenticate.
- Types not generated: ensure `yarn bades dev` is running — it auto-generates the typed client.

## Contributing

- See our [GitHub](https://github.com/bades-id/bades)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
