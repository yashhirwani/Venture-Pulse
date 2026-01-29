import pandas as pd
import numpy as np
from datetime import datetime

RAW_PATH = "data/big_startup_secsees_dataset.csv"
ML_OUT = "data/startup_ml_clean.csv"
SIM_OUT = "data/startup_similarity_clean.csv"

current_year = datetime.now().year

df = pd.read_csv(RAW_PATH)

print("Initial shape:", df.shape)

# -----------------------------
# 1. Clean Status (Label)
# -----------------------------
df['status'] = df['status'].str.lower().str.strip()

status_map = {
    'closed': 'failed',
    'operating': 'alive',
    'acquired': 'alive',
    'ipo': 'alive'
}

df['status_clean'] = df['status'].map(status_map)
df = df.dropna(subset=['status_clean'])

df['status_failed'] = (df['status_clean'] == 'failed').astype(int)

# -----------------------------
# 2. Funding (Numeric + Outliers)
# -----------------------------
df['funding_total_usd'] = pd.to_numeric(df['funding_total_usd'], errors='coerce')
df.loc[df['funding_total_usd'] < 0, 'funding_total_usd'] = np.nan

funding_cap = df['funding_total_usd'].quantile(0.99)
df.loc[df['funding_total_usd'] > funding_cap, 'funding_total_usd'] = funding_cap

df['funding_total_usd'] = df['funding_total_usd'].fillna(
    df['funding_total_usd'].median()
)

# -----------------------------
# 3. Funding Rounds
# -----------------------------
df['funding_rounds'] = pd.to_numeric(df['funding_rounds'], errors='coerce')
df['funding_rounds'] = df['funding_rounds'].fillna(0)

# -----------------------------
# 4. Date Features
# -----------------------------
df['founded_year'] = pd.to_datetime(df['founded_at'], errors='coerce').dt.year
df['last_funding_year'] = pd.to_datetime(df['last_funding_at'], errors='coerce').dt.year

df['years_since_founded'] = current_year - df['founded_year']
df['years_since_last_funding'] = current_year - df['last_funding_year']

df = df[df['years_since_founded'] >= 0]

df['years_since_last_funding'] = df['years_since_last_funding'].fillna(10)

# -----------------------------
# 5. Domain Cleaning (Category)
# -----------------------------
df['domain_clean'] = df['category_list'].str.lower().str.strip()

# Simple normalization
df.loc[df['domain_clean'].str.contains('ai|artificial', na=False), 'domain_clean'] = 'AI'
df.loc[df['domain_clean'].str.contains('fin|bank|payment', na=False), 'domain_clean'] = 'FinTech'
df.loc[df['domain_clean'].str.contains('health|medical', na=False), 'domain_clean'] = 'HealthTech'
df.loc[df['domain_clean'].str.contains('ecommerce|retail|shopping', na=False), 'domain_clean'] = 'E-Commerce'
df.loc[df['domain_clean'].str.contains('saas|software', na=False), 'domain_clean'] = 'SaaS'
df.loc[df['domain_clean'].str.contains('education|edtech', na=False), 'domain_clean'] = 'EdTech'
df.loc[df['domain_clean'].str.contains('marketing|ads', na=False), 'domain_clean'] = 'MarTech'

df = df.dropna(subset=['domain_clean'])

# -----------------------------
# 6. Save ML Dataset
# -----------------------------
ml_cols = [
    'funding_total_usd',
    'funding_rounds',
    'years_since_founded',
    'years_since_last_funding',
    'domain_clean',
    'status_failed'
]

df[ml_cols].to_csv(ML_OUT, index=False)

# -----------------------------
# 7. Save Similarity Dataset
# -----------------------------
sim_cols = ['name', 'category_list', 'domain_clean']

df[sim_cols].dropna().to_csv(SIM_OUT, index=False)

print("✅ Cleaning complete")
print("ML file saved to:", ML_OUT)
print("Similarity file saved to:", SIM_OUT)
print("Final shape:", df.shape)
