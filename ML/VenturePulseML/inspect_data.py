import pandas as pd

df = pd.read_csv("data/big_startup_secsees_dataset.csv")

print("Shape:", df.shape)

print("\nColumns:")
for col in df.columns:
    print(col)

print("\nFirst 5 rows:")
print(df.head())

print("\nMissing % per column:")
print(df.isna().mean().sort_values(ascending=False).head(15))
