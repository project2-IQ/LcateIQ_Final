"""
stdin: JSON with optional city filter and limits, e.g.
{"city":"Abha","limits":{"high":2,"mid":3,"low":2}}
city: "Abha" | "Khamis Mushait" | null (all rows)
stdout: JSON { ok, high, mid, low, summary }
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


def load_stats(df):
    f = ["population_density", "services_count", "competitors_count"]
    d = df[f].fillna(df[f].mean())
    return {
        "pd_min": float(d["population_density"].min()),
        "pd_max": float(d["population_density"].max()),
        "sv_min": float(d["services_count"].min()),
        "sv_max": float(d["services_count"].max()),
        "cp_min": float(d["competitors_count"].min()),
        "cp_max": float(d["competitors_count"].max()),
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


def row_to_dict(row, cluster, score, ar, en):
    return {
        "id": int(row["id"]) if "id" in row and pd.notna(row["id"]) else None,
        "neighborhood": str(row["neighborhood"]),
        "city": str(row["city"]),
        "latitude": float(row["latitude"]),
        "longitude": float(row["longitude"]),
        "population_density": float(row["population_density"]),
        "services_count": float(row["services_count"]),
        "competitors_count": float(row["competitors_count"]),
        "cluster": int(cluster),
        "score": round(float(score), 2),
        "suitability_ar": ar,
        "suitability_en": en,
    }


def main():
    raw = sys.stdin.read().strip()
    if not raw:
        print(json.dumps({"ok": False, "error": "empty stdin"}))
        sys.exit(1)
    cfg = json.loads(raw)
    city = cfg.get("city")
    limits = cfg.get("limits") or {}
    lim_high = int(limits.get("high", 2))
    lim_mid = int(limits.get("mid", 3))
    lim_low = int(limits.get("low", 2))

    full_df = pd.read_csv(DATA_PATH)
    features = ["population_density", "services_count", "competitors_count"]
    full_df[features] = full_df[features].fillna(full_df[features].mean())
    stats = load_stats(full_df)

    df = full_df
    if city:
        df = df[df["city"].str.strip().str.lower() == city.strip().lower()]
    if len(df) == 0:
        df = full_df

    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)

    rows_out = []
    for _, row in df.iterrows():
        pd_ = float(row["population_density"])
        sv = float(row["services_count"])
        cp = float(row["competitors_count"])
        X = [[pd_, sv, cp]]
        Xs = scaler.transform(X)
        cluster = int(model.predict(Xs)[0])
        score = compute_score(pd_, sv, cp, stats)
        ar, en = score_to_labels(score)
        rows_out.append((score, row_to_dict(row, cluster, score, ar, en)))

    high_t = [x for x in rows_out if x[0] >= 65]
    mid_t = [x for x in rows_out if 35 <= x[0] < 65]
    low_t = [x for x in rows_out if x[0] < 35]

    high_t.sort(key=lambda x: -x[0])
    mid_t.sort(key=lambda x: -x[0])
    low_t.sort(key=lambda x: x[0])

    high = [x[1] for x in high_t[:lim_high]]
    mid = [x[1] for x in mid_t[:lim_mid]]
    low = [x[1] for x in low_t[:lim_low]]

    best = None
    if high:
        best = high[0]
    elif mid:
        best = mid[0]
    elif low:
        best = low[0]

    # إن فُرغت كل القوائم بسبب حدود العدّ لكن البيانات موجودة
    if best is None and rows_out:
        rows_out.sort(key=lambda x: -x[0])
        best = rows_out[0][1]
        if not high and not mid and not low:
            sc = best["score"]
            if sc >= 65:
                high = [best]
            elif sc >= 35:
                mid = [best]
            else:
                low = [best]

    summary = None
    if best:
        summary = {
            "cluster": best["cluster"],
            "score": best["score"],
            "suitability_ar": best["suitability_ar"],
            "suitability_en": best["suitability_en"],
        }

    out = {
        "ok": True,
        "high": high,
        "mid": mid,
        "low": low,
        "summary": summary,
    }
    # ASCII-safe JSON for PHP on Windows pipes
    print(json.dumps(out, ensure_ascii=True))


if __name__ == "__main__":
    main()
