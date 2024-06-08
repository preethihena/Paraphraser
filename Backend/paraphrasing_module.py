# This is a placeholder. Implement your paraphrasing logic here.
import os
import requests
import json



def paraphrase(text):
    print("selected_text:{}".format(text))
    try:
        payload = {
            "model": "llama3",
            "prompt": f"Paraphrase the text in a professional way : {text}",
            "stream": False
        }

        api_url = "http://localhost:11434/api/generate"
        response = requests.post(api_url, json=payload)

        if response.status_code == 200:
            responses = response.content.split(b'\n')
            generated_text = ''
            for obj in responses:
                if obj:
                    response_data = json.loads(obj.decode())
                    response = response_data.get("response")
                    if response:
                        if response.strip():
                            if generated_text:
                                generated_text += ' ' + response.strip()
                            else:
                                generated_text = response.strip()
            print(generated_text)
            return generated_text
        else:
            print(f"Error: Failed to generate text. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

