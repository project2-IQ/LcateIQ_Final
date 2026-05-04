"""Train K-Means + scaler; saves to ml/models/. Run from ml folder: python train.py"""
from pathlib import Path

import joblib
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "Data" / "LocateIQ_Dataset_Final_rows.csv"
MODELS_DIR = BASE_DIR / "models"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(DATA_PATH)
features = ["population_density", "services_count", "competitors_count"]
X = df[features].fillna(df[features].mean())

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = KMeans(n_clusters=3, random_state=42, n_init=10)
model.fit(X_scaled)

joblib.dump(model, MODELS_DIR / "kmeans_model.pkl")
joblib.dump(scaler, MODELS_DIR / "scaler.pkl")
print("Saved:", MODELS_DIR / "kmeans_model.pkl", MODELS_DIR / "scaler.pkl")
