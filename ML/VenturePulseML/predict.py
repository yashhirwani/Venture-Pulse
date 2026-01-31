import joblib
import pandas as pd
from similarity import SimilarityEngine

MODEL_PATH = "models/risk_model.joblib"
ML_DATA_PATH = "data/startup_ml_clean.csv"


class VenturePulsePredictor:
    def __init__(self):
        print("Loading risk model...")
        self.model = joblib.load(MODEL_PATH)

        print("Loading ML dataset...")
        self.ml_df = pd.read_csv(ML_DATA_PATH)

        print("Loading similarity engine...")
        self.sim_engine = SimilarityEngine()

        print(" VenturePulse Predictor Ready")

    # =================================================
    # MARKET SIGNALS (DOMAIN-LEVEL — CORRECT DESIGN)
    # =================================================
    def _compute_market_signals(self, domain_clean):
        """
        Compute market signals at DOMAIN level.
        This avoids fragile name matching and is industry-correct.
        """

        domain_df = self.ml_df[self.ml_df["domain_clean"] == domain_clean]

        # Fallback safety
        if domain_df.empty:
            domain_df = self.ml_df

        return {
            "failed_rate": round(domain_df["status_failed"].mean(), 3),
            "avg_funding": round(domain_df["funding_total_usd"].mean(), 2),
            "avg_years_since_last_funding": round(
                domain_df["years_since_last_funding"].mean(), 2
            ),
            "crowdedness": len(domain_df),
        }

    # =================================================
    # LAUNCH TIMING PREDICTOR
    # =================================================
    def _predict_launch_timing(self, domain_clean):
        domain_df = self.ml_df[self.ml_df["domain_clean"] == domain_clean]

        if domain_df.empty:
            domain_df = self.ml_df

        total = len(domain_df)
        recent = len(domain_df[domain_df["years_since_founded"] <= 2])
        ratio = recent / total if total > 0 else 0

        if ratio > 0.25:
            return {
                "market_speed": "Heating Up",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Launch MVP within 3–4 months",
                "reason": "Rapid entry of new startups in this market",
            }
        elif ratio > 0.12:
            return {
                "market_speed": "Moderate Growth",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Launch within 6–8 months",
                "reason": "Steady growth in new competitors",
            }
        else:
            return {
                "market_speed": "Slow / Early",
                "recent_entry_rate": round(ratio, 3),
                "recommended_launch_window": "Safe window: 9–12 months",
                "reason": "Low recent competitive pressure",
            }

    # =================================================
    # EXPLANATION ENGINE (HONEST + DATA-DRIVEN)
    # =================================================
    def _generate_explanations(self, risk_score, signals, similar_startups):
        reasons = []

        if signals["failed_rate"] > 0.5:
            reasons.append(
                "Historically high failure rate in this domain"
            )

        if signals["avg_years_since_last_funding"] > self.ml_df[
            "years_since_last_funding"
        ].quantile(0.75):
            reasons.append(
                "Long gaps since last funding are common in this domain"
            )

        if len(similar_startups) >= 5:
            reasons.append(
                "Multiple active competitors exist for similar ideas"
            )

        if risk_score > 0.7:
            reasons.append("ML model predicts relatively high failure risk")
        elif risk_score < 0.3:
            reasons.append("ML model predicts relatively low failure risk")

        if not reasons:
            reasons.append(
                "No strong historical risk indicators detected"
            )

        return reasons

    # =================================================
    # MAIN ANALYSIS PIPELINE
    # =================================================
    def analyze_startup(
        self,
        user_idea_text,
        domain_clean,
        funding_total_usd,
        funding_rounds,
        years_since_founded,
        years_since_last_funding,
    ):
        print("\n--- Analyzing Startup ---")

        #  Semantic similarity (competitors)
        similar = self.sim_engine.find_similar_startups(
            user_idea_text, top_n=5
        )

        #  Market intelligence (domain-level)
        signals = self._compute_market_signals(domain_clean)

        #  Launch timing
        launch_timing = self._predict_launch_timing(domain_clean)

        #  ML risk prediction
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

        risk_score = float(self.model.predict_proba(input_df)[0, 1])

        # Explanations
        explanations = self._generate_explanations(
            risk_score, signals, similar
        )

        return {
            "idea": user_idea_text,
            "domain": domain_clean,
            "risk_score": round(risk_score, 3),
            "risk_label": (
                "High"
                if risk_score > 0.7
                else "Medium"
                if risk_score > 0.4
                else "Low"
            ),
            "similar_startups": similar,
            "market_signals": signals,
            "launch_timing": launch_timing,
            "explanations": explanations,
        }


# =================================================
# MANUAL TEST
# =================================================
if __name__ == "__main__":
    predictor = VenturePulsePredictor()

    report = predictor.analyze_startup(
        user_idea_text="AI tool for automating resume screening for HR teams",
        domain_clean="AI",
        funding_total_usd=500000,
        funding_rounds=1,
        years_since_founded=1,
        years_since_last_funding=1,
    )

    print("\n===== VENTURE_PULSE REPORT =====")
    for k, v in report.items():
        print(k, ":", v)
