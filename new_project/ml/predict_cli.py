"""
Read one JSON line from stdin: {"population_density":n,"services_count":n,"competitors_count":n}
Write one JSON line to stdout: cluster, score, suitability keys for PHP.
"""
import json
import sys
from pathlib import Path

import joblib
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "kmeans_model.pkl"
SCALER_PATH = BASE_DIR / "models" / "scaler.pkl"
DATA_PATH = BASE_DIR / "Data" / "LocateIQ_Dataset_Final_rows.csv"


def norm(x, mn, mx):
    return 0.0 if mx == mn else (x - mn) / (mx - mn)


def load_stats():
    df = pd.read_csv(DATA_PATH)
    f = ["population_density", "services_count", "competitors_count"]
    df[f] = df[f].fillna(df[f].mean())
    return {
        "pd_min": float(df["population_density"].min()),
        "pd_max": float(df["population_density"].max()),
        "sv_min": float(df["services_count"].min()),
        "sv_max": float(df["services_count"].max()),
        "cp_min": float(df["competitors_count"].min()),
        "cp_max": float(df["competitors_count"].max()),
    }


def compute_score(pd_, sv, cp, stats):
    pd_n = norm(pd_, stats["pd_min"], stats["pd_max"])
    sv_n = norm(sv, stats["sv_min"], stats["sv_max"])
    cp_n = norm(cp, stats["cp_min"], stats["cp_max"])
    return float((pd_n * 0.35 + sv_n * 0.40 + (1 - cp_n) * 0.25) * 100)


def score_to_labels(score):
    if score >= 65:
        return "مناسب جداً", "Highly Suitable"
    if score >= 35:
        return "مناسب متوسط", "Moderate"
    return "غير مُوصى به", "Not Recommended"


def main():
    raw = sys.stdin.read().strip()
    if not raw:
        print(json.dumps({"error": "empty stdin"}))
        sys.exit(1)
    data = json.loads(raw)
    pd_ = float(data["population_density"])
    sv = float(data["services_count"])
    cp = float(data["competitors_count"])

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    stats = load_stats()

    X = [[pd_, sv, cp]]
    Xs = scaler.transform(X)
    cluster = int(model.predict(Xs)[0])
    score = compute_score(pd_, sv, cp, stats)
    ar, en = score_to_labels(score)

    out = {
        "cluster": cluster,
        "score": round(score, 2),
        "suitability_ar": ar,
        "suitability_en": en,
        "ok": True,
    }
    print(json.dumps(out))


if __name__ == "__main__":
    main()
