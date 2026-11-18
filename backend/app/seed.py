"""
Seed the database with the same demo data the frontend uses in localStorage mode.

Run once after creating the DB:
    python -m app.seed
"""
from datetime import datetime, timezone

from app.core.security import get_password_hash
from app.database import Base, SessionLocal, engine
from app.models import Finding, Project, ProjectStatus, User, UserRole, FindingSeverity


DEMO_PASSWORD = "Admin@123"

DEMO_USERS = [
    {
        "id": "usr-admin",
        "name": "Ananya Sharma",
        "email": "admin@janaudit.in",
        "role": UserRole.Administrator,
        "title": "District Programme Administrator",
        "department": "Rural Development Department",
    },
    {
        "id": "usr-auditor",
        "name": "Ravi Kumar",
        "email": "auditor@janaudit.in",
        "role": UserRole.Auditor,
        "title": "Social Audit Officer",
        "department": "Social Audit Unit",
    },
    {
        "id": "usr-official",
        "name": "Meera Devi",
        "email": "official@janaudit.in",
        "role": UserRole.Official,
        "title": "Block Development Officer",
        "department": "Block Administration",
    },
]

SAMPLE_PROJECTS = [
    {
        "id": "JA-2025-001",
        "name": "Construction of village internal roads",
        "description": "Upgrading 2.4 km of internal roads with durable all-weather paving and improved access to essential services.",
        "village": "Rampur", "block": "Sadar", "district": "Prayagraj",
        "budget": 4850000, "start_date": "2025-02-10", "expected_date": "2025-11-30",
        "status": ProjectStatus.InProgress,
        "created_at": datetime(2025, 2, 5, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 10, 28, 10, 20, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-002",
        "name": "Installation of solar street lights",
        "description": "Installation of 48 solar-powered street lights at village roads, public spaces and key junctions.",
        "village": "Shivpur", "block": "Koraon", "district": "Prayagraj",
        "budget": 1280000, "start_date": "2025-01-15", "expected_date": "2025-08-31",
        "status": ProjectStatus.Completed,
        "created_at": datetime(2025, 1, 10, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 9, 4, 11, 0, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-003",
        "name": "Drinking water pipeline project",
        "description": "Household water connections and a 3.2 km distribution pipeline to improve access to safe drinking water.",
        "village": "Anandpur", "block": "Phulpur", "district": "Prayagraj",
        "budget": 6720000, "start_date": "2025-04-01", "expected_date": "2026-03-31",
        "status": ProjectStatus.InProgress,
        "created_at": datetime(2025, 3, 25, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 10, 22, 13, 15, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-004",
        "name": "Renovation of primary health centre",
        "description": "Repair of the outpatient wing, accessible washrooms, roofing and electrical systems at the local PHC.",
        "village": "Lakshmipur", "block": "Handia", "district": "Prayagraj",
        "budget": 3540000, "start_date": "2025-06-01", "expected_date": "2026-01-31",
        "status": ProjectStatus.Pending,
        "created_at": datetime(2025, 5, 22, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 10, 17, 8, 30, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-005",
        "name": "Construction of community sanitation facilities",
        "description": "Construction of a community sanitation complex with separate facilities, water supply and accessible design.",
        "village": "Devgaon", "block": "Soraon", "district": "Prayagraj",
        "budget": 2190000, "start_date": "2024-11-15", "expected_date": "2025-07-31",
        "status": ProjectStatus.Completed,
        "created_at": datetime(2024, 11, 4, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 8, 12, 10, 0, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-006",
        "name": "Village drainage improvement",
        "description": "Rehabilitation of 1.8 km of stormwater drains and construction of covered sections near the school.",
        "village": "Rajpur", "block": "Bahadurpur", "district": "Prayagraj",
        "budget": 2960000, "start_date": "2025-03-01", "expected_date": "2025-12-15",
        "status": ProjectStatus.InProgress,
        "created_at": datetime(2025, 2, 20, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 10, 30, 9, 45, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-007",
        "name": "Rainwater harvesting pond and groundwater recharge unit",
        "description": "Excavation and revetment lining of a 0.8-hectare percolation pond with silt traps to recharge local aquifers and prevent seasonal waterlogging.",
        "village": "Shivpur", "block": "Koraon", "district": "Prayagraj",
        "budget": 1840000, "start_date": "2025-05-10", "expected_date": "2025-12-20",
        "status": ProjectStatus.Completed,
        "created_at": datetime(2025, 5, 2, 8, 30, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 12, 18, 14, 10, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-008",
        "name": "Upgradation of Anganwadi centre with child-friendly amenities",
        "description": "Construction of a dedicated nutrition kitchen shed, child-friendly learning walls, clean drinking water filtration, and solar rooftop electrification.",
        "village": "Rampur", "block": "Sadar", "district": "Prayagraj",
        "budget": 1420000, "start_date": "2025-07-01", "expected_date": "2026-02-28",
        "status": ProjectStatus.InProgress,
        "created_at": datetime(2025, 6, 25, 9, 15, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 11, 4, 11, 20, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-009",
        "name": "Multi-purpose community flood & cyclone shelter",
        "description": "Reinforced two-storey public shelter equipped with raised plinth, solar micro-grid backup, rainwater cisterns, and separate sanitation blocks for disaster resilience.",
        "village": "Rajpur", "block": "Bahadurpur", "district": "Prayagraj",
        "budget": 8250000, "start_date": "2025-08-15", "expected_date": "2026-06-30",
        "status": ProjectStatus.Pending,
        "created_at": datetime(2025, 8, 1, 10, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 8, 15, 9, 0, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-010",
        "name": "Panchayat digital service kiosk and library",
        "description": "Setting up a high-speed fiber-connected citizen service centre with 8 public computer terminals, biometric authentication desks, and a community reading hall.",
        "village": "Anandpur", "block": "Phulpur", "district": "Prayagraj",
        "budget": 2480000, "start_date": "2025-06-12", "expected_date": "2026-01-15",
        "status": ProjectStatus.InProgress,
        "created_at": datetime(2025, 6, 5, 11, 30, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 11, 8, 15, 40, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-011",
        "name": "Solid waste segregation shed and vermicomposting pits",
        "description": "Establishment of a village-level resource recovery centre with dry/wet waste segregation bays and 6 active vermicomposting beds for organic waste processing.",
        "village": "Lakshmipur", "block": "Handia", "district": "Prayagraj",
        "budget": 1690000, "start_date": "2025-04-18", "expected_date": "2025-10-31",
        "status": ProjectStatus.Completed,
        "created_at": datetime(2025, 4, 10, 9, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 11, 12, 10, 20, tzinfo=timezone.utc),
    },
    {
        "id": "JA-2025-012",
        "name": "Veterinary dispensary and livestock care facility",
        "description": "Civil construction of a dedicated animal treatment bay, solar cold-chain storage for veterinary vaccines, and diagnostic facility for rural cattle breeders.",
        "village": "Devgaon", "block": "Soraon", "district": "Prayagraj",
        "budget": 3160000, "start_date": "2025-09-01", "expected_date": "2026-05-15",
        "status": ProjectStatus.Pending,
        "created_at": datetime(2025, 8, 20, 8, 0, tzinfo=timezone.utc),
        "updated_at": datetime(2025, 9, 1, 9, 0, tzinfo=timezone.utc),
    },
]

SAMPLE_FINDINGS = [
    {
        "id": "AF-2025-001", "project_id": "JA-2025-001",
        "description": "Two stretches show uneven compaction compared with the approved specification. Recheck before final measurement.",
        "auditor": "Ravi Kumar", "auditor_id": "usr-auditor",
        "date": "2025-10-28", "severity": FindingSeverity.Medium,
        "created_at": datetime(2025, 10, 28, 10, 30, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-002", "project_id": "JA-2025-003",
        "description": "Three sampled household connections were not reflected in the site measurement register.",
        "auditor": "Ravi Kumar", "auditor_id": "usr-auditor",
        "date": "2025-10-25", "severity": FindingSeverity.High,
        "created_at": datetime(2025, 10, 25, 12, 15, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-003", "project_id": "JA-2025-002",
        "description": "One installed light is intermittently offline. Verify battery performance during the warranty inspection.",
        "auditor": "Ananya Sharma", "auditor_id": "usr-admin",
        "date": "2025-10-19", "severity": FindingSeverity.Low,
        "created_at": datetime(2025, 10, 19, 9, 45, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-004", "project_id": "JA-2025-006",
        "description": "Provide updated site photographs and confirm the drain cover quantities against the bill of quantities.",
        "auditor": "Ravi Kumar", "auditor_id": "usr-auditor",
        "date": "2025-10-15", "severity": FindingSeverity.Medium,
        "created_at": datetime(2025, 10, 15, 11, 25, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-005", "project_id": "JA-2025-008",
        "description": "Water filtration unit delivered to site does not match the BIS-certified model specified in the technical tender. Installation halted pending verification.",
        "auditor": "Ananya Sharma", "auditor_id": "usr-admin",
        "date": "2025-11-04", "severity": FindingSeverity.High,
        "created_at": datetime(2025, 11, 4, 10, 0, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-006", "project_id": "JA-2025-010",
        "description": "Earthing pit resistance measured higher than permissible limit for electronic equipment. Re-grounding required before connecting UPS backup.",
        "auditor": "Ravi Kumar", "auditor_id": "usr-auditor",
        "date": "2025-11-08", "severity": FindingSeverity.Medium,
        "created_at": datetime(2025, 11, 8, 11, 30, tzinfo=timezone.utc),
    },
    {
        "id": "AF-2025-007", "project_id": "JA-2025-011",
        "description": "Shed roof overhang requires additional wind bracing along the south-western face to conform with seasonal wind load guidelines.",
        "auditor": "Ravi Kumar", "auditor_id": "usr-auditor",
        "date": "2025-11-12", "severity": FindingSeverity.Low,
        "created_at": datetime(2025, 11, 12, 9, 15, tzinfo=timezone.utc),
    },
]


def seed():
    print("Creating tables …")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Skip if already seeded
        if db.query(User).count() > 0:
            print("Database already seeded — nothing to do.")
            return

        print("Seeding users …")
        hashed = get_password_hash(DEMO_PASSWORD)
        for u in DEMO_USERS:
            db.add(User(**u, hashed_password=hashed, is_active=True,
                        created_at=datetime.now(timezone.utc)))

        print("Seeding projects …")
        for p in SAMPLE_PROJECTS:
            db.add(Project(**p, sample=True))

        print("Seeding findings …")
        for f in SAMPLE_FINDINGS:
            db.add(Finding(**f, sample=True))

        db.commit()
        print("✓ Seed complete.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
