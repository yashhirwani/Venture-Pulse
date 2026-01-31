import joblib
import pandas as pd
from similarity import SimilarityEngine

MODEL_PATH = "models/risk_model.joblib"
ML_DATA_PATH = "data/startup_ml_clean.csv"


class VenturePulsePredictor:
    def __init__(self):
        print("Loading risk model...")
        self.model = joblib.load(MODEL_PATH)

        print("Loading dataset...")
        self.ml_df = pd.read_csv(ML_DATA_PATH)

        print("Loading similarity engine...")
        self.sim_engine = SimilarityEngine()

        print("VenturePulse Predictor Ready")


    # MARKET SIGNALS (DOMAIN LEVEL)

    def _compute_market_signals(self, domain_clean):
        domain_df = self.ml_df[self.ml_df["domain_clean"] == domain_clean]

        if domain_df.empty:
            domain_df = self.ml_df

        return {
            "failed_rate": float(round(domain_df["status_failed"].mean(), 3)),
            "avg_funding": float(round(domain_df["funding_total_usd"].mean(), 2)),
            "avg_years_since_last_funding": float(
                round(domain_df["years_since_last_funding"].mean(), 2)
            ),
            "crowdedness": int(len(domain_df)),
        }

    # LAUNCH TIMING

    def _predict_launch_timing(self, domain_clean):
        domain_df = self.ml_df[self.ml_df["domain_clean"] == domain_clean]

        if domain_df.empty:
            domain_df = self.ml_df

        total = len(domain_df)
        recent = len(domain_df[domain_df["years_since_founded"] <= 2])
        ratio = recent / total if total > 0 else 0

        if ratio > 0.25:
            return {
                "market_speed": "Fast growth",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Launch within 3–4 months",
                "reason": "High rate of new market entrants",
            }
        elif ratio > 0.12:
            return {
                "market_speed": "Moderate growth",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Launch within 6–8 months",
                "reason": "Steady increase in competitors",
            }
        else:
            return {
                "market_speed": "Slow / early stage",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Safe window: 9–12 months",
                "reason": "Low recent competitive pressure",
            }


    # USP DIFFERENTIATION (SEMANTIC)

    def _compute_usp_uniqueness(self, usp_text, similar_startups):
        if not usp_text or len(usp_text.strip()) < 10:
            return 0.0

        usp_embedding = self.sim_engine.model.encode(
            usp_text, normalize_embeddings=True
        )

        similarities = []

        for s in similar_startups:
            competitor_text = s.get("category_list", "")
            if not competitor_text:
                continue

            comp_embedding = self.sim_engine.model.encode(
                competitor_text, normalize_embeddings=True
            )

            similarity = float(usp_embedding @ comp_embedding)
            similarities.append(similarity)

        if not similarities:
            return 0.0

        avg_similarity = sum(similarities) / len(similarities)
        return round(max(0.0, 1 - avg_similarity), 3)


    # EXPLANATIONS

    def _generate_explanations(self, risk_score, signals, similar_startups, usp_uniqueness):
        reasons = []

        if signals["failed_rate"] > 0.5:
            reasons.append("Historically high failure rate in this domain")

        if signals["avg_years_since_last_funding"] > self.ml_df[
            "years_since_last_funding"
        ].quantile(0.75):
            reasons.append("Long gaps since last funding are common in this domain")

        if len(similar_startups) >= 5:
            reasons.append("Several established competitors exist in this space")

        if usp_uniqueness > 0.4:
            reasons.append("Product positioning shows strong differentiation")
        elif usp_uniqueness > 0.2:
            reasons.append("Product positioning shows moderate differentiation")

        if risk_score > 0.7:
            reasons.append("Model indicates relatively high risk")
        elif risk_score < 0.3:
            reasons.append("Model indicates relatively low risk")

        if not reasons:
            reasons.append("No strong historical risk indicators detected")

        return reasons


    # MAIN ANALYSIS

    def analyze_startup(
        self,
        user_idea_text,
        domain_clean,
        funding_total_usd,
        funding_rounds,
        years_since_founded,
        years_since_last_funding,
        usp_text=None,
    ):
        print("\n--- Analyzing Startup ---")

        similar = self.sim_engine.find_similar_startups(
            user_idea_text, top_n=5
        )

        signals = self._compute_market_signals(domain_clean)
        launch_timing = self._predict_launch_timing(domain_clean)

        input_df = pd.DataFrame(
            [
                {
                    "funding_total_usd": funding_total_usd,
                    "funding_rounds": funding_rounds,
                    "years_since_founded": years_since_founded,
                    "years_since_last_funding": years_since_last_funding,
                    "domain_clean": domain_clean,
                }
            ]
        )

        base_risk = float(self.model.predict_proba(input_df)[0, 1])

        usp_uniqueness = self._compute_usp_uniqueness(usp_text, similar)

        MAX_USP_IMPACT = 0.15
        final_risk = round(base_risk * (1 - usp_uniqueness * MAX_USP_IMPACT), 3)

        explanations = self._generate_explanations(
            final_risk, signals, similar, usp_uniqueness
        )

        return {
            "idea": user_idea_text,
            "domain": domain_clean,
            "risk_before_adjustment": round(base_risk, 3),
            "risk_final": final_risk,
            "risk_label": (
                "High"
                if final_risk > 0.7
                else "Medium"
                if final_risk > 0.4
                else "Low"
            ),
            "usp_uniqueness_score": usp_uniqueness,
            "similar_startups": similar,
            "market_signals": signals,
            "launch_timing": launch_timing,
            "explanations": explanations,
        }


# MANUAL TEST
if __name__ == "__main__":
    predictor = VenturePulsePredictor()

    idea = input("Enter startup idea description: ")
    domain = input("Enter domain: ")
    usp = input("Enter USP / differentiator (optional): ")

    report = predictor.analyze_startup(
        user_idea_text=idea,
        domain_clean=domain,
        funding_total_usd=500000,
        funding_rounds=1,
        years_since_founded=1,
        years_since_last_funding=1,
        usp_text=usp if usp.strip() else None,
    )

    print("\n===== REPORT =====")
    for k, v in report.items():
        print(k, ":", v)
