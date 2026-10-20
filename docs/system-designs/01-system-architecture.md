# Current system architecture and local deployment

**Material Derailleur / BWorks** · Source snapshot: `3c75abdc` · October 19, 2026

One Express backend supports the React application, PostgreSQL persistence and external integrations. This view documents the checked-in local Compose configuration.

```mermaid
flowchart TB
    browser["Browser: donors, tiered staff and administrators"]

    subgraph compose ["Local Docker Compose"]
        frontend["React frontend: host 3000 to container 3000"]

        subgraph backend ["Express / TypeScript backend: host 5050 to container 5000"]
            routes["Routes: donors, auth, programs, items, status review, CSV, barcode and reset"]
            guards["JWT, role rank and ACTIVE checks on guarded routes"]
            services["Services: media, image analysis and email"]
            prisma["Prisma with PostgreSQL driver adapter"]
        end

        database[("PostgreSQL: host 5432 to container 5432")]
        volume[("Persistent postgres_data volume")]
    end

    media["Media adapter: Azure Blob Storage or local uploads"]
    gemini["Google Gemini: optional image analysis to JSON tags"]
    smtp["SMTP through Nodemailer: receipts, updates and account messages"]

    browser -->|"Load application"| frontend
    browser -->|"JSON or multipart requests"| routes
    routes --- guards
    routes --> services
    routes --> prisma
    services --> prisma
    prisma -->|"SQL"| database
    database --- volume
    services -->|"Store and retrieve images"| media
    services -.->|"Optional enrichment"| gemini
    services -->|"Send email"| smtp

    style compose fill:#F5F8F9,stroke:#A2B3BA
    style backend fill:#ECF3FA,stroke:#245D89
    style guards fill:#FFF3DD,stroke:#845016
    style database fill:#EAF5F1,stroke:#12635D
```

- The backend starts after the database health check. AI and email calls currently run during requests.
- **Technical debt:** some mutation routes lack authorization checks. Local media returns `/uploads/...` URLs, but the API has no matching static mount.
- This is a development deployment. The separate CloudFormation scaffold does not establish a verified production topology.

**Sources:** [API composition](../../server/src/index.ts#L69), [Compose](../../docker-compose.yml), [media adapter](../../server/src/services/donatedItemService.ts#L12), [AI service](../../server/src/services/imageAnalysisService.ts#L140), [email service](../../server/src/services/emailService.ts#L9).

[Checkpoint index](README.md) · [One-page context](context.md) · [Source map and text equivalent](source-map.md#01--current-architecture-and-local-deployment)
