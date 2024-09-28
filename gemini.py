import google.generativeai as genai
import os, json
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key='AIzaSyCuWT1VSMOR3ZhX3QjACaJZvmNOWUlBVwo')

model = genai.GenerativeModel('gemini-1.5-flash')

notes = """lace trendy jacket made of cotton in china"""

def generateCards(notes):


    
    response = model.generate_content("Convince the customer why the following piece of clothing is fast fashion and convince them not to follow through with the purpose based on the following (limit to 2 bullet points per topic and a max of 200 words):" + notes)
    response_text = response.text
    print(response_text)

    # Write the response to a JSON file
    with open('gemini.json', 'w') as json_file:
        json.dump({"content": response_text}, json_file)
    print(response)
    return response

result = generateCards(notes)
print(result)

# generateCards(notes)