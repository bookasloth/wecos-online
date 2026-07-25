# WeCos Documentation

Start here. Most of this tree is scaffolded and marked **Stub** — the files below
marked ✅ contain real, current content. Don't trust a stub; check the code.

## Read these first

| | Doc | What it gives you |
|---|---|---|
| ✅ | [AI_CONTEXT.md](AI_CONTEXT.md) | The short brief. Read before touching anything. |
| ✅ | [PROJECT_STATUS.md](PROJECT_STATUS.md) | Where the project actually stands today. |
| ✅ | [NEXT_TASK.md](NEXT_TASK.md) | The next thing to pick up. |
| ✅ | [BUSINESS_MODEL.md](BUSINESS_MODEL.md) | What the company is and how money flows. Internal. |
| ✅ | [FEATURES.md](FEATURES.md) | Every feature × membership tier. The product spec. |

## Architecture & data

| | Doc | |
|---|---|---|
| ✅ | [ARCHITECTURE.md](ARCHITECTURE.md) | Layers and boundaries |
| ✅ | [TECH_STACK.md](TECH_STACK.md) | What we run and why |
| ✅ | [DATABASE.md](DATABASE.md) | Entity model overview |
| ✅ | [database/schema.md](database/schema.md) | Full schema, domain by domain |
| ✅ | [AUTHORIZATION.md](AUTHORIZATION.md) | Tier entitlements — the gate everything checks |
| ✅ | [ROUTING.md](ROUTING.md) | URL scheme, reserved handles, redirects |
| | [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) · [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) · [API.md](API.md) · [AUTHENTICATION.md](AUTHENTICATION.md) | Stubs |

## Product

| | Doc | |
|---|---|---|
| ✅ | [ROADMAP.md](ROADMAP.md) | Build order |
| ✅ | [KNOWN_ISSUES.md](KNOWN_ISSUES.md) | What's broken and deliberately unfixed |
| ✅ | [prd/PAYMENTS_PRD.md](prd/PAYMENTS_PRD.md) | Tiers, checkout, credits |
| ✅ | [prd/CRM_PRD.md](prd/CRM_PRD.md) | Lead masking and unlock — the provider business model |
| | Other PRDs in [prd/](prd/) | Stubs |

## Design

| | Doc | |
|---|---|---|
| ✅ | [UI_UX_GUIDE.md](UI_UX_GUIDE.md) | The standing design brief. Read before building any UI. |
| ✅ | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Token and component contract |
| ✅ | [COMPONENTS.md](COMPONENTS.md) | Five-layer architecture, section library, page templates |
| | [design/](design/) | Per-element specs — stubs |

## Decisions

| | Doc | |
|---|---|---|
| ✅ | [DECISIONS.md](DECISIONS.md) | Decision index |
| ✅ | [adr/](adr/) | 0001–0005, all written |
| ✅ | [ASSUMPTIONS.md](ASSUMPTIONS.md) | What we're taking on faith |

## Audits

| | Doc | |
|---|---|---|
| ✅ | [FRONTEND_AUDIT.md](FRONTEND_AUDIT.md) | Full codebase audit + remediation log |
| ✅ | [ARCHITECTURE_ROADMAP.md](ARCHITECTURE_ROADMAP.md) | Earlier long-range plan (predates WeCos 2.0) |

---

## Rules for this documentation set

1. **A stub is a promise, not a fact.** If a doc says Stub, the code is the truth.
2. **Update the doc in the same commit as the code.** A doc that lies is worse than a missing one.
3. **Decisions go in [DECISIONS.md](DECISIONS.md) or an ADR**, not in a commit message where nobody will find them.
4. **Don't create more stubs.** There are already more than we can maintain.
