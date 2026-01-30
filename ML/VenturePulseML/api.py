from fastapi import FastAPI
from pydantic import BaseModel
from predict import VenturePulsePredictor

app = FastAPI(title="VenturePulse AI Service")

# Load predictor ONCE at startup
predictor = VenturePulsePredictor()


# -------- Request Schema --------
class AnalyzeRequest(BaseModel):
    idea: str
    domain: str
    funding_total_usd: float
    funding_rounds: int
    years_since_founded: int
    years_since_last_funding: int


# -------- Response Endpoint --------
@app.post("/analyze")
def analyze_startup(req: AnalyzeRequest):
    report = predictor.analyze_startup(
        user_idea_text=req.idea,
        domain_clean=req.domain,
        funding_total_usd=req.funding_total_usd,
        funding_rounds=req.funding_rounds,
        years_since_founded=req.years_since_founded,
        years_since_last_funding=req.years_since_last_funding
    )

    return report
