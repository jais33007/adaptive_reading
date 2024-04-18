from flask import Flask, request, jsonify
import transformers
from transformers import pipeline
from flask_cors import CORS


app = Flask(__name__)
CORS(app, origins=['http://localhost:3000']) 


summarizer = pipeline("summarization")  # Initialize summarizer

@app.route('/summarize', methods=['POST'])
def summarize():
  """Summarizes a paragraph received in the request body."""
  data = request.get_json()
  paragraph = data.get('paragraph')

  try:
    summary = summarizer(paragraph, max_length=100, min_length=30, truncation=True)
    return jsonify({'summary': summary[0]['summary_text']})
  except Exception as e:
    return jsonify({'error': str(e)}), 500  # Return error message and status code

if __name__ == '__main__':
  app.run(debug=True)  # Run the Flask app in debug mode

