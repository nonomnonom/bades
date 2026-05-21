<div align="center">
  <a href="https://bades.id">
    <picture>
      <img alt="Bades logo" src="https://raw.githubusercontent.com/bades-id/bades/main/packages/bades-website/public/images/core/logo.svg" height="128">
    </picture>
  </a>
  <h1>Bades SDK</h1>

<a href="https://www.npmjs.com/package/bades-sdk"><img alt="NPM version" src="https://img.shields.io/npm/v/bades-sdk.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://github.com/bades-id/bades/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000"></a>
<a href="https://discord.gg/cx5n4Jzs57"><img alt="Join the community on Discord" src="https://img.shields.io/badge/Join%20the%20community-blueviolet.svg?style=for-the-badge&logo=Bades&labelColor=000000&logoWidth=20"></a>

</div>

A CLI and SDK to develop, build, and publish applications that extend [Bades.id](https://bades.id).

## Quick start

The recommended way to start is with [create-bades-app](https://www.npmjs.com/package/create-bades-app):

```bash
npx create-bades-app@latest my-bades-app
cd my-bades-app
yarn bades dev
```

## Documentation

Full documentation is available at **[docs.bades.id/developers/extend/apps](https://docs.bades.id/developers/extend/apps/getting-started)**:

- [Getting Started](https://docs.bades.id/developers/extend/apps/getting-started) — scaffolding, local server, authentication, dev mode
- [Building Apps](https://docs.bades.id/developers/extend/apps/building) — entity definitions, API clients, testing, CLI reference
- [Publishing](https://docs.bades.id/developers/extend/apps/publishing) — deploy, npm publish, marketplace

## Manual installation

If you are adding `bades-sdk` to an existing project instead of using `create-bades-app`:

```bash
yarn add bades-sdk bades-client-sdk
```

Then add a `bades` script to your `package.json`:

```json
{
  "scripts": {
    "bades": "bades"
  }
}
```

Run `yarn bades help` to see all available commands.

## Configuration

The CLI stores credentials per remote in `~/.bades/config.json`. Run `yarn bades remote:add` to configure a remote, or `yarn bades remote:list` to see existing ones.

## Troubleshooting

- Auth errors: run `yarn bades remote:add` to re-authenticate.
- Typings out of date: restart `yarn bades dev` to refresh the client and types.
- Not seeing changes in dev: make sure dev mode is running (`yarn bades dev`).

## Contributing

### Development setup

```bash
git clone https://github.com/bades-id/bades.git
cd bades
yarn install
```

### Development mode

```bash
npx nx run bades-sdk:dev
```

### Production build

```bash
npx nx run bades-sdk:build
```

### Running the CLI locally

```bash
npx nx run bades-sdk:start -- <command>
```

### Resources

- See our [GitHub](https://github.com/bades-id/bades)
- Join our [Discord](https://discord.gg/cx5n4Jzs57)
