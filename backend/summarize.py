
from flask import Flask, request, jsonify
import openai
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# Set your OpenAI API key here
openai.api_key = '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'

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    paragraph = data.get('paragraph')
    print (paragraph)
    
    response = openai.Completion.create(
    engine="davinci-002",
    prompt=paragraph,
    max_tokens=100,
    temperature=0.6, 
    )
    
    summary = response.choices[0].text

    sentence_endings = [".", "!", "?"]
    last_sentence = summary.split(".")[-1].strip()
    
    if not any(last_sentence.endswith(p) for p in sentence_endings):
        last_full_stop_index = summary.rfind(".")
        if last_full_stop_index != -1:
            summary = summary[:last_full_stop_index + 1]

    return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)  
