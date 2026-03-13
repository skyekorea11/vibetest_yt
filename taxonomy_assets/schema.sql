-- taxonomy_assets/schema.sql
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
