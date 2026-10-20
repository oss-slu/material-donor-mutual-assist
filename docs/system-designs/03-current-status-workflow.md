# Current status submission, review and donor visibility

**Material Derailleur / BWorks** · Source snapshot: `3c75abdc` · October 19, 2026

Approval controls donor timeline visibility in the UI and optional update email. The item changes before review.

```mermaid
sequenceDiagram
    actor staff as Staff: Tier Three or higher
    participant api as Express API
    participant db as PostgreSQL
    actor reviewer as Reviewer: Tier One or Admin
    participant smtp as SMTP
    actor donor as Donor UI

    staff->>api: POST /donatedItem/status/:id with status, photos and notification request
    api->>api: Check JWT, role rank and ACTIVE account, then upload photos
    api->>db: Update item currentStatus and supplied attributes immediately
    db-->>api: Item updated
    api->>db: Insert separate history row: approval=false and donorInformed=request flag
    db-->>api: Pending history created
    api-->>staff: Update submitted

    reviewer->>api: GET /donatedItem/status/review
    api-->>reviewer: Pending history for review
    alt Approve
        reviewer->>api: PUT /donatedItem/status/review/:id
        api->>db: Set approval=true
        opt Donor notification requested and donor email exists
            api->>smtp: Attempt donation update email
        end
        api-->>reviewer: Approved
    else Deny
        reviewer->>api: DELETE /donatedItem/status/review/:id
        api->>db: Delete history row only
        api-->>reviewer: Denied, item state remains changed
    end

    donor->>api: GET /donor/me
    api->>db: Load donor donations and all history
    db-->>api: Approved and pending history
    api-->>donor: Return history and hydrated images, including pending rows
    donor->>donor: Display only approved history and photos
```

- **Screens:** staff uses `/donations/:id` and `/donatedItem/status/:id`; reviewers use `/admin/image-approval`; donors use `/my-donations`.
- **Technical debt:** item mutation and history insertion are separate writes. Denial removes history without restoring item status or attributes. Pending-history filtering currently occurs in the donor component.
- `donorInformed` records a notification request, not successful delivery. SMTP errors are caught and logged by the email service.
- This view covers status updates. Intake separately attempts a receipt email immediately; business status labels are not an enforced sequential state machine.

**Sources:** [submission and review routes](../../server/src/routes/donatedItemStatusRoutes.ts#L92), [donor API](../../server/src/routes/donorRoutes.ts#L359), [donor history component](../../client-app/src/Components/DonorDonations.tsx#L170), [email handling](../../server/src/services/emailService.ts#L245).

[Checkpoint index](README.md) · [One-page context](context.md) · [Source map and text equivalent](source-map.md#03--current-status-submission-and-review)
