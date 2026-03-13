from __future__ import annotations

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
