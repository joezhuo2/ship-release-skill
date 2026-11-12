# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.2] - 2026-11-11

### Added

- Pull request route for releases made on a branch, in a worktree or against a protected default branch: pre-PR check, open the PR, fix conflicts, wait for checks, merge, then delete the worktree and branch.

## [0.1.1] - 2026-11-11

### Changed

- npm package renamed to `ship-release-skill`; the `ship-release` name on npm belongs to another package. 0.1.0 was never published to npm.

## [0.1.0] - 2026-11-11

### Added

- `ship-release` skill: pick the version, preflight, bump every manifest, changelog, README badges, commit, tag, GitHub release, npm publish and check.
- Plugin manifest and marketplace entry.
- npx installer and `npm i -g` install.
- Self-test, release workflow, README and MIT license.
