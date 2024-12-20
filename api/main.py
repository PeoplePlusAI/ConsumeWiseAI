from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import your individual API apps
from .data_extractor import app as data_extractor_app
from .nutrient_analyzer import app as nutrient_analyzer_app
from .ingredients_analysis import app as ingredients_analyzer_app
from .claims_analysis import app as claims_analyzer_app
from .cumulative_analysis import app as cumulative_analyzer_app

main_app = FastAPI()

# Add CORS middleware
main_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount apps
main_app.mount("/data_extractor", data_extractor_app)
main_app.mount("/nutrient_analyzer", nutrient_analyzer_app)
main_app.mount("/ingredient_analysis", ingredients_analyzer_app)
main_app.mount("/claims_analysis", claims_analyzer_app)
main_app.mount("/cumulative_analysis", cumulative_analyzer_app)

# Optional: Add a root endpoint
@main_app.get("/")
async def root():
    return {"message": "Main application"}
