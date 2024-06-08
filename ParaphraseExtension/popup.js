// popup.js


document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('paraphrase').addEventListener('click', async () => {    
    const resultDiv = document.getElementById('textToParaphrase');
    const textToParaphrase = resultDiv.value.trim(); // Use value instead of textContent for input element
    resultDiv.style.display = 'none';

    console.log("Text to paraphrase:", textToParaphrase); // Debugging line

    if (textToParaphrase !== '') {
        try {
            const response = await fetch('http://localhost:8000/paraphrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToParaphrase }), // Use textToParaphrase for the body
            });

            console.log("Response status:", response.status); // Debugging line
            const data = await response.json();
            console.log("Response data:", data); // Debugging line

            if (data.paraphrased_text) {
                resultDiv.value = data.paraphrased_text; // Update value instead of textContent for input element
            } else {
                resultDiv.value = 'No paraphrased text returned.';
            }
            resultDiv.style.display = 'block';
        } catch (error) {
            console.error('Error:', error); // Log any errors encountered during fetch
            resultDiv.value = 'Error paraphrasing text.';
            resultDiv.style.display = 'block'; // Ensure the error message is visible
        }
    } else {
        console.log("No text to paraphrase."); // Debugging line
    }
  });
});


