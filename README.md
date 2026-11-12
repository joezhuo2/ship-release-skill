<h1 align="center">ship-release</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/ship-release-skill"><img src="https://img.shields.io/npm/v/ship-release-skill?logo=npm&color=orange" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/ship-release-skill"><img src="https://img.shields.io/npm/dt/ship-release-skill?logo=npm&color=blue" alt="npm downloads"></a>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="platform: Windows | macOS | Linux">
  <a href="https://code.claude.com/docs/en/plugins"><img src="https://img.shields.io/badge/Claude%20Code-plugin-D97757?logo=claude&logoColor=white" alt="Claude Code plugin"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-18%2B-5FA04E?logo=nodedotjs&logoColor=white" alt="Node 18+"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/joezhuo2/ship-release-skill?color=green" alt="license"></a>
</p>

<p align="center">
  <a href="#install">Install</a> •
  <a href="#what-it-does">What it does</a> •
  <a href="#usage">Usage</a> •
  <a href="#files">Files</a> •
  <a href="#development">Development</a> •
  <a href="#license">License</a>
</p>

> ship-release is a Claude Code skill that ships a release of the project you
> are in, the same way every time: bump every version manifest, write the
> changelog, fix README badges, commit, tag, create the GitHub release, then
> publish to npm and check the registry.

## Install

Pick one. All of them install the same plugin.

- **npx:** nothing stays installed besides the plugin.

  ```bash
  npx ship-release-skill
  ```

- **npm, global:** installs the `ship-release-skill` command, which you then run once.

  ```bash
  npm i -g ship-release-skill
  ```

  ```bash
  ship-release-skill
  ```

- **Claude Code plugin marketplace:** run these inside Claude Code.

  ```
  /plugin marketplace add joezhuo2/ship-release-skill
  /plugin install ship-release@ship-release
  ```

Restart Claude Code afterwards. The skill needs `git` and the
[GitHub CLI](https://cli.github.com) (`gh`), and `npm` for npm packages.

## What it does

| Step | What happens |
|------|--------------|
| Pick the version | Uses the one you gave, or proposes patch / minor / major from the commits since the last tag. |
| Preflight | Clean tree, default branch or a release branch, up to date, tag is free, `gh` and `npm` logged in, version not on npm, tests pass. |
| Bump manifests | Greps the old version and bumps `package.json`, lockfile, `.claude-plugin/plugin.json`, `marketplace.json`, `pyproject.toml`, `Cargo.toml` and version constants. |
| Changelog | Adds a dated section in the file's own format, written from the commits. |
| README | Updates hardcoded version badges and pinned install lines; leaves dynamic badges alone. |
| Confirm | Shows the version, files and changelog section, and asks once before anything goes public. |
| Commit, land, tag | Release commit in the repo's style, pushed directly or through a pull request, then an annotated tag. Never `--force`. |
| Pull request route | On a branch, in a worktree or with a protected default branch: pre-PR check, open the PR, fix conflicts, wait for checks, merge. |
| GitHub release | Waits for a tag-triggered release workflow if the repo has one, otherwise `gh release create` with the changelog section. |
| npm | Publishes unless a workflow does or the package is private, then checks the registry shows the new version. |
| Clean up worktrees | Removes the worktrees it created during the session and their merged branches, then prunes. Leaves yours alone. |
| Report | Version, tag, release URL, npm URL, worktrees removed, and anything skipped or failed. |

After a push it only fixes forward: no moved tags, no force-push, no `npm unpublish`.

## Usage

Ask in plain words, in the project you want to release:

```
ship a patch release
```

```
release v0.3.0
```

Or call the skill directly:

```
/ship-release:ship-release minor
```

## Files

| Path | Purpose |
|------|---------|
| `skills/ship-release/SKILL.md` | The release procedure Claude follows. |
| `.claude-plugin/` | Plugin manifest and marketplace entry. |
| `bin/install.js` | The `npx ship-release-skill` installer. |
| `test.js` | Self-test: versions agree and the skill is well formed. |

## Development

```bash
npm test
```

## License

[MIT](LICENSE)
