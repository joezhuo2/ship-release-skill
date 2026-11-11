---
name: ship-release
description: Use when the user asks to release, ship, publish, cut or tag a version of a project ("release v0.2.0", "ship a patch", "bump and publish"). Bumps every version manifest, updates CHANGELOG and README badges, commits, tags, creates the GitHub release, and publishes to or verifies npm.
argument-hint: "[version | patch | minor | major]"
---

# ship-release

Release the current project end to end. Requested version or bump: $ARGUMENTS

Run the steps in order. Stop and report as soon as a step fails; never skip ahead.

## 1. Pick the version

- Last release: `git describe --tags --abbrev=0` (no tag yet means this is the first release; use the manifest version).
- If the user gave a version or `patch` / `minor` / `major`, use it.
- Otherwise propose one from `git log <last-tag>..HEAD --oneline`: breaking change is major (minor while on 0.x), new feature is minor, anything else is patch. Ask once.
- Keep the repo's tag style (`v1.2.3` or `1.2.3`), taken from the existing tags. Default `v`.

## 2. Preflight

All of these must pass before any file changes:

- `git status --porcelain` is clean, or holds only changes meant for this release. Ask about anything else.
- You are on the default branch and, after `git fetch`, not behind its upstream.
- The tag does not exist: `git tag -l <tag>` and `git ls-remote --tags origin <tag>` are both empty.
- `gh auth status` succeeds.
- If `package.json` exists and is not `"private": true`: `npm whoami` succeeds and `npm view <name>@<version> version` finds nothing.
- The project's tests pass (`npm test`, or whatever the README or CI uses).

## 3. Bump every manifest

Find every place the old version lives:

```bash
git grep -nF "<old-version>" -- . ':!CHANGELOG.md' ':!*lock*'
```

Usual places:

| File | How |
|------|-----|
| `package.json`, `package-lock.json` | `npm version <new> --no-git-tag-version` |
| `.claude-plugin/plugin.json` | `version` |
| `.claude-plugin/marketplace.json` | `version` of each plugin entry, if present |
| `pyproject.toml`, `setup.py`, `__version__` | edit |
| `Cargo.toml` | edit, then `cargo check` to refresh `Cargo.lock` |
| `manifest.json`, version constants in source | edit |

Read each grep hit before changing it: bump the project's own version, not a dependency that happens to share the number. Run the grep again afterwards; every remaining hit needs a reason.

## 4. Changelog

- Follow the format the file already uses. If there is no `CHANGELOG.md`, create one in Keep a Changelog format.
- Add `## [<new>] - <YYYY-MM-DD>` above the previous release, built from `git log <last-tag>..HEAD`.
- Group as Added / Changed / Fixed. Write what changed for the user, not commit subjects. Leave out version bumps and merge commits.
- If there is an `[Unreleased]` section, move its entries into the new section and leave the heading empty.
- Update the compare links at the bottom if the file has them.

## 5. README

- Dynamic badges (`img.shields.io/npm/v/...`, `github/v/release/...`) update themselves. Leave them.
- Update hardcoded versions: static badges (`badge/version-1.2.3-...`), install lines pinned to `@1.2.3` or `#v1.2.3`, "current version" text.
- If the release adds a command, option or install step the README does not mention, add it.

## 6. Check, then confirm

- Run the tests again.
- npm package: `npm pack --dry-run` and read the file list. No secrets, no missing files.
- `git diff --stat` and read the diff for secrets (tokens, `.env`, keys).
- Show the user the version, the changed files and the new changelog section. Ask once before step 7, unless they already told you to release without asking. Everything after this point is public and cannot be undone.

## 7. Commit, tag, push

- Stage only the release files. Use the message style of earlier release commits (`git log --oneline -20`); default `Release v<new>`.
- If the default branch is protected or the repo releases through PRs: push a `release/v<new>` branch, open a PR, wait for the merge, then tag the merge commit.
- `git tag -a <tag> -m "<tag>"`
- `git push origin <branch>` then `git push origin <tag>`. Never `--tags`, never `--force`.

## 8. GitHub release

Read `.github/workflows/` first.

- A workflow that runs on tag push and creates the release: do not create one yourself. `gh run watch` it, then `gh release view <tag>`.
- Otherwise: write the new changelog section to a temp file and run `gh release create <tag> --title <tag> --notes-file <file> --verify-tag`. Add `--prerelease` for `-rc`, `-beta` or `-alpha` versions.

## 9. npm

Skip if there is no `package.json` or it is private.

- A workflow that runs `npm publish`: wait for it instead of publishing yourself.
- Otherwise `npm publish` from the tagged commit. Add `--access public` for a scoped package's first publish and `--tag next` for prereleases.
- If npm asks for a one-time password or browser login, stop and ask the user to run `npm publish` themselves. Never ask for or type their password or token.
- Verify: `npm view <name>@<new> version` prints the version. The registry can lag; retry for up to a minute. Then check `npm view <name> dist-tags.latest`.

## 10. Report

Give the version, the tag, the release URL, the npm URL, and anything skipped, failed or not verified.

## When something goes wrong

- Before the push: fix it and amend freely.
- After the push: never move or delete a pushed tag, never force-push, never `npm unpublish`. Fix forward with a patch release.
- Tag pushed but `npm publish` failed: fix the cause and publish again from the tagged commit. Do not retag.
- Release workflow failed: read `gh run view --log-failed`, fix forward, and tell the user what state the tag, the release and the registry are in.
