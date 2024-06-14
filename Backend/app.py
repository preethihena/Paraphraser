from fastapi import FastAPI, HTTPException
from Backend.text_processing_module import handle_prompt_request
from fastapi.middleware.cors import CORSMiddleware
from Backend.types import PromptRequest, PromptResponse


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-prompt", response_model=PromptResponse)
async def process_prompt(request: PromptRequest):
    if not request.text:
        raise HTTPException(status_code=400, detail="No text provided")
    print("Reached here")
    response =  handle_prompt_request(request)
    return PromptResponse(text=response)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app)
