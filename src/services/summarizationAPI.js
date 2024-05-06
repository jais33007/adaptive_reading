import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';  

const summarizeParagraph = async (paragraph) => {
  try {
    const response = await axios.post(`${BASE_URL}/summarize`, { paragraph });
    return response.data.summary;
  } catch (error) {
    console.error('Error summarizing paragraph:', error);
    return '';  // Handle errors gracefully (e.g., display an error message)
  }
};

export { summarizeParagraph };
