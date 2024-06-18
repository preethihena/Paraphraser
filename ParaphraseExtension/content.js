// // Listen for messages from the background script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'paraphrase') {
//         const { text } = message;
//         // Here, you would send the text to an API endpoint for paraphrasing
//         // For demonstration purposes, let's assume the text is paraphrased immediately
//         paraphraseText(text).then(paraphrasedText => {
//             // Send the paraphrased text back to the background script
//             sendResponse({ paraphrasedText });
//             // Display the paraphrased text on the web page
//             showParaphrasedText(paraphrasedText);
//         }).catch(error => {
//             console.error('Error paraphrasing text:', error);
//             sendResponse({ paraphrasedText: null });
//         });
//         return true; // Keep the message channel open for asynchronous response
//     }
// });

// // Function to paraphrase text
// async function paraphraseText(textToParaphrase) {
//     if (textToParaphrase !== '') {
//         try {
//             const response = await fetch('http://localhost:8000/paraphrase', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ text: textToParaphrase }) // Use textToParaphrase for the body
//             });

//             console.log("Response status:", response.status); // Debugging line
//             const data = await response.json();
//             console.log("Response data:", data); // Debugging line

//             if (data.paraphrased_text) { // Adjust this according to your API response structure
//                 return data.paraphrased_text;
//             } else {
//                 return 'No paraphrased text returned.';
//             }
//         } catch (error) {
//             console.error('Error:', error); // Log any errors encountered during fetch
//             return 'Error paraphrasing text.';
//         }
//     } else {
//         console.log("No text to paraphrase."); // Debugging line
//         return 'No text to paraphrase.';
//     }
// }

// // Function to display the paraphrased text in a box
// function showParaphrasedText(paraphrasedText) {

//     console.log(paraphrasedText); 
//     // Check if the box already exists
//     let box = document.getElementById('paraphraseBox');
//     if (!box) {
//         // Create the box if it doesn't exist
//         box = document.createElement('div');
//         box.id = 'paraphraseBox';
//         box.style.border = '1px solid #ccc';
//         box.style.padding = '10px';
//         box.style.marginTop = '10px';
//         box.style.backgroundColor = '#f9f9f9';
//         box.style.position = 'fixed';
//         box.style.bottom = '10px';
//         box.style.right = '10px';
//         box.style.zIndex = '1000';
        
//         // Create the header with refresh button
//         const header = document.createElement('div');
//         header.style.display = 'flex';
//         header.style.justifyContent = 'space-between';
//         header.style.alignItems = 'center';
//         header.style.marginBottom = '10px';
        
//         const title = document.createElement('h2');
//         title.textContent = 'Paraphrased Text';
//         title.style.fontSize = '16px';
//         title.style.margin = '0';
//         header.appendChild(title);

        
//         // Refresh button
//         const refreshButton = document.createElement('button');
//         refreshButton.textContent = 'Refresh';
//         refreshButton.style.padding = '5px 10px';
//         refreshButton.style.cursor = 'pointer';
//         refreshButton.onclick = () => {
//             // Send message to background script to re-paraphrase the original text
//             console.log("Click performed"); 
//             chrome.runtime.sendMessage({ action: 'paraphrase', text: paraphrasedText }, (response) => {
//                 if (response && response.paraphrasedText) {
//                     showParaphrasedText(response.paraphrasedText, paraphrasedText);
//                 }
//             });
//         };
//         header.appendChild(refreshButton);

//         // Copy button
//         const copyButton = document.createElement('button');
//         copyButton.textContent = 'Copy';
//         copyButton.style.padding = '5px 10px';
//         copyButton.style.cursor = 'pointer';
//         copyButton.onclick = () => {
//             navigator.clipboard.writeText(paraphrasedText).then(() => {
//                 console.log('Text copied to clipboard');
//             }).catch(err => {
//                 console.error('Error copying text to clipboard:', err);
//             });
//         };
//         header.appendChild(copyButton);

//         // Close button
//         const closeButton = document.createElement('button');
//         closeButton.textContent = 'Close';
//         closeButton.style.padding = '5px 10px';
//         closeButton.style.cursor = 'pointer';
//         closeButton.onclick = () => {
//             box.style.display = 'none';
//         };
//         header.appendChild(closeButton);

        
//         box.appendChild(header);
        
//         // Create the content area for the paraphrased text
//         const content = document.createElement('div');
//         content.id = 'paraphraseContent';
//         box.appendChild(content);
        
//         // Append the box to the document body
//         document.body.appendChild(box);
//     }
    
//     // Update the content area with the paraphrased text
//     const content = document.getElementById('paraphraseContent');
//     content.textContent = paraphrasedText;
    
//     // Show the box
//     box.style.display = 'block';
// }

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, text } = message;
    if (action === 'paraphrase' || action === 'summarize' || action === 'explain') {
        chrome.runtime.sendMessage({ action, text }, response => {
            console.log("why not working")
            console.log(response)
            if (response) {
                if (action === 'paraphrase') {
                    displayText(response || 'No paraphrased text received.');
                } else if (action === 'summarize') {
                    displayText(response || 'No summarized text received.');
                } else if (action === 'explain') {
                    displayText(response || 'No explained text received.');
                }
            } else {
                console.error('Error: No response received.');
            }
        });
    }
});


// function displayText(text) {
//     // Create or get the chat box container
//     let box = document.getElementById('resultBox');
//     if (!box) {
//         box = document.createElement('div');
//         box.id = 'resultBox';
//         box.style.position = 'fixed';
//         box.style.bottom = '10px';
//         box.style.right = '10px';
//         box.style.width = '300px';
//         box.style.backgroundColor = '#f9f9f9';
//         box.style.border = '1px solid #ccc';
//         box.style.padding = '10px';
//         box.style.zIndex = '1000';
//         box.style.overflowY = 'auto';
//         box.style.maxHeight = '400px';

//         // Chat input
//         const chatInput = document.createElement('input');
//         chatInput.type = 'text';
//         chatInput.id = 'chatInput';
//         chatInput.placeholder = 'Type here...';
//         chatInput.style.width = '100%';
//         chatInput.style.marginBottom = '10px';
//         box.appendChild(chatInput);

//         // Button container
//         const buttonContainer = document.createElement('div');
//         buttonContainer.style.display = 'flex';
//         buttonContainer.style.justifyContent = 'space-between';

//         // Summary button
//         const summarizeButton = document.createElement('button');
//         summarizeButton.textContent = 'Summarize';
//         summarizeButton.onclick = () => handleAction('summarize', chatInput.value);
//         buttonContainer.appendChild(summarizeButton);

//         // Explain button
//         const explainButton = document.createElement('button');
//         explainButton.textContent = 'Explain';
//         explainButton.onclick = () => handleAction('explain', chatInput.value);
//         buttonContainer.appendChild(explainButton);

//         // Paraphrase button
//         const paraphraseButton = document.createElement('button');
//         paraphraseButton.textContent = 'Paraphrase';
//         paraphraseButton.onclick = () => handleAction('paraphrase', chatInput.value);
//         buttonContainer.appendChild(paraphraseButton);

//         box.appendChild(buttonContainer);

//         // Chat log container
//         const chatLog = document.createElement('div');
//         chatLog.id = 'chatLog';
//         chatLog.style.marginTop = '10px';
//         chatLog.style.maxHeight = '300px';
//         chatLog.style.overflowY = 'auto';
//         box.appendChild(chatLog);

//         document.body.appendChild(box);
//     }

//     // Function to handle actions
//     function handleAction(action, query) {
//         if (!query.trim()) return;

//         const chatLog = document.getElementById('chatLog');

//         // Create query element
//         const queryElem = document.createElement('div');
//         queryElem.textContent = `You: ${query}`;
//         queryElem.style.marginBottom = '5px';
//         chatLog.appendChild(queryElem);

//         // Send message to background script
//         chrome.runtime.sendMessage({ action: action, text: query }, (response) => {
//             let responseText;
//             console.log("In the chat");
//             console.log(response);
//             if (response) {
//                 responseText = `${action.charAt(0).toUpperCase() + action.slice(1)}d: ${response}`;
//             } else {
//                 responseText = `Error processing ${action}`;
//             }

//             const responseElem = document.createElement('div');
//             responseElem.style.marginBottom = '5px';

//             // Create response text element
//             const responseTextElem = document.createElement('span');
//             responseTextElem.textContent = responseText;
//             responseElem.appendChild(responseTextElem);

//             // Create copy button
//             const copyButton = document.createElement('button');
//             copyButton.textContent = 'Copy';
//             copyButton.style.marginLeft = '10px';
//             copyButton.onclick = () => {
//                 navigator.clipboard.writeText(responseText).then(() => {
//                     console.log('Text copied to clipboard');
//                 }).catch(err => {
//                     console.error('Error copying text to clipboard:', err);
//                 });
//             };
//             responseElem.appendChild(copyButton);

//             // Create edit button
//             const editButton = document.createElement('button');
//             editButton.textContent = 'Edit';
//             editButton.style.marginLeft = '5px';
//             editButton.onclick = () => {
//                 chatInput.value = query;
//                 chatInput.focus();
//             };
//             responseElem.appendChild(editButton);

//             // Create retry button
//             const retryButton = document.createElement('button');
//             retryButton.textContent = 'Retry';
//             retryButton.style.marginLeft = '5px';
//             retryButton.onclick = () => handleAction(action, query);
//             responseElem.appendChild(retryButton);

//             chatLog.appendChild(responseElem);
//             chatLog.scrollTop = chatLog.scrollHeight;
//         });
//     }

//     if (text) {
//         const chatLog = document.getElementById('chatLog');
//         const newMessage = document.createElement('div');
//         newMessage.textContent = text;
//         chatLog.appendChild(newMessage);

//         const chatInput = document.getElementById('chatInput');
//         chatInput.value = text;
//     }
// }

function displayText(text) {
    // Create or get the chat box container
    let box = document.getElementById('resultBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'resultBox';
        box.style.position = 'fixed';
        box.style.bottom = '10px';
        box.style.right = '10px';
        box.style.width = '300px';
        box.style.backgroundColor = '#f9f9f9';
        box.style.border = '1px solid #ccc';
        box.style.padding = '10px';
        box.style.zIndex = '1000';
        box.style.overflowY = 'auto';
        box.style.maxHeight = '400px';

        // Chat input
        const chatInput = document.createElement('input');
        chatInput.type = 'text';
        chatInput.id = 'chatInput';
        chatInput.placeholder = 'Type here...';
        chatInput.style.width = '100%';
        chatInput.style.marginBottom = '10px';
        box.appendChild(chatInput);

        // Add event listener for Enter key
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const query = chatInput.value.trim();
                if (query) {
                    appendToChatLog(`You: ${query}`);
                    chatInput.value = '';
                    handleAction('process', query);
                }
            }
        });

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';

        // Summary button
        const summarizeButton = document.createElement('button');
        summarizeButton.textContent = 'Summarize';
        summarizeButton.onclick = () => handleAction('summarize');
        buttonContainer.appendChild(summarizeButton);

        // Explain button
        const explainButton = document.createElement('button');
        explainButton.textContent = 'Explain';
        explainButton.onclick = () => handleAction('explain');
        buttonContainer.appendChild(explainButton);

        // Paraphrase button
        const paraphraseButton = document.createElement('button');
        paraphraseButton.textContent = 'Paraphrase';
        paraphraseButton.onclick = () => handleAction('paraphrase');
        buttonContainer.appendChild(paraphraseButton);

        box.appendChild(buttonContainer);

        // Chat log container
        const chatLog = document.createElement('div');
        chatLog.id = 'chatLog';
        chatLog.style.marginTop = '10px';
        chatLog.style.maxHeight = '300px';
        chatLog.style.overflowY = 'auto';
        box.appendChild(chatLog);

        document.body.appendChild(box);
    }

    // Function to handle actions
    function handleAction(action, query) {
        const chatLog = document.getElementById('chatLog');
        const latestQuery = query || getLastYouText();
        if (!latestQuery) return;

        // Send message to background script
        chrome.runtime.sendMessage({ action: action, text: latestQuery }, (response) => {
            let responseText;
            console.log("In the chat");
            console.log(response);
            if (response) {
                responseText = `${action.charAt(0).toUpperCase() + action.slice(1)}d: ${response}`;
            } else {
                responseText = `Error processing ${action}`;
            }

            const responseElem = document.createElement('div');
            responseElem.style.marginBottom = '5px';

            // Create response text element
            const responseTextElem = document.createElement('span');
            responseTextElem.textContent = responseText;
            responseElem.appendChild(responseTextElem);

            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.textContent = 'Copy';
            copyButton.style.marginLeft = '10px';
            copyButton.onclick = () => {
                navigator.clipboard.writeText(responseText).then(() => {
                    console.log('Text copied to clipboard');
                }).catch(err => {
                    console.error('Error copying text to clipboard:', err);
                });
            };
            responseElem.appendChild(copyButton);

            // Create edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.marginLeft = '5px';
            editButton.onclick = () => {
                const chatInput = document.getElementById('chatInput');
                chatInput.value = latestQuery;
                chatInput.focus();
            };
            responseElem.appendChild(editButton);

            // Create retry button
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry';
            retryButton.style.marginLeft = '5px';
            retryButton.onclick = () => handleAction(action, latestQuery);
            responseElem.appendChild(retryButton);

            chatLog.appendChild(responseElem);
            chatLog.scrollTop = chatLog.scrollHeight;
        });
    }

    // Function to append text to the chat log
    function appendToChatLog(text) {
        const chatLog = document.getElementById('chatLog');
        const newMessage = document.createElement('div');
        newMessage.textContent = text;
        chatLog.appendChild(newMessage);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Function to get the last "You: text" from the chat log
    function getLastYouText() {
        const chatLog = document.getElementById('chatLog');
        const latestQueryElem = Array.from(chatLog.children).reverse().find(elem => elem.textContent.startsWith('You:'));
        return latestQueryElem ? latestQueryElem.textContent.replace('You: ', '').trim() : null;
    }

    if (text) {
        appendToChatLog(`You: ${text}`);

        // const chatInput = document.getElementById('chatInput');
        // chatInput.value = text;

        // Process the recent "You: text" in the chat log
        handleAction('process', text);
    }
}

