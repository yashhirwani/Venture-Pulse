import joblib
import pandas as pd
import numpy as np
from similarity import SimilarityEngine

MODEL_PATH = "models/risk_model.joblib"
ML_DATA_PATH = "data/startup_ml_clean.csv"


class VenturePulsePredictor:
    def __init__(self):
        print("Loading risk model...")
        self.model = joblib.load(MODEL_PATH)

        print("Loading ML dataset for market stats...")
        self.ml_df = pd.read_csv(ML_DATA_PATH)

        print("Loading similarity engine...")
        self.sim_engine = SimilarityEngine()

        print("✅ VenturePulse Predictor Ready")

    # -----------------------------
    # Market Signals
    # -----------------------------
    def _compute_market_signals(self, similar_startups):
        domains = [s['domain'] for s in similar_startups if s['domain']]
        domain = domains[0] if domains else None

        if domain and domain in self.ml_df['domain_clean'].values:
            domain_df = self.ml_df[self.ml_df['domain_clean'] == domain]
        else:
            domain_df = self.ml_df

        failed_rate = domain_df['status_failed'].mean()
        avg_funding = domain_df['funding_total_usd'].mean()
        avg_years_since_funding = domain_df['years_since_last_funding'].mean()

        crowdedness = len(domain_df)

        signals = {
            "domain": domain,
            "failed_rate": round(float(failed_rate), 3),
            "avg_funding": round(float(avg_funding), 2),
            "avg_years_since_last_funding": round(float(avg_years_since_funding), 2),
            "crowdedness": crowdedness
        }

        return signals

    # -----------------------------
    # Launch Timing Predictor
    # -----------------------------
    def _predict_launch_timing(self, domain_clean):
        """
        Predict how soon the product should be launched based on market momentum.
        Uses years_since_founded as proxy for new company entry.
        """

        if domain_clean in self.ml_df['domain_clean'].values:
            domain_df = self.ml_df[self.ml_df['domain_clean'] == domain_clean]
        else:
            domain_df = self.ml_df

        total_startups = len(domain_df)

        # Startups founded in last 2 years
        recent_startups = domain_df[domain_df['years_since_founded'] <= 2]
        recent_count = len(recent_startups)

        if total_startups == 0:
            return {
                "market_speed": "Unknown",
                "recent_entry_rate": 0,
                "recommended_launch_window": "Unknown",
                "reason": "Insufficient market data"
            }

        recent_ratio = recent_count / total_startups

        if recent_ratio > 0.25:
            market_speed = "Heating Up"
            launch_window = "Launch MVP within 3–4 months"
            reason = "Many new startups are entering this market rapidly"
        elif recent_ratio > 0.12:
            market_speed = "Moderate Growth"
            launch_window = "Launch within 6–8 months"
            reason = "Steady new entrants, competition increasing"
        else:
            market_speed = "Slow / Early"
            launch_window = "Safe window: 9–12 months"
            reason = "Few new entrants, market still early or slow"

        return {
            "market_speed": market_speed,
            "recent_entry_rate": round(recent_ratio, 3),
            "recommended_launch_window": launch_window,
            "reason": reason
        }

    # -----------------------------
    # Explanation Engine
    # -----------------------------
    def _generate_explanations(self, risk_score, signals, launch_timing):
        reasons = []

        if signals['failed_rate'] > 0.6:
            reasons.append("High historical failure rate in this domain")

        if signals['avg_years_since_last_funding'] > 4:
            reasons.append("Long gap since last funding is common in this market")

        if signals['avg_funding'] < 2_000_000:
            reasons.append("Low average funding in this domain")

        if signals['crowdedness'] > 5000:
            reasons.append("Highly crowded market with many competitors")

        if launch_timing['market_speed'] == "Heating Up":
            reasons.append("Market is heating up — competition is increasing quickly")

        if risk_score > 0.7:
            reasons.append("Overall model predicts high failure risk")

        if not reasons:
            reasons.append("Market indicators are relatively neutral")

        return reasons

    # -----------------------------
    # MAIN ANALYSIS PIPELINE
    # -----------------------------
    def analyze_startup(self, user_idea_text, domain_clean,
                        funding_total_usd, funding_rounds,
                        years_since_founded, years_since_last_funding):

        print("\n--- Analyzing New Startup ---")
        print("Idea:", user_idea_text)

        # 1. Similarity Search
        similar = self.sim_engine.find_similar_startups(
            user_idea_text, top_n=5
        )

        # 2. Market Signals
        signals = self._compute_market_signals(similar)

        # 2B. Launch Timing
        launch_timing = self._predict_launch_timing(domain_clean)

        # 3. ML Risk Prediction
        input_df = pd.DataFrame([{
            "funding_total_usd": funding_total_usd,
            "funding_rounds": funding_rounds,
            "years_since_founded": years_since_founded,
            "years_since_last_funding": years_since_last_funding,
            "domain_clean": domain_clean
        }])

        risk_proba = self.model.predict_proba(input_df)[0, 1]
        risk_score = float(risk_proba)

        # 4. Explanations
        reasons = self._generate_explanations(
            risk_score, signals, launch_timing
        )

        # 5. Final Report
        report = {
            "idea": user_idea_text,
            "domain": domain_clean,
            "risk_score": round(risk_score, 3),
            "risk_label": (
                "High" if risk_score > 0.7 else
                "Medium" if risk_score > 0.4 else
                "Low"
            ),
            "similar_startups": similar,
            "market_signals": signals,
            "launch_timing": launch_timing,
            "explanations": reasons
        }

        return report


# -----------------------------
# Manual Test
# -----------------------------
if __name__ == "__main__":
    predictor = VenturePulsePredictor()

    test_report = predictor.analyze_startup(
        user_idea_text="AI tool for automating resume screening for HR teams",
        domain_clean="AI",
        funding_total_usd=500000,
        funding_rounds=1,
        years_since_founded=1,
        years_since_last_funding=1
    )

    print("\n===== VENTURE_PULSE REPORT =====")
    print("Risk Score:", test_report['risk_score'])
    print("Risk Label:", test_report['risk_label'])

    print("\nSimilar Startups:")
    for s in test_report['similar_startups']:
        print("-", s['startup_name'], "|", s['domain'], "|", round(s['similarity_score'], 3))

    print("\nMarket Signals:")
    for k, v in test_report['market_signals'].items():
        print(f"{k}: {v}")

    print("\nLaunch Timing Prediction:")
    for k, v in test_report['launch_timing'].items():
        print(f"{k}: {v}")

    print("\nExplanations:")
    for r in test_report['explanations']:
        print("-", r)
