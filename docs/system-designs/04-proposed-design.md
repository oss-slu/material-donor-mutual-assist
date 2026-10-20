# Proposed approval and notification design

**Material Derailleur / BWorks** · Recommendation based on snapshot `3c75abdc` · October 19, 2026

**Proposed — not implemented.** Stage updates for review, apply approved changes atomically and track retryable email delivery. Dashed boxes identify proposed behavior.

```mermaid
flowchart TB
    guards["Verify access-token purpose and claims; load existing ACTIVE user and current role"]
    stage["Store PENDING proposal: status, attributes and notification intent"]
    review{"Tier One or Admin approves pending proposal?"}
    reject["Retain REJECTED record; published item unchanged"]

    subgraph transaction ["One database transaction on approval"]
        apply["Apply approved item status and attributes"]
        approve["Conditionally change PENDING review to APPROVED"]
        outbox["Insert unique notification outbox event when required"]
    end

    donorApi["Donor API: enforce ownership and return only APPROVED history"]
    worker["Email worker: read durable event and record attempts"]
    smtp["SMTP: send according to donor notification policy"]
    delivered["Record delivery outcome"]

    guards --> stage
    stage --> review
    review -->|"Reject"| reject
    review -->|"Approve"| apply
    apply --> approve
    approve --> outbox
    outbox -->|"After commit"| donorApi
    outbox -->|"Notification event"| worker
    worker --> smtp
    smtp -->|"Success"| delivered
    smtp -.->|"Failure: retry with backoff"| worker

    classDef proposed fill:#ECF3FA,stroke:#245D89,stroke-dasharray:6 4
    classDef pending fill:#FFF3DD,stroke:#845016,stroke-dasharray:6 4
    classDef accepted fill:#EAF5F1,stroke:#12635D,stroke-dasharray:6 4
    classDef rejected fill:#FCEEEE,stroke:#923D3D,stroke-dasharray:6 4
    class guards,donorApi proposed
    class stage,review pending
    class apply,approve,outbox,worker,smtp,delivered accepted
    class reject rejected
    style transaction fill:#F5F8F9,stroke:#12635D,stroke-dasharray:6 4
```

- **Before implementation:** confirm publication/approval semantics and donor email preferences with BWorks; plan migration of existing pending history. Staging a proposal leaves the published item unchanged.
- **Consistency:** the transaction rolls back unless the pending review is accepted once. A unique event key prevents repeated approval from creating duplicate notification jobs. SMTP cannot guarantee exactly-once delivery after an ambiguous failure.
- **Trade-off:** explicit review/outbox data and a worker add operational work in exchange for consistent item history, retained rejections and observable email attempts.

**Basis:** the [current workflow](03-current-status-workflow.md) exposes separate item/history writes, deleted rejection history and notification intent without delivery tracking. These recommendations are not an agreed sprint commitment.

[Checkpoint index](README.md) · [One-page context](context.md) · [Source map and text equivalent](source-map.md#04--proposed-design-not-implemented)
