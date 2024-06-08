from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from Backend.paraphrasing_module import paraphrase
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ParaphraseRequest(BaseModel):
    text: str

class ParaphraseResponse(BaseModel):
    paraphrased_text: str

@app.post("/paraphrase", response_model=ParaphraseResponse)
async def paraphrase_text(request: ParaphraseRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="No text provided")
    print("Reached here")
    paraphrased_text = paraphrase(request.text)
    return ParaphraseResponse(paraphrased_text=paraphrased_text)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
