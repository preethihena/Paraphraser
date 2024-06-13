// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'paraphrase') {
        const { text } = message;
        // Here, you would send the text to an API endpoint for paraphrasing
        // For demonstration purposes, let's assume the text is paraphrased immediately
        paraphraseText(text).then(paraphrasedText => {
            // Send the paraphrased text back to the background script
            sendResponse({ paraphrasedText });
            // Display the paraphrased text on the web page
            showParaphrasedText(paraphrasedText);
        }).catch(error => {
            console.error('Error paraphrasing text:', error);
            sendResponse({ paraphrasedText: null });
        });
        return true; // Keep the message channel open for asynchronous response
    }
});

// Function to paraphrase text
async function paraphraseText(textToParaphrase) {
    if (textToParaphrase !== '') {
        try {
            const response = await fetch('http://localhost:8000/paraphrase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: textToParaphrase }) // Use textToParaphrase for the body
            });

            console.log("Response status:", response.status); // Debugging line
            const data = await response.json();
            console.log("Response data:", data); // Debugging line

            if (data.paraphrased_text) { // Adjust this according to your API response structure
                return data.paraphrased_text;
            } else {
                return 'No paraphrased text returned.';
            }
        } catch (error) {
            console.error('Error:', error); // Log any errors encountered during fetch
            return 'Error paraphrasing text.';
        }
    } else {
        console.log("No text to paraphrase."); // Debugging line
        return 'No text to paraphrase.';
    }
}

// Function to display the paraphrased text in a box
function showParaphrasedText(paraphrasedText) {

    console.log(paraphrasedText); 
    // Check if the box already exists
    let box = document.getElementById('paraphraseBox');
    if (!box) {
        // Create the box if it doesn't exist
        box = document.createElement('div');
        box.id = 'paraphraseBox';
        box.style.border = '1px solid #ccc';
        box.style.padding = '10px';
        box.style.marginTop = '10px';
        box.style.backgroundColor = '#f9f9f9';
        box.style.position = 'fixed';
        box.style.bottom = '10px';
        box.style.right = '10px';
        box.style.zIndex = '1000';
        
        // Create the header with refresh button
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.marginBottom = '10px';
        
        const title = document.createElement('h2');
        title.textContent = 'Paraphrased Text';
        title.style.fontSize = '16px';
        title.style.margin = '0';
        header.appendChild(title);

        
        // Refresh button
        const refreshButton = document.createElement('button');
        refreshButton.textContent = 'Refresh';
        refreshButton.style.padding = '5px 10px';
        refreshButton.style.cursor = 'pointer';
        refreshButton.onclick = () => {
            // Send message to background script to re-paraphrase the original text
            console.log("Click performed"); 
            chrome.runtime.sendMessage({ action: 'paraphrase', text: paraphrasedText }, (response) => {
                if (response && response.paraphrasedText) {
                    showParaphrasedText(response.paraphrasedText, paraphrasedText);
                }
            });
        };
        header.appendChild(refreshButton);

        // Copy button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.padding = '5px 10px';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(paraphrasedText).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.error('Error copying text to clipboard:', err);
            });
        };
        header.appendChild(copyButton);

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => {
            box.style.display = 'none';
        };
        header.appendChild(closeButton);

        
        box.appendChild(header);
        
        // Create the content area for the paraphrased text
        const content = document.createElement('div');
        content.id = 'paraphraseContent';
        box.appendChild(content);
        
        // Append the box to the document body
        document.body.appendChild(box);
    }
    
    // Update the content area with the paraphrased text
    const content = document.getElementById('paraphraseContent');
    content.textContent = paraphrasedText;
    
    // Show the box
    box.style.display = 'block';
}

