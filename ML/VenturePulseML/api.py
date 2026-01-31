from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from predict import VenturePulsePredictor

app = FastAPI()

predictor = VenturePulsePredictor()


class AnalyzeRequest(BaseModel):
    idea: str
    domain: str
    funding_total_usd: float
    funding_rounds: int
    years_since_founded: int
    years_since_last_funding: int
    usp: Optional[str] = None   # IMPORTANT


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    result = predictor.analyze_startup(
        user_idea_text=req.idea,
        domain_clean=req.domain,
        funding_total_usd=req.funding_total_usd,
        funding_rounds=req.funding_rounds,
        years_since_founded=req.years_since_founded,
        years_since_last_funding=req.years_since_last_funding,
        usp_text=req.usp,
    )
    return result
