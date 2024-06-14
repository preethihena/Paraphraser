from enum import Enum
from pydantic import BaseModel
from typing import Optional

class PromptType(Enum):
    PARAPHRASE = 'PARAPHRASE'
    SUMMARIZE = 'SUMMARIZE'
    EXPLAIN = 'EXPLAIN'
    CUSTOM = 'CUSTOM'

prompt_type_mapping = {
    PromptType.PARAPHRASE: 'Paraphrase the text',
    PromptType.SUMMARIZE: 'Summarize the text',
    PromptType.EXPLAIN: 'Explain the text in simpler terms',
    PromptType.CUSTOM: 'Answer the text'
}

class PromptRequest(BaseModel):
    text: str
    prompt_type: PromptType

class PromptResponse(BaseModel):
    text: str