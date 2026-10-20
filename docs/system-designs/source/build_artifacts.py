#!/usr/bin/env python3
"""Build the checkpoint's editable SVGs and vector PDFs (Python 3 + pycairo).

Run from any directory: python3 docs/system-designs/source/build_artifacts.py
The diagrams are curated from the source map, not inferred automatically.
"""

from pathlib import Path
import argparse
import html
import math
import cairo

ROOT = Path(__file__).resolve().parents[1]
REVISION = "3c75abdc"
DATE = "October 19, 2026"
INK = "#172E3D"
MUTED = "#4C626D"
LINE = "#A2B3BA"
PAPER = "#FFFFFF"
BG = "#F5F8F9"
TEAL = "#12635D"
TEAL_BG = "#EAF5F1"
BLUE = "#245D89"
BLUE_BG = "#ECF3FA"
AMBER = "#845016"
AMBER_BG = "#FFF3DD"
RED = "#923D3D"
RED_BG = "#FCEEEE"
FONT = "DejaVu Sans"


def rgb(color):
    return tuple(int(color[i:i + 2], 16) / 255 for i in (1, 3, 5))


class Canvas:
    """One drawing API emits selectable PDF text and editable native SVG text."""

    def __init__(self, width, height, title, description):
        self.width, self.height = width, height
        self.surface = cairo.RecordingSurface(cairo.CONTENT_COLOR_ALPHA, (0, 0, width, height))
        self.ctx = cairo.Context(self.surface)
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
                    f'viewBox="0 0 {width} {height}" role="img" aria-labelledby="title description">',
                    f'<title id="title">{html.escape(title)}</title>',
                    f'<desc id="description">{html.escape(description)}</desc>']
        self.rect(0, 0, width, height, PAPER, None)

    def color(self, value):
        self.ctx.set_source_rgb(*rgb(value))

    def font(self, size=18, bold=False):
        self.ctx.select_font_face(FONT, cairo.FONT_SLANT_NORMAL,
                                  cairo.FONT_WEIGHT_BOLD if bold else cairo.FONT_WEIGHT_NORMAL)
        self.ctx.set_font_size(size)

    def measure(self, value, size=18, bold=False):
        self.font(size, bold)
        return self.ctx.text_extents(value).x_advance

    def rect(self, x, y, w, h, fill=PAPER, stroke=LINE, radius=0, dash=False):
        c = self.ctx
        c.new_path()
        if radius:
            r = radius
            c.arc(x + w - r, y + r, r, -math.pi / 2, 0)
            c.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
            c.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
            c.arc(x + r, y + r, r, math.pi, 3 * math.pi / 2)
            c.close_path()
        else:
            c.rectangle(x, y, w, h)
        if fill:
            self.color(fill)
            c.fill_preserve()
        if stroke:
            self.color(stroke)
            c.set_line_width(1.4)
            c.set_dash([7, 5] if dash else [])
            c.stroke()
            c.set_dash([])
        else:
            c.new_path()
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" '
                        f'fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="1.4"'
                        + (' stroke-dasharray="7 5"' if dash else '') + '/>')

    def text(self, x, y, value, size=18, color=INK, bold=False, anchor="start", max_width=None):
        value = str(value)
        w = self.measure(value, size, bold)
        if max_width is not None and w > max_width:
            raise ValueError(f'Text exceeds {max_width}px ({w:.1f}): {value}')
        left = x - (w / 2 if anchor == "middle" else w if anchor == "end" else 0)
        if left < -0.1 or left + w > self.width + 0.1 or y > self.height or y - size < -1:
            raise ValueError(f'Text outside page: {value}')
        self.color(color)
        self.ctx.move_to(left, y)
        self.ctx.show_text(value)
        self.svg.append(f'<text x="{x}" y="{y}" font-family="{FONT}, sans-serif" '
                        f'font-size="{size}" font-weight="{700 if bold else 400}" '
                        f'fill="{color}" text-anchor="{anchor}">{html.escape(value)}</text>')

    def lines(self, x, y, values, size=18, leading=26, **kwargs):
        for i, value in enumerate(values):
            self.text(x, y + i * leading, value, size=size, **kwargs)

    def paragraph(self, x, y, value, width, size=11, leading=16, color=INK):
        words, line, lines = value.split(), "", []
        for word in words:
            candidate = f"{line} {word}".strip()
            if self.measure(candidate, size) > width and line:
                lines.append(line)
                line = word
            else:
                line = candidate
        if line:
            lines.append(line)
        self.lines(x, y, lines, size=size, leading=leading, color=color, max_width=width)
        return y + len(lines) * leading

    def path(self, points, color=MUTED, arrow=False, dash=False, width=1.8):
        c = self.ctx
        c.new_path()
        c.move_to(*points[0])
        for point in points[1:]:
            c.line_to(*point)
        self.color(color)
        c.set_line_width(width)
        c.set_dash([7, 5] if dash else [])
        c.stroke()
        c.set_dash([])
        coords = " ".join(f"{x},{y}" for x, y in points)
        self.svg.append(f'<polyline points="{coords}" fill="none" stroke="{color}" '
                        f'stroke-width="{width}"' + (' stroke-dasharray="7 5"' if dash else '') + '/>')
        if arrow:
            x, y = points[-1]
            px, py = points[-2]
            angle = math.atan2(y - py, x - px)
            tip = [(x, y), (x - 10 * math.cos(angle - .42), y - 10 * math.sin(angle - .42)),
                   (x - 10 * math.cos(angle + .42), y - 10 * math.sin(angle + .42))]
            self.polygon(tip, color, None)

    def polygon(self, points, fill=PAPER, stroke=LINE):
        c = self.ctx
        c.move_to(*points[0])
        for p in points[1:]:
            c.line_to(*p)
        c.close_path()
        if fill:
            self.color(fill)
            c.fill_preserve()
        if stroke:
            self.color(stroke)
            c.set_line_width(1.5)
            c.stroke()
        else:
            c.new_path()
        self.svg.append('<polygon points="' + " ".join(f'{x},{y}' for x, y in points)
                        + f'" fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="1.5"/>')

    def box(self, x, y, w, h, title, lines=(), fill=PAPER, stroke=LINE,
            title_size=20, size=17, dash=False):
        self.rect(x, y, w, h, fill, stroke, 10, dash)
        self.text(x + 18, y + 32, title, title_size, bold=True, max_width=w - 36)
        self.lines(x + 18, y + 59, lines, size=size, leading=24, color=MUTED, max_width=w - 36)

    def cylinder(self, x, y, w, h, title, lines=()):
        # Standard datastore symbol: cylindrical top and bottom.
        self.rect(x, y + 12, w, h - 24, TEAL_BG, TEAL)
        for cy in (y + h - 12, y + 12):
            self.ctx.save()
            self.ctx.translate(x + w / 2, cy)
            self.ctx.scale(w / 2, 12)
            self.ctx.arc(0, 0, 1, 0, math.tau)
            self.color(TEAL_BG)
            self.ctx.fill_preserve()
            self.color(TEAL)
            self.ctx.set_line_width(.025)
            self.ctx.stroke()
            self.ctx.restore()
            self.svg.append(f'<ellipse cx="{x + w / 2}" cy="{cy}" rx="{w / 2}" ry="12" '
                            f'fill="{TEAL_BG}" stroke="{TEAL}" stroke-width="1.4"/>')
        self.text(x + 18, y + 47, title, 20, bold=True, max_width=w - 36)
        self.lines(x + 18, y + 74, lines, size=17, leading=24, color=MUTED, max_width=w - 36)

    def header(self, number, title, subtitle, proposed=False):
        self.text(48, 42, "BWORKS  /  MATERIAL DERAILLEUR", 14, TEAL, True)
        self.text(1152, 42, "PROPOSED • NOT IMPLEMENTED" if proposed else "CURRENT • SOURCE VERIFIED",
                  13, AMBER if proposed else TEAL, True, anchor="end")
        self.text(48, 88, f"{number}  {title}", 31, bold=True)
        self.text(48, 118, subtitle, 17, MUTED, max_width=1104)

    def footer(self, source, page):
        self.path([(48, 754), (1152, 754)], LINE, width=1)
        self.text(48, 776, source, 12, MUTED, max_width=1000)
        self.text(1152, 776, f"{page} / 5", 12, MUTED, anchor="end")

    def save_svg(self, name):
        (ROOT / "diagrams" / name).write_text("\n".join(self.svg) + "\n</svg>\n")

    def render_pdf(self, surface):
        # Letter portrait for the context; letter landscape for diagrams.
        landscape = self.width > self.height
        surface.set_size(792 if landscape else 612, 612 if landscape else 792)
        c = cairo.Context(surface)
        if landscape:
            c.translate(0, 42)
            c.scale(.66, .66)
        c.set_source_surface(self.surface)
        c.paint()
        c.show_page()


CONTEXT = [
    ("Purpose and scope", "Material Derailleur helps BWorks manage donated items and show donors their donation journey. This checkpoint documents the existing React, Express and PostgreSQL application at revision 3c75abdc, inspected October 19, 2026. It describes repository behavior and the checked-in local deployment configuration; no running production environment was verified."),
    ("Artifacts and rationale", "Four visual artifacts accompany this one-page context: (1) a component and deployment diagram locates the browser, API modules, persistence and external services; (2) a six-entity data model shows ownership, optional program assignment and status history; (3) a swimlane flow exposes the current submission, review and donor experience; and (4) a proposed workflow makes the most useful refactoring decisions concrete. These views support onboarding and maintenance of an existing product."),
    ("Decisions and trade-offs", "One Express backend keeps operations simple, but route handlers also contain database and integration logic. User accounts and Donor profiles are separate, matched by email rather than a foreign key. Structured ItemAttribute rows support varied donation types, while AI tags remain JSON metadata. Images live outside PostgreSQL. AI analysis and email currently run in request handlers, coupling response time to external services."),
    ("Current versus intended state", "Today, submitting a status updates the item immediately and inserts pending history in a separate write. Approval controls donor timeline visibility in the UI and optional email; rejection deletes the history without restoring item state. The donor API still returns pending history. The proposed design stages updates, commits approved changes and an outbox event in one transaction, retains rejected records, filters donor responses on the server and records retryable notification delivery. Consistent authorization is a second proposed boundary improvement. These are recommendations, not implemented features or an agreed sprint commitment."),
    ("How this guides development", "Use the architecture and schema views when changing integrations or migrations. Use the current workflow to reproduce inconsistent item/history behavior. Review the proposed approval semantics with BWorks before implementation, then migrate the review model and add transaction, rejection, donor-visibility and duplicate-notification checks. Revisit local media serving and development-only deployment settings before production use. Keep the Markdown diagrams, optional exports and source map aligned with code changes."),
]


def context_page(standalone=False):
    c = Canvas(612, 792, "System designs — checkpoint context", "One-page context for four visual system design artifacts.")
    c.text(44, 38, "BWORKS  /  MATERIAL DERAILLEUR", 10, TEAL, True)
    c.text(44, 79, "System designs", 29, bold=True)
    c.text(44, 103, "Visual System Design Artifacts — checkpoint context", 11, MUTED)
    c.text(44, 124, f"{DATE}   |   Repository snapshot: {REVISION}", 10, MUTED)
    c.path([(44, 141), (568, 141)], LINE, width=1)
    y = 167
    for heading, paragraph in CONTEXT:
        c.text(44, y, heading, 12, TEAL, True)
        y = c.paragraph(44, y + 19, paragraph, 524, size=10.5, leading=14) + 12
    if y > 730:
        raise ValueError(f"Context exceeds one page: {y}")
    c.path([(44, 747), (568, 747)], LINE, width=1)
    c.text(44, 767, "Originals: diagrams/*.svg  |  Evidence: source-map.md  |  No online design tool used", 8, MUTED)
    c.text(568, 767, "1 / 1" if standalone else "1 / 5", 8, MUTED, anchor="end")
    return c


def architecture():
    c = Canvas(1200, 800, "Current system architecture and local deployment",
               "React browser calls one Express API. Route modules use services and Prisma/PostgreSQL. "
               "External integrations are Azure or local media, Gemini and SMTP. Compose runs three containers.")
    c.header("01", "System architecture & local deployment", "One application backend; three Compose services; external media, AI and email integrations.")
    c.rect(354, 151, 798, 473, BG, LINE, 12)
    c.text(375, 178, "LOCAL DOCKER COMPOSE", 14, TEAL, True)
    c.box(48, 215, 255, 142, "Web browser", ["Donors • tiered staff", "Administrators", "React executes here"], BLUE_BG, BLUE)
    c.box(377, 207, 295, 111, "React frontend", ["client-app  |  serves the UI", "host 3000 → container 3000"], BLUE_BG, BLUE)
    c.path([(377, 260), (303, 260)], BLUE, True)
    c.text(332, 243, "UI", 14, BLUE, anchor="middle")
    c.box(377, 370, 431, 228, "Express / TypeScript API", [], PAPER, BLUE)
    c.text(395, 430, "host 5050 → container 5000", 17, MUTED)
    c.lines(395, 460, ["Routes: donors • auth • programs • items", "status review • CSV • barcode • reset", "JWT / rank / ACTIVE checks on guarded routes", "Services: media • image analysis • email", "Prisma + PostgreSQL driver adapter"], size=17, leading=27, color=MUTED, max_width=395)
    c.path([(175, 357), (175, 482), (377, 482)], BLUE, True)
    c.lines(190, 435, ["JSON / multipart", "JWT for guarded calls"], size=15, color=BLUE, leading=22)
    c.cylinder(852, 381, 277, 141, "PostgreSQL", ["host 5432 → 5432", "postgres_data volume"])
    c.path([(808, 454), (852, 454)], TEAL, True)
    c.text(830, 441, "SQL", 13, TEAL, anchor="middle")
    c.lines(852, 556, ["Backend starts after", "database health check"], size=16, color=MUTED, leading=23)
    c.box(48, 536, 255, 88, "Authorization debt", ["Some mutations lack guards"], AMBER_BG, AMBER, size=15, title_size=18)
    c.box(48, 657, 310, 76, "Media adapter", ["Azure Blob / local uploads"], TEAL_BG, TEAL, title_size=19, size=16)
    c.box(445, 657, 310, 76, "Google Gemini", ["Optional image → JSON tags"], TEAL_BG, TEAL, title_size=19, size=16)
    c.box(842, 657, 310, 76, "SMTP / Nodemailer", ["Receipts • updates • accounts"], TEAL_BG, TEAL, title_size=19, size=16)
    c.path([(414, 598), (414, 639), (204, 639), (204, 657)], TEAL, True)
    c.path([(600, 598), (600, 657)], TEAL, True)
    c.path([(766, 598), (766, 639), (996, 639), (996, 657)], TEAL, True)
    c.text(703, 641, "Request-time calls", 13, MUTED, anchor="middle")
    c.footer(f"Source: index.ts; prismaClient.ts; service modules; docker-compose.yml. Snapshot {REVISION}. Not a verified production topology.", 2)
    return c


def entity(c, x, y, w, title, rows, fill=TEAL_BG):
    h = 47 + 25 * len(rows)
    c.rect(x, y, w, h, PAPER, LINE, 6)
    c.rect(x, y, w, 43, fill, LINE, 6)
    c.text(x + 14, y + 28, title, 19, bold=True, max_width=w - 28)
    for i, row in enumerate(rows):
        c.text(x + 14, y + 68 + 25 * i, row, 16, max_width=w - 28)
    return h


def data_model():
    c = Canvas(1200, 800, "Current six-entity data model",
               "Each donated item belongs to exactly one donor and zero or one program. An item has zero or more "
               "status records and attributes, both cascade-deleted with the item. User has no foreign key to Donor; code matches emails.")
    c.header("02", "Data model & ownership", "Entity relationships from the Prisma schema; representative fields keep the view readable.")
    entity(c, 48, 176, 285, "Donor", ["PK  id: Int", "UQ  email: String", "firstName / lastName", "emailOptIn: Boolean", "address / contact / zipcode"])
    entity(c, 862, 176, 290, "Program", ["PK  id: Int", "name: String", "description / aimAndCause", "startDate: Date"])
    entity(c, 441, 176, 320, "DonatedItem", ["PK  id: Int", "FK  donorId: Int", "FK  programId: Int?", "itemType / category / quantity", "currentStatus: String", "dateDonated / lastUpdated", "imagePath: String?", "analysisMetadata: Json?"])
    entity(c, 48, 453, 285, "User", ["PK  id: UUID string", "UQ  email: String", "password / role? / status", "createdAt / firstLogin", "resetToken? / expiry?"], BLUE_BG)
    entity(c, 441, 527, 320, "DonatedItemStatus", ["PK  id; FK  donatedItemId", "statusType / dateModified", "imageUrls: String[]", "approval / donorInformed", "submitter: String"])
    entity(c, 862, 495, 290, "ItemAttribute", ["PK  id; FK  donatedItemId", "descriptor: String", "stringValue: String?", "numberValue: Float?", "booleanValue: Boolean?"])
    # Multiplicities are UML association notation: no arrows imply an FK direction.
    c.path([(333, 282), (441, 282)], TEAL)
    c.text(345, 270, "1", 16, TEAL)
    c.text(395, 270, "0..*", 16, TEAL)
    c.path([(761, 282), (862, 282)], TEAL)
    c.text(769, 270, "0..*", 16, TEAL)
    c.text(819, 270, "0..1", 16, TEAL)
    c.path([(600, 423), (600, 527)], TEAL)
    c.text(613, 447, "1", 16, TEAL)
    c.text(613, 515, "0..*", 16, TEAL)
    c.text(582, 479, "history", 15, MUTED, anchor="end")
    c.path([(761, 390), (1007, 390), (1007, 495)], TEAL)
    c.text(776, 380, "1", 16, TEAL)
    c.text(1020, 482, "0..*", 16, TEAL)
    c.text(917, 418, "attributes", 15, MUTED)
    c.lines(48, 680, ["User ↔ Donor: email lookup only", "No database relationship"], size=15, color=BLUE, leading=23, max_width=285)
    c.lines(862, 705, ["Status + attribute deletion", "cascades from the item"], size=15, color=MUTED, leading=22)
    c.text(48, 735, "PK primary key  •  FK foreign key  •  UQ unique  •  ? nullable", 14, MUTED)
    c.footer(f"Source: server/prisma/schema.prisma; donorRoutes.ts /me. Numeric multiplicities: 1 required, 0..1 optional, 0..* many. {REVISION}.", 3)
    return c


def workflow():
    c = Canvas(1200, 800, "Current status submission, review and donor visibility",
               "Tier Three or above submits status. API immediately changes item and creates pending history separately. "
               "Tier One or Admin approves or deletes history. Approval can send email. Donor UI filters history, but API returns pending rows.")
    c.header("03", "Status submission → review → donor", "Approval moderates history and update email; it does not gate the current inventory status.")
    # Four responsibility lanes make temporal order and ownership explicit.
    lanes = [(48, 245, "STAFF  /  TIER THREE+"), (312, 285, "API + DATABASE"),
             (616, 240, "REVIEW  /  TIER ONE+"), (875, 277, "DONOR EXPERIENCE")]
    for x, w, name in lanes:
        c.rect(x, 153, w, 496, BG, None, 10)
        c.text(x + 14, 180, name, 13, TEAL, True, max_width=w - 28)
    c.text(631, 204, "/admin/image-approval", 14, MUTED, max_width=210)
    c.box(63, 212, 215, 113, "Open item", ["/donations/:id", "Add a status update"], title_size=19, size=16)
    c.box(63, 377, 215, 153, "Submit update", ["Status / date / photos", "Optional attributes", "Request donor email", "/donatedItem/status/:id"], title_size=19, size=14)
    c.path([(170, 325), (170, 377)], BLUE, True)
    c.box(327, 212, 255, 137, "Change item now", ["currentStatus updated", "Attributes replaced if sent", "No approval prerequisite"], AMBER_BG, AMBER, title_size=19, size=16)
    c.path([(278, 443), (299, 443), (299, 279), (327, 279)], BLUE, True)
    c.box(327, 409, 255, 139, "Write history", ["approval = false", "donorInformed = request", "Separate database write"], AMBER_BG, AMBER, title_size=19, size=16)
    c.path([(455, 349), (455, 409)], AMBER, True)
    c.text(470, 383, "then", 14, MUTED)
    c.polygon([(735, 226), (825, 286), (735, 346), (645, 286)], PAPER, BLUE)
    c.lines(735, 281, ["Approve", "status?"], size=18, leading=24, anchor="middle", bold=True)
    c.path([(582, 477), (602, 477), (602, 286), (645, 286)], BLUE, True)
    c.box(631, 409, 210, 113, "Approve", ["approval = true", "Email if requested"], TEAL_BG, TEAL, title_size=19, size=16)
    c.path([(735, 346), (735, 409)], TEAL, True)
    c.text(748, 384, "Yes", 14, TEAL)
    c.box(631, 562, 210, 69, "Deny", ["Delete history only"], RED_BG, RED, title_size=19, size=16)
    c.path([(825, 286), (852, 286), (852, 595), (841, 595)], RED, True)
    c.text(830, 367, "No", 14, RED)
    c.box(890, 409, 247, 139, "My donations", ["/my-donations", "UI shows approved history", "and approved photos"], BLUE_BG, BLUE, title_size=19, size=16)
    c.path([(841, 463), (890, 463)], TEAL, True)
    c.box(890, 212, 247, 113, "API response", ["/donor/me returns", "pending history too"], AMBER_BG, AMBER, title_size=19, size=16)
    c.path([(1014, 325), (1014, 409)], AMBER, True)
    c.box(48, 662, 1104, 72, "Current-state consequences", ["Denying leaves item state changed. Email intent is not delivery proof. Business status values are not a sequential state machine."], AMBER_BG, AMBER, title_size=18, size=15)
    c.footer(f"Source: donatedItemStatusRoutes.ts; donorRoutes.ts /me; DonorDonations.tsx; App.js. Tier One+ includes Admin. Snapshot {REVISION}.", 4)
    return c


def proposed():
    c = Canvas(1200, 800, "Proposed transactional review and notification design",
               "Proposed only: consistent authorization guards; store pending proposals without changing published item state. "
               "Approval atomically applies changes, marks approved and creates an outbox event. A worker retries notification and records delivery. "
               "Rejects remain auditable. Donor API filters approved history and enforces ownership.")
    c.header("04", "Proposed approval & delivery boundaries", "Recommendation for BWorks review; new review records, transaction and outbox are not implemented.", True)
    c.box(48, 155, 1104, 80, "Consistent API authorization", ["Verify access-token purpose + known claims • load existing ACTIVE user + current role • enforce donor ownership"], BLUE_BG, BLUE, title_size=20, size=17, dash=True)
    c.box(48, 284, 276, 113, "Stage proposal", ["Pending status + attributes", "Published item unchanged"], AMBER_BG, AMBER, title_size=20, size=17, dash=True)
    c.polygon([(445, 278), (531, 340), (445, 402), (359, 340)], AMBER_BG, AMBER)
    c.lines(445, 334, ["Approve", "pending?"], size=18, leading=24, anchor="middle", bold=True)
    c.path([(324, 340), (359, 340)], AMBER, True, dash=True)
    c.box(572, 271, 327, 139, "One database transaction", ["Apply status + attributes", "Mark review APPROVED", "Insert unique outbox event"], TEAL_BG, TEAL, title_size=19, size=17, dash=True)
    c.path([(531, 340), (572, 340)], TEAL, True, dash=True)
    c.text(539, 326, "Yes", 13, TEAL)
    c.box(48, 474, 276, 113, "Retain rejection", ["Mark review REJECTED", "Item remains unchanged"], RED_BG, RED, title_size=20, size=17, dash=True)
    c.path([(445, 402), (445, 531), (324, 531)], RED, True, dash=True)
    c.text(456, 448, "No", 14, RED)
    c.box(572, 474, 327, 113, "Donor read boundary", ["Only owned donations", "Only APPROVED history"], BLUE_BG, BLUE, title_size=20, size=17, dash=True)
    c.path([(735, 410), (735, 474)], BLUE, True, dash=True)
    c.box(953, 271, 199, 139, "Email worker", ["Read outbox", "Retry with backoff", "Record delivery"], TEAL_BG, TEAL, title_size=20, size=16, dash=True)
    c.path([(899, 340), (953, 340)], TEAL, True, dash=True)
    c.box(953, 474, 199, 113, "SMTP", ["Respect donor", "notification policy"], TEAL_BG, TEAL, title_size=20, size=16, dash=True)
    c.path([(1052, 410), (1052, 474)], TEAL, True, dash=True)
    c.rect(48, 633, 1104, 100, AMBER_BG, AMBER, 10)
    c.text(66, 662, "Decisions before implementation", 19, AMBER, True)
    c.lines(66, 689, ["Confirm approval/publication semantics and email opt-in with BWorks; migrate existing pending history carefully.", "Use a conditional PENDING → APPROVED transition and unique event key to prevent repeat approvals from resending."], size=16, leading=24, max_width=1068)
    c.footer("Proposed only. Trade-off: adds review/outbox data and worker operations in exchange for consistent item history and retryable email. Dashed = proposed.", 5)
    return c


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview-dir", type=Path, help="Optional PNGs for visual review")
    args = parser.parse_args()
    pages = [context_page(), architecture(), data_model(), workflow(), proposed()]
    names = ["01-system-architecture.svg", "02-data-model.svg", "03-current-status-workflow.svg", "04-proposed-design.svg"]
    for page, name in zip(pages[1:], names):
        page.save_svg(name)
    context_md = "# System designs — checkpoint context\n\n"
    context_md += f"**Material Derailleur / BWorks** · {DATE} · Snapshot `{REVISION}`\n\n"
    context_md += "\n\n".join(f"**{heading}.** {paragraph}" for heading, paragraph in CONTEXT) + "\n"
    (ROOT / "context.md").write_text(context_md)
    for filename, selected in [("system-designs.pdf", pages), ("context.pdf", [context_page(standalone=True)])]:
        surface = cairo.PDFSurface(str(ROOT / filename), 612, 792)
        surface.set_metadata(cairo.PDF_METADATA_TITLE, "Material Derailleur — System Designs Checkpoint")
        surface.set_metadata(cairo.PDF_METADATA_AUTHOR, "Material Derailleur project")
        surface.set_metadata(cairo.PDF_METADATA_SUBJECT, "Visual system design artifacts and one-page context")
        for page in selected:
            page.render_pdf(surface)
        surface.finish()
    if args.preview_dir:
        args.preview_dir.mkdir(parents=True, exist_ok=True)
        for i, page in enumerate(pages, 1):
            surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, page.width, page.height)
            ctx = cairo.Context(surface)
            ctx.set_source_surface(page.surface)
            ctx.paint()
            surface.write_to_png(str(args.preview_dir / f"page-{i}.png"))
    print("Created system-designs.pdf (5 pages), context.pdf (1 page), and four SVG originals.")


if __name__ == "__main__":
    main()
