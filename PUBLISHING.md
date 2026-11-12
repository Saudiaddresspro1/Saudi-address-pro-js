# Token-free npm publishing

This public repository contains only the saudi-address-pro client SDK. The website, backend and their Git history stay in a separate private repository. Do not copy application files, credentials, .env files or npm authentication files here.

## One-time npm setup

First merge the publishing workflow into main after verification passes. Then open https://www.npmjs.com/package/saudi-address-pro under the package owner account and choose Settings > Trusted Publisher > GitHub Actions:

| Field | Exact value |
| --- | --- |
| Organization or user | Saudiaddresspro1 |
| Repository | Saudi-address-pro-js |
| Workflow filename | publish.yml |
| Environment name | Leave blank |
| Allowed actions, if shown | Allow direct publishing with npm publish |

Do not add an NPM_TOKEN or NODE_AUTH_TOKEN secret. The workflow uses npm Trusted Publishing via GitHub OIDC, GitHub-hosted Ubuntu, Node 24 and npm 11.

## First real publish

A new trusted publisher must complete its first successful publish within two days of creation. A dry run does not count. If it expires, delete the expired configuration and recreate it just before testing.

The prepared release is 1.0.2, a new version after the already-published 1.0.1. SDK source is copied unchanged; only publishing/build metadata and automation are updated. Never republish an existing version.

After saving the trusted publisher, either:

- Open Actions > Publish npm package > Run workflow and select main; or
- Push the matching version tag v1.0.2 after merging the prepared release.

Do not do both for the same version: the second attempt will fail because npm versions are immutable. The workflow checks that tags match package.json. Manual publishing is restricted to main. Prerelease versions use the next dist-tag; stable releases use latest.

Check that the Actions publish job succeeds, then verify the version at https://www.npmjs.com/package/saudi-address-pro and run npm view saudi-address-pro@1.0.2 version. A successful build or dry run is not proof that OIDC publishing works.

## Only after the first successful OIDC release

1. npm package > Settings > Publishing access > Require two-factor authentication and disallow tokens > Update Package Settings. Trusted Publishing continues working.
2. GitHub repository > Settings > Secrets and variables > Actions: remove unused NPM_TOKEN, NODE_AUTH_TOKEN or other npm write-token secrets. Check repository, environment and applicable organization secrets; do not remove unrelated credentials or read-only tokens needed by other packages.
3. Revoke the obsolete publishing token in the npm account. Remove its stored copies, including any old Replit npm publishing secret, only after confirming no other publishing process needs it.
4. Keep account 2FA enabled. Protect main and release tags where supported.

## Future releases

Update package.json and package-lock.json version together, merge, and push the corresponding v-prefixed tag, or manually run the workflow from main. Existing SDK behavior must not change as part of authentication maintenance.

Reference: https://docs.npmjs.com/trusted-publishers/
