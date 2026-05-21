---
paths:
  - ".github/**/*.yml"
  - ".github/**/*.yaml"
---

# GitHub Actions Security

## Pin Third-Party Actions to Commit SHAs

Always reference external actions and reusable workflows by their full commit
SHA, never by a mutable tag or branch. Tags can be force-pushed by a
compromised maintainer account.

```yaml
# Wrong: mutable tag, vulnerable to supply-chain attacks
uses: actions/checkout@v4
uses: actions/setup-node@v4

# Right: pinned to commit SHA with tag comment for readability
uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4.3.1
uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
```

## Prefer `gh api` Over Third-Party Dispatch Actions

For repository dispatch calls, use `gh api` directly instead of third-party
actions like `peter-evans/repository-dispatch`. This removes an extra
supply-chain dependency.

```yaml
# Right: use env vars and bracket notation to reduce injection risk
- name: Dispatch to target repo
  env:
    GH_TOKEN: ${{ secrets.DISPATCH_TOKEN }}
    PR_NUMBER: ${{ github.event.pull_request.number }}
    BRANCH: ${{ github.event.workflow_run.head_branch }}
  run: |
    gh api repos/org/repo/dispatches \
      -f event_type=my-event \
      -f "client_payload[pr_number]=$PR_NUMBER" \
      -f "client_payload[branch]=$BRANCH"

# Right: simple dispatch without payload
- name: Trigger workflow
  env:
    GH_TOKEN: ${{ secrets.DISPATCH_TOKEN }}
  run: |
    gh api repos/org/repo/dispatches -f event_type=my-event

# Wrong: third-party action dependency
- uses: peter-evans/repository-dispatch@v2
  with:
    token: ${{ secrets.DISPATCH_TOKEN }}
    repository: org/repo
    event-type: my-event

# Wrong: inline ${{ }} in shell, vulnerable to injection
- run: |
    gh api repos/org/repo/dispatches --input - <<EOF
    {"event_type": "x", "client_payload": {"branch": "${{ github.head_ref }}"}}
    EOF
```

## Minimal Permissions

Always declare explicit `permissions` at the job level with the least privilege
required. Never rely on the default `GITHUB_TOKEN` permissions.

```yaml
# Right: explicit minimal permissions
permissions:
  contents: read

# Wrong: overly broad or implicit permissions
permissions: write-all
```
