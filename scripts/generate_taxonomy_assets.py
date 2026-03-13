from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "taxonomy_assets"


@dataclass(frozen=True)
class SectorConfig:
    name: str
    categories: list[tuple[str, list[str]]]
    industries: list[tuple[str, list[str]]]


SECTORS: list[SectorConfig] = [
    SectorConfig(
        "Technology",
        [
            ("Semiconductor", ["GPU", "CPU", "HBM", "Foundry"]),
            ("AI Platform", ["Generative AI", "AI Agent", "Model Serving", "Inference"]),
            ("Cloud", ["IaaS", "SaaS", "Data Center", "Cybersecurity"]),
        ],
        [
            ("Semiconductor", ["GPU", "CPU", "Memory", "Foundry", "EDA", "Equipment"]),
            ("Software", ["AI Platform", "SaaS", "Cybersecurity", "DevTools", "Enterprise Apps", "Data Infra"]),
        ],
    ),
    SectorConfig(
        "Consumer",
        [
            ("Food", ["Milk Tea", "Ramen", "Dessert", "Functional Food"]),
            ("Beauty", ["Skincare", "Makeup", "Fragrance", "Derma Cosmetics"]),
            ("Lifestyle", ["Pet Care", "Home Decor", "Kitchenware", "Outdoor"]),
        ],
        [
            ("Beverage", ["Milk Tea", "Soft Drink", "Coffee", "RTD Tea", "Energy Drink", "Premium Water"]),
            ("Branded Goods", ["Beauty", "Personal Care", "Home Goods", "Pet Products", "Sporting Goods", "Luxury Beauty"]),
        ],
    ),
    SectorConfig(
        "Retail",
        [
            ("Convenience", ["CU", "GS25", "7-Eleven", "Quick Commerce"]),
            ("E-Commerce", ["Marketplaces", "Live Commerce", "D2C", "Social Commerce"]),
            ("Department Store", ["Luxury Hall", "Duty Free", "Flagship Store", "Store Design"]),
        ],
        [
            ("Retail Operations", ["Convenience Store", "E-Commerce", "Department Store", "Duty Free", "Franchise Retail", "Store Technology"]),
            ("Consumer Logistics", ["Last Mile", "Fulfillment", "Cold Chain", "Warehouse Automation", "Cross Border Retail", "Retail Media"]),
        ],
    ),
    SectorConfig(
        "Finance",
        [
            ("Banking", ["Rate Cycle", "Household Loans", "SME Loans", "NIM"]),
            ("Capital Market", ["Brokerage", "Asset Management", "ETF", "Retirement"]),
            ("Insurance", ["Life Insurance", "P&C", "Health Insurance", "Reinsurance"]),
        ],
        [
            ("Banking", ["Commercial Banking", "Digital Banking", "Wealth Management", "Consumer Finance", "Credit Card", "Payment"]),
            ("Insurance", ["Life", "P&C", "Health", "Reinsurance", "Insurance Tech", "Annuity"]),
        ],
    ),
    SectorConfig(
        "Healthcare",
        [
            ("Pharma", ["Oncology", "Immunology", "Metabolic", "Rare Disease"]),
            ("Medical Service", ["Hospital", "Screening", "Digital Health", "Telemedicine"]),
            ("Nutrition", ["Medical Nutrition", "Supplements", "Diet Therapy", "Preventive Care"]),
        ],
        [
            ("Biopharma", ["Oncology Drug", "Biologics CDMO", "Biosimilar", "Cell Therapy", "Gene Therapy", "Drug Discovery"]),
            ("Healthcare Service", ["Hospital Operator", "Diagnostics", "Digital Health", "Medical Devices", "Nutrition Therapy", "Preventive Care"]),
        ],
    ),
    SectorConfig(
        "Education",
        [
            ("K-12", ["Suneung", "Mock Exam", "English", "Math"]),
            ("Private Education", ["Academy", "Online Lecture", "Study Cafe", "Curriculum"]),
            ("EdTech", ["AI Tutor", "LMS", "Digital Textbook", "Test Prep App"]),
        ],
        [
            ("Education Service", ["K-12 Prep", "Language Learning", "Professional Test Prep", "Curriculum Publisher", "After School", "EdTech Platform"]),
            ("Learning Infrastructure", ["LMS", "Digital Textbook", "Online Coaching", "Exam Analytics", "Education Content", "Learning Device"]),
        ],
    ),
    SectorConfig(
        "Energy",
        [
            ("Oil & Gas", ["Crude Oil", "LNG", "Refining", "Petrochemical"]),
            ("Power", ["Grid", "Utility", "IPP", "Smart Meter"]),
            ("Transition", ["Hydrogen", "CCUS", "SMR", "Renewable Mix"]),
        ],
        [
            ("Traditional Energy", ["Integrated Oil", "Refining", "LNG", "Utility", "Petrochemical", "Energy Trading"]),
            ("Energy Transition", ["Hydrogen", "SMR", "CCUS", "Renewable Utility", "Battery Storage", "Smart Grid"]),
        ],
    ),
    SectorConfig(
        "Mobility",
        [
            ("EV", ["Battery", "Charging", "EV Platform", "Autonomous Driving"]),
            ("Automotive", ["OEM", "Powertrain", "ADAS", "Infotainment"]),
            ("Transport Service", ["Ride Hailing", "Mobility Platform", "Fleet", "Logistics EV"]),
        ],
        [
            ("Auto Manufacturing", ["EV OEM", "ICE OEM", "Auto Parts", "ADAS", "Battery Pack", "Charging Infra"]),
            ("Mobility Service", ["Ride Hailing", "Fleet Management", "Mobility Software", "Logistics Vehicle", "Connected Car", "Telematics"]),
        ],
    ),
    SectorConfig(
        "AerospaceDefense",
        [
            ("Defense", ["Missile", "Radar", "Ammunition", "Naval System"]),
            ("Aerospace", ["Aircraft", "Satellite", "Launch", "Space Data"]),
            ("Security", ["Border Security", "Drone Defense", "Command System", "Military AI"]),
        ],
        [
            ("Defense Systems", ["Missile", "Radar", "Ammunition", "Naval Defense", "Aerospace Defense", "Military Electronics"]),
            ("Space Aerospace", ["Launch Vehicle", "Satellite", "Aircraft Manufacturing", "Space Services", "Drone", "Geospatial"]),
        ],
    ),
    SectorConfig(
        "Construction",
        [
            ("Architecture", ["Library", "Public Building", "Cultural Facility", "Urban Regeneration"]),
            ("Housing", ["Apartment", "Remodeling", "Interior", "Smart Home"]),
            ("Infrastructure", ["Rail", "Road", "Bridge", "Water"]),
        ],
        [
            ("Construction Services", ["General Contractor", "Civil Engineering", "Architecture Services", "Interior Material", "Urban Development", "REIT Construction"]),
            ("Building Materials", ["Cement", "Steel Structure", "Insulation", "Glass", "Smart Building", "Prefab"]),
        ],
    ),
    SectorConfig(
        "MediaEntertainment",
        [
            ("K-Pop", ["Agency", "Tour", "Fandom Platform", "IP Merchandise"]),
            ("Video", ["Streaming", "OTT", "Short Form", "Creator Economy"]),
            ("Gaming", ["PC Game", "Mobile Game", "Console", "Esports"]),
        ],
        [
            ("Entertainment", ["Music Label", "Live Events", "Streaming Media", "Video Platform", "Creator Platform", "IP Licensing"]),
            ("Gaming", ["Mobile Game", "PC Game", "Console Game", "Game Engine", "Esports", "Game Publishing"]),
        ],
    ),
    SectorConfig(
        "Telecom",
        [
            ("Network", ["5G", "6G", "Fiber", "Edge"]),
            ("Service", ["Subscriber Growth", "ARPU", "Bundling", "MVNO"]),
            ("Enterprise", ["B2B ICT", "Cloud Telco", "Security", "IoT"]),
        ],
        [
            ("Telecom Service", ["Mobile Carrier", "Fixed Network", "MVNO", "B2B ICT", "Network Equipment", "Telecom Cloud"]),
            ("Connectivity", ["Fiber Infra", "Data Backbone", "Edge Network", "Satellite Connectivity", "IoT Connectivity", "Private Network"]),
        ],
    ),
    SectorConfig(
        "LogisticsShipping",
        [
            ("Shipping", ["Container", "Bulk", "Port", "Freight Rate"]),
            ("Logistics", ["Last Mile", "Warehouse", "Air Cargo", "Cold Chain"]),
            ("Trade Route", ["Suez", "Red Sea", "Hormuz", "Geopolitical Route"]),
        ],
        [
            ("Shipping", ["Container Shipping", "Bulk Shipping", "Port Operator", "Freight Forwarding", "Logistics Platform", "Air Cargo"]),
            ("Supply Chain", ["Warehouse REIT", "Cold Chain", "Cross Border Logistics", "Logistics Software", "Maritime Services", "Customs Services"]),
        ],
    ),
    SectorConfig(
        "TravelLeisure",
        [
            ("Travel", ["Package Tour", "Inbound", "Outbound", "Travel Platform"]),
            ("Leisure", ["Theme Park", "Resort", "Hotel", "Cruise"]),
            ("Experience", ["Cultural Travel", "Food Travel", "Sports Travel", "Wellness Travel"]),
        ],
        [
            ("Travel Services", ["Travel Agency", "Online Travel", "Hotel Operator", "Airline Leisure", "Resort", "Theme Park"]),
            ("Leisure Infrastructure", ["Convention", "Cruise", "Destination Marketing", "Wellness Tourism", "Duty Free Travel", "Event Tourism"]),
        ],
    ),
    SectorConfig(
        "AgricultureFoodSupply",
        [
            ("Agriculture", ["Smart Farm", "Seed", "Fertilizer", "Agri Robotics"]),
            ("Food Supply", ["Cold Storage", "Food Distribution", "Meal Kit", "Food Safety"]),
            ("Alt Food", ["Plant-Based", "Cultivated Meat", "FoodTech", "Protein"]),
        ],
        [
            ("Agribusiness", ["Seed Tech", "Fertilizer", "Agri Equipment", "Food Distribution", "Cold Storage", "Food Processing"]),
            ("Food Innovation", ["Plant Based", "Alternative Protein", "Food Safety Tech", "Meal Kit", "Smart Farming", "Agri Data"]),
        ],
    ),
    SectorConfig(
        "ChemicalsMaterials",
        [
            ("Chemical", ["Basic Chemical", "Specialty", "Industrial Gas", "Fine Chemical"]),
            ("Advanced Material", ["Carbon Fiber", "Display Material", "Battery Material", "Bio Material"]),
            ("Circular", ["Recycling", "Waste Upcycling", "Bioplastic", "ESG Material"]),
        ],
        [
            ("Chemicals", ["Commodity Chemical", "Specialty Chemical", "Industrial Gas", "Fine Chemical", "Battery Material", "Eco Material"]),
            ("Advanced Materials", ["Carbon Material", "Display Material", "Composite", "Recycling Material", "Bioplastic", "Catalyst"]),
        ],
    ),
    SectorConfig(
        "RealEstate",
        [
            ("Commercial", ["Office", "Retail Mall", "Data Center RE", "Logistics Center"]),
            ("Residential", ["Apartment Lease", "Urban Housing", "Senior Housing", "Student Housing"]),
            ("Investment", ["REIT", "Property Fund", "Asset Management", "NPL"]),
        ],
        [
            ("Real Estate Services", ["REIT", "Property Developer", "Property Management", "Data Center REIT", "Logistics REIT", "Residential REIT"]),
            ("Real Estate Finance", ["Mortgage Finance", "RE Fund", "Asset Securitization", "Property Brokerage", "NPL Asset", "Urban Redevelopment"]),
        ],
    ),
    SectorConfig(
        "ClimateEnvironment",
        [
            ("Climate Tech", ["Carbon Accounting", "Carbon Credit", "Decarbonization", "Climate Risk"]),
            ("Environment", ["Waste Management", "Water Treatment", "Air Quality", "Soil"]),
            ("Green Infrastructure", ["Smart Grid", "Green Building", "Circular City", "Eco Mobility"]),
        ],
        [
            ("Environmental Services", ["Waste Treatment", "Water Utility", "Air Pollution Control", "Recycling", "Carbon Services", "Eco Engineering"]),
            ("Climate Software", ["Carbon Platform", "ESG Data", "Climate Analytics", "Sustainability Consulting", "Energy Optimization", "Grid Optimization"]),
        ],
    ),
    SectorConfig(
        "LuxuryFashion",
        [
            ("Luxury", ["Luxury Brand", "Flagship Store", "Visual Merchandising", "Store Experience"]),
            ("Fashion", ["Apparel", "Footwear", "Accessory", "DTC Fashion"]),
            ("Craft", ["Leather", "Jewelry", "Watch", "Perfume"]),
        ],
        [
            ("Luxury Retail", ["Luxury House", "Premium Apparel", "Footwear", "Accessory", "Department Luxury", "Store Design Luxury"]),
            ("Fashion Supply", ["Textile", "Apparel OEM", "Designer Brand", "Fashion Platform", "Beauty Luxury", "Jewelry Watch"]),
        ],
    ),
    SectorConfig(
        "PublicPolicy",
        [
            ("Regulation", ["Tax Policy", "Education Policy", "Housing Policy", "Healthcare Policy"]),
            ("Macro", ["Inflation", "Employment", "Trade", "Demographics"]),
            ("Governance", ["Election", "Public Finance", "Local Government", "Public Procurement"]),
        ],
        [
            ("Policy Sensitive", ["Education Policy Beneficiary", "Healthcare Policy Beneficiary", "Housing Policy Beneficiary", "Defense Budget Beneficiary", "Energy Policy Beneficiary", "Public Procurement"]),
            ("Macro Exposed", ["Inflation Hedge", "Rate Sensitive", "Trade Sensitive", "Demographic Demand", "Fiscal Beneficiary", "Regulatory Tech"]),
        ],
    ),
    SectorConfig(
        "DigitalAssets",
        [
            ("Crypto Market", ["Bitcoin", "Ethereum", "Altcoin", "Stablecoin"]),
            ("Blockchain Infra", ["Layer1", "Layer2", "Validator", "Custody"]),
            ("Crypto Finance", ["Spot ETF", "Exchange", "On-chain Data", "Tokenization"]),
        ],
        [
            ("Crypto Platforms", ["Exchange", "Custody", "Brokerage", "On-chain Analytics", "Tokenization Platform", "Wallet Infrastructure"]),
            ("Blockchain Infrastructure", ["Layer1 Ecosystem", "Layer2 Ecosystem", "Validation Services", "Mining Infrastructure", "Stablecoin Infrastructure", "Crypto Payments"]),
        ],
    ),
    SectorConfig(
        "CyberSecurity",
        [
            ("Threat", ["Hacking", "Backdoor", "Ransomware", "Zero Day"]),
            ("Security Stack", ["Endpoint Security", "Network Security", "Cloud Security", "Identity Security"]),
            ("Policy & Response", ["Incident Response", "Cyber Drill", "Compliance", "Security Audit"]),
        ],
        [
            ("Security Software", ["Endpoint Security", "Network Security", "Cloud Security", "Identity Access Management", "SOC Platform", "Threat Intelligence"]),
            ("Cyber Infrastructure", ["Security Hardware", "Managed Security Service", "Incident Response Service", "Cyber Forensics", "Data Loss Prevention", "OT Security"]),
        ],
    ),
]


REGIONAL_STOCKS: dict[str, list[tuple[str, str]]] = {
    "Technology": [("NVDA", "NVIDIA"), ("AMD", "Advanced Micro Devices"), ("005930", "Samsung Electronics"), ("8035.T", "Tokyo Electron"), ("ASML.AS", "ASML"), ("000660", "SK hynix")],
    "Consumer": [("KO", "Coca-Cola"), ("PEP", "PepsiCo"), ("005300", "Lotte Chilsung"), ("2502.T", "Asahi Group"), ("NESN.SW", "Nestle"), ("2587.T", "Suntory Beverage & Food")],
    "Retail": [("282330", "BGF Retail"), ("007070", "GS Retail"), ("WMT", "Walmart"), ("9983.T", "Fast Retailing"), ("ZAL.DE", "Zalando"), ("AMZN", "Amazon")],
    "Finance": [("JPM", "JPMorgan Chase"), ("KB", "KB Financial"), ("105560", "KB Financial Group"), ("8306.T", "Mitsubishi UFJ"), ("BNP.PA", "BNP Paribas"), ("GS", "Goldman Sachs")],
    "Healthcare": [("JNJ", "Johnson & Johnson"), ("PFE", "Pfizer"), ("207940", "Samsung Biologics"), ("4502.T", "Takeda"), ("NVS", "Novartis"), ("068270", "Celltrion")],
    "Education": [("215200", "Megastudy Education"), ("053290", "NE Neungyul"), ("TAL", "TAL Education"), ("9766.T", "Konami Group"), ("RCO.PA", "Remy Cointreau")],
    "Energy": [("XOM", "Exxon Mobil"), ("CVX", "Chevron"), ("010950", "S-Oil"), ("1605.T", "INPEX"), ("SHEL", "Shell"), ("267250", "HD Hyundai")],
    "Mobility": [("TSLA", "Tesla"), ("005380", "Hyundai Motor"), ("7203.T", "Toyota"), ("STLA", "Stellantis"), ("NIO", "NIO"), ("000270", "Kia")],
    "AerospaceDefense": [("LMT", "Lockheed Martin"), ("RTX", "RTX"), ("012450", "Hanwha Aerospace"), ("7011.T", "Mitsubishi Heavy Industries"), ("AIR.PA", "Airbus"), ("047810", "KAI")],
    "Construction": [("000720", "Hyundai E&C"), ("006360", "GS E&C"), ("PWR", "Quanta Services"), ("1801.T", "Taisei"), ("HO.PA", "Thales"), ("375500", "DL E&C")],
    "MediaEntertainment": [("NFLX", "Netflix"), ("DIS", "Walt Disney"), ("352820", "HYBE"), ("7974.T", "Nintendo"), ("UMG.AS", "Universal Music Group"), ("259960", "Krafton")],
    "Telecom": [("T", "AT&T"), ("VZ", "Verizon"), ("017670", "SK Telecom"), ("9432.T", "NTT"), ("ORA.PA", "Orange"), ("030200", "KT")],
    "LogisticsShipping": [("UPS", "UPS"), ("FDX", "FedEx"), ("011200", "HMM"), ("9101.T", "Nippon Yusen"), ("MAERSK-B.CO", "Maersk"), ("028670", "Pan Ocean")],
    "TravelLeisure": [("BKNG", "Booking Holdings"), ("ABNB", "Airbnb"), ("039130", "HanaTour"), ("9201.T", "Japan Airlines"), ("IHG", "InterContinental Hotels"), ("008770", "Hotel Shilla")],
    "AgricultureFoodSupply": [("ADM", "Archer Daniels Midland"), ("BG", "Bunge"), ("001680", "Daesang"), ("2503.T", "Kirin"), ("BN.PA", "Danone"), ("CJ", "CJ CheilJedang")],
    "ChemicalsMaterials": [("DOW", "Dow"), ("DD", "DuPont"), ("051910", "LG Chem"), ("4004.T", "Showa Denko"), ("BAS.DE", "BASF"), ("011170", "Lotte Chemical")],
    "RealEstate": [("PLD", "Prologis"), ("SPG", "Simon Property Group"), ("088980", "Mirae Asset REIT"), ("3289.T", "Tokyu Fudosan"), ("VNA.DE", "Vonovia"), ("348950", "Jinro REITs")],
    "ClimateEnvironment": [("VWS.CO", "Vestas"), ("ENPH", "Enphase Energy"), ("009830", "Hanwha Solutions"), ("9501.T", "Tokyo Electric Power"), ("SGRE.MC", "Siemens Gamesa"), ("AAPL", "Apple")],
    "LuxuryFashion": [("LVMUY", "LVMH"), ("RMS.PA", "Hermes"), ("TPR", "Tapestry"), ("9983.T", "Fast Retailing"), ("KER.PA", "Kering"), ("CPRI", "Capri Holdings")],
    "PublicPolicy": [("MSFT", "Microsoft"), ("005930", "Samsung Electronics"), ("LMT", "Lockheed Martin"), ("9432.T", "NTT"), ("SAN.PA", "Sanofi"), ("105560", "KB Financial Group")],
    "DigitalAssets": [("COIN", "Coinbase"), ("MSTR", "MicroStrategy"), ("SQ", "Block"), ("8698.T", "Monex Group"), ("8473.T", "SBI Holdings"), ("0388.HK", "HKEX")],
    "CyberSecurity": [("CRWD", "CrowdStrike"), ("PANW", "Palo Alto Networks"), ("FTNT", "Fortinet"), ("053800", "AhnLab"), ("4704.T", "Trend Micro"), ("CHKP", "Check Point")],
}


def build_content_taxonomy() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    tid = 1
    for sector in SECTORS:
      for category, subcats in sector.categories:
          for subcat in subcats:
              rows.append(
                  {
                      "taxonomy_id": f"TX{tid:04d}",
                      "sector": sector.name,
                      "category": category,
                      "subcategory": subcat,
                  }
              )
              tid += 1

          # Add patterned variants for breadth
          for suffix in ["Trend", "Market", "Strategy", "Case Study"]:
              rows.append(
                  {
                      "taxonomy_id": f"TX{tid:04d}",
                      "sector": sector.name,
                      "category": category,
                      "subcategory": f"{subcats[0]} {suffix}",
                  }
              )
              tid += 1

    return rows


def build_industry_classification() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    sid = 1
    iid = 1
    suid = 1

    for sector in SECTORS:
        sector_id = f"SEC{sid:02d}"
        sid += 1
        for industry_name, subindustries in sector.industries:
            industry_id = f"IND{iid:03d}"
            iid += 1
            for sub in subindustries:
                rows.append(
                    {
                        "sector_id": sector_id,
                        "sector_name": sector.name,
                        "industry_id": industry_id,
                        "industry_name": industry_name,
                        "subindustry_id": f"SUB{suid:04d}",
                        "subindustry_name": sub,
                    }
                )
                suid += 1

    return rows


def build_taxonomy_industry_mapping(
    taxonomy_rows: list[dict[str, str]], industry_rows: list[dict[str, str]]
) -> list[dict[str, str]]:
    by_sector: dict[str, list[str]] = {}
    for row in industry_rows:
        by_sector.setdefault(row["sector_name"], []).append(row["subindustry_id"])

    mapping: list[dict[str, str]] = []
    counters: dict[str, int] = {k: 0 for k in by_sector}

    for tx in taxonomy_rows:
        pool = by_sector[tx["sector"]]
        idx = counters[tx["sector"]] % len(pool)
        counters[tx["sector"]] += 1
        mapping.append({"taxonomy_id": tx["taxonomy_id"], "subindustry_id": pool[idx]})

    return mapping


def build_stock_example_mapping(industry_rows: list[dict[str, str]]) -> list[dict[str, str]]:
    out: list[dict[str, str]] = []
    for row in industry_rows:
        sector_name = row["sector_name"]
        pool = REGIONAL_STOCKS.get(sector_name, REGIONAL_STOCKS["Technology"])
        # 4 names each: rotates by subindustry id hash for variety
        seed = sum(ord(ch) for ch in row["subindustry_id"])
        picks = [pool[(seed + i) % len(pool)] for i in range(4)]
        seen: set[str] = set()
        for ticker, company in picks:
            if ticker in seen:
                continue
            seen.add(ticker)
            out.append(
                {
                    "ticker": ticker,
                    "company_name": company,
                    "subindustry_id": row["subindustry_id"],
                }
            )

    return out


def write_csv(path: Path, rows: list[dict[str, str]], fieldnames: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


def write_schema(path: Path) -> None:
    path.write_text(
        """-- taxonomy_assets/schema.sql
-- Video title taxonomy -> industry -> stock mapping seed tables

CREATE TABLE IF NOT EXISTS content_taxonomy (
  taxonomy_id TEXT PRIMARY KEY,
  sector TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS industry_classification (
  sector_id TEXT NOT NULL,
  sector_name TEXT NOT NULL,
  industry_id TEXT NOT NULL,
  industry_name TEXT NOT NULL,
  subindustry_id TEXT PRIMARY KEY,
  subindustry_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS taxonomy_industry_mapping (
  taxonomy_id TEXT NOT NULL REFERENCES content_taxonomy(taxonomy_id),
  subindustry_id TEXT NOT NULL REFERENCES industry_classification(subindustry_id),
  PRIMARY KEY (taxonomy_id, subindustry_id)
);

CREATE TABLE IF NOT EXISTS stock_example_mapping (
  ticker TEXT NOT NULL,
  company_name TEXT NOT NULL,
  subindustry_id TEXT NOT NULL REFERENCES industry_classification(subindustry_id),
  PRIMARY KEY (ticker, subindustry_id)
);

CREATE INDEX IF NOT EXISTS idx_content_taxonomy_sector ON content_taxonomy(sector);
CREATE INDEX IF NOT EXISTS idx_industry_classification_sector ON industry_classification(sector_name);
CREATE INDEX IF NOT EXISTS idx_taxonomy_mapping_taxonomy ON taxonomy_industry_mapping(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_stock_example_subindustry ON stock_example_mapping(subindustry_id);
""",
        encoding="utf-8",
    )


def write_classifier(path: Path) -> None:
    path.write_text(
        """from __future__ import annotations

import csv
from pathlib import Path
from typing import Dict, List, Tuple

BASE = Path(__file__).resolve().parent
TAXONOMY_CSV = BASE / "content_taxonomy.csv"

KEYWORD_RULES: List[Tuple[List[str], Tuple[str, str, str]]] = [
    (["도서관", "건축가", "건축", "공공건축"], ("Construction", "Architecture", "Library")),
    (["cu", "편의점", "gs25", "세븐일레븐"], ("Retail", "Convenience", "CU")),
    (["밀크티", "버블티"], ("Consumer", "Food", "Milk Tea")),
    (["ai", "엔비디아", "gpu", "반도체"], ("Technology", "Semiconductor", "GPU")),
    (["명품", "럭셔리", "플래그십"], ("LuxuryFashion", "Luxury", "Luxury Brand")),
    (["수능", "입시", "학원", "영어"], ("Education", "K-12", "Suneung")),
    (["암", "항암", "병원", "식이요법"], ("Healthcare", "Pharma", "Oncology")),
    (["이란", "호르무즈", "기뢰", "미사일"], ("AerospaceDefense", "Defense", "Missile")),
    (["이더리움", "eth"], ("DigitalAssets", "Crypto Market", "Ethereum")),
    (["블록체인", "레이어1", "레이어2", "validator", "검증자"], ("DigitalAssets", "Blockchain Infra", "Layer1")),
    (["비트코인", "btc", "코인", "암호화폐", "가상자산"], ("DigitalAssets", "Crypto Market", "Bitcoin")),
    (["해킹", "백도어", "랜섬웨어", "제로데이", "악성코드"], ("CyberSecurity", "Threat", "Hacking")),
    (["보안", "침해사고", "보안점검", "사이버공격", "정보보호"], ("CyberSecurity", "Security Stack", "Endpoint Security")),
]


def _load_taxonomy() -> Dict[Tuple[str, str, str], str]:
    table: Dict[Tuple[str, str, str], str] = {}
    with TAXONOMY_CSV.open("r", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            key = (row["sector"], row["category"], row["subcategory"])
            table[key] = row["taxonomy_id"]
    return table


def classify_video_title(title: str) -> dict:
    title_l = title.strip().lower()
    taxonomy = _load_taxonomy()

    for keywords, target in KEYWORD_RULES:
        if any(k in title_l for k in keywords):
            taxonomy_id = taxonomy.get(target)
            if taxonomy_id:
                return {
                    "sector": target[0],
                    "category": target[1],
                    "subcategory": target[2],
                    "taxonomy_id": taxonomy_id,
                }

    # Fallback: simple fuzzy against subcategory token overlap
    best = None
    best_score = -1
    title_tokens = set(title_l.replace("/", " ").replace("-", " ").split())
    for (sector, category, subcategory), taxonomy_id in taxonomy.items():
        tokens = set(subcategory.lower().split())
        score = len(title_tokens.intersection(tokens))
        if score > best_score:
            best_score = score
            best = (sector, category, subcategory, taxonomy_id)

    if best:
        return {
            "sector": best[0],
            "category": best[1],
            "subcategory": best[2],
            "taxonomy_id": best[3],
        }

    return {"sector": "", "category": "", "subcategory": "", "taxonomy_id": ""}


if __name__ == "__main__":
    tests = [
        "건축가가 한국 전통을 재해석해 만든 도서관",
        "CU 편의점 밀크티 리뷰",
        "AI 반도체 시장을 장악한 엔비디아",
        "서울에서 가장 아름다운 도서관",
    ]
    for t in tests:
        print(t)
        print(classify_video_title(t))
""",
        encoding="utf-8",
    )


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    taxonomy_rows = build_content_taxonomy()
    industry_rows = build_industry_classification()
    tx_map_rows = build_taxonomy_industry_mapping(taxonomy_rows, industry_rows)
    stock_rows = build_stock_example_mapping(industry_rows)

    write_schema(OUT / "schema.sql")
    write_csv(
        OUT / "content_taxonomy.csv",
        taxonomy_rows,
        ["taxonomy_id", "sector", "category", "subcategory"],
    )
    write_csv(
        OUT / "industry_classification.csv",
        industry_rows,
        ["sector_id", "sector_name", "industry_id", "industry_name", "subindustry_id", "subindustry_name"],
    )
    write_csv(
        OUT / "taxonomy_industry_mapping.csv",
        tx_map_rows,
        ["taxonomy_id", "subindustry_id"],
    )
    write_csv(
        OUT / "stock_example_mapping.csv",
        stock_rows,
        ["ticker", "company_name", "subindustry_id"],
    )
    write_classifier(OUT / "title_classifier.py")

    print(f"Generated in: {OUT}")
    print(f"content_taxonomy rows: {len(taxonomy_rows)}")
    print(f"industry_classification rows: {len(industry_rows)}")
    print(f"taxonomy_industry_mapping rows: {len(tx_map_rows)}")
    print(f"stock_example_mapping rows: {len(stock_rows)}")


if __name__ == "__main__":
    main()
