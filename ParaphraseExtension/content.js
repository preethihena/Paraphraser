// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     const { action, text } = message;
//     if (action === 'paraphrase') {
//         displayText(action, text || 'No text received.');
//     } else if (action === 'summarize') {
//         displayText(action, text || 'No text received.');
//     } else if (action === 'explain') {
//         displayText(action, text || 'No text received.');
//     }
// });

// function displayText(action, text) {
//     // Create or get the chat box container
//     console.log(action);
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


//         // Close button
//         const closeButton = document.createElement('button');
//         closeButton.textContent = 'Close';
//         closeButton.style.float = 'right';
//         closeButton.onclick = () => document.body.removeChild(box);
//         box.appendChild(closeButton);

//         // Chat log container
//         const chatLog = document.createElement('div');
//         chatLog.id = 'chatLog';
//         chatLog.style.marginTop = '10px';
//         chatLog.style.maxHeight = '300px';
//         chatLog.style.overflowY = 'auto';
//         box.appendChild(chatLog);


//         // Chat input
//         const chatInput = document.createElement('input');
//         chatInput.type = 'text';
//         chatInput.id = 'chatInput';
//         chatInput.placeholder = 'Type here...';
//         chatInput.style.width = '100%';
//         chatInput.style.marginBottom = '10px';
//         box.appendChild(chatInput);

//         // Add event listener for Enter key
//         chatInput.addEventListener('keydown', (event) => {
//             if (event.key === 'Enter') {
//                 const query = chatInput.value.trim();
//                 if (query) {
//                     appendToChatLog(`You: ${query}`);
//                     chatInput.value = '';
//                     handleAction('custom', query);
//                 }
//             }
//         });

//         // Button container
//         const buttonContainer = document.createElement('div');
//         buttonContainer.style.display = 'flex';
//         buttonContainer.style.justifyContent = 'space-between';

//         // Summary button
//         const summarizeButton = document.createElement('button');
//         summarizeButton.textContent = 'Summarize';
//         summarizeButton.onclick = () => {
//         const query = chatInput.value.trim();
//         if (query) {
//             appendToChatLog(`You: ${query}`);
//             handleAction('summarize', query);
//         } else {
//             handleAction('summarize');
//         }
//         };
//         buttonContainer.appendChild(summarizeButton);

//         // Explain button
//         const explainButton = document.createElement('button');
//         explainButton.textContent = 'Explain';
//         explainButton.onclick = () => {
//         const query = chatInput.value.trim();
//         if (query) {
//             appendToChatLog(`You: ${query}`);
//             handleAction('explain', query);
//         } else {
//             handleAction('explain');
//         }
//         };
//         buttonContainer.appendChild(explainButton);

//         // Paraphrase button
//         const paraphraseButton = document.createElement('button');
//         paraphraseButton.textContent = 'Paraphrase';
//         paraphraseButton.onclick = () => {
//         const query = chatInput.value.trim();
//         if (query) {
//             appendToChatLog(`You: ${query}`);
//             handleAction('paraphrase', query);
//         } else {
//             handleAction('paraphrase');
//         }
//         };
//         buttonContainer.appendChild(paraphraseButton);

//         box.appendChild(buttonContainer);

//         document.body.appendChild(box);
//     }

//     // Function to handle actions
//     function handleAction(action, query) {
//         const chatLog = document.getElementById('chatLog');
//         const latestQuery = query || getLastYouText();
//         if (!latestQuery) return;

//         // Send message to background script
//         chrome.runtime.sendMessage({ action: action, text: latestQuery }, (response) => {
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

//             // Add buttons
//             addCopyButton(responseElem, responseText);
//             addEditButton(responseElem, response);
//             addRetryButton(responseElem, action, latestQuery);

//             chatLog.appendChild(responseElem);
//             chatLog.scrollTop = chatLog.scrollHeight;
//         });
//     }

//     // Function to append text to the chat log
//     function appendToChatLog(text) {
//         const chatLog = document.getElementById('chatLog');
//         const newMessage = document.createElement('div');
//         newMessage.textContent = text;

//         // Add buttons
//         addCopyButton(newMessage, text);
//         addEditButton(newMessage, text.replace('You: ', ''));

//         chatLog.appendChild(newMessage);
//         chatLog.scrollTop = chatLog.scrollHeight;
//     }

//     // Function to add a copy button
//     function addCopyButton(element, text) {
//         const copyButton = document.createElement('button');
//         copyButton.textContent = 'Copy';
//         copyButton.style.marginLeft = '10px';
//         copyButton.onclick = () => {
//             navigator.clipboard.writeText(text).then(() => {
//                 console.log('Text copied to clipboard');
//             }).catch(err => {
//                 console.error('Error copying text to clipboard:', err);
//             });
//         };
//         element.appendChild(copyButton);
//     }

//     // Function to add a retry button
//     function addRetryButton(element, action, text) {
//         const retryButton = document.createElement('button');
//         retryButton.textContent = 'Retry';
//         retryButton.style.marginLeft = '5px';
//         retryButton.onclick = () => handleAction(action, text);
//         element.appendChild(retryButton);
//     }

//     // Function to add an edit button
//     function addEditButton(element, text) {
//         const editButton = document.createElement('button');
//         editButton.textContent = 'Edit';
//         editButton.style.marginLeft = '5px';
//         editButton.onclick = () => {
//             const chatInput = document.getElementById('chatInput');
//             chatInput.value = text;
//             chatInput.focus();
//         };
//         element.appendChild(editButton);
//     }

//     // Function to get the last "You: text" from the chat log
//     function getLastYouText() {
//         const chatLog = document.getElementById('chatLog');
//         const latestQueryElem = Array.from(chatLog.children).reverse().find(elem => elem.textContent.startsWith('You:'));
//         return latestQueryElem ? latestQueryElem.textContent.replace('You: ', '').trim() : null;
//     }

//     if (text) {
//         appendToChatLog(`You: ${text}`);
//         handleAction(action, text);
//     }
// }


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, text } = message;
    if (action === 'paraphrase') {
        displayText(action, text || 'No text received.');
    } else if (action === 'summarize') {
        displayText(action, text || 'No text received.');
    } else if (action === 'explain') {
        displayText(action, text || 'No text received.');
    }
});

function displayText(action, text) {
    // Create or get the chat box container
    console.log(action);
    let box = document.getElementById('resultBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'resultBox';
        box.style.position = 'fixed';
        box.style.bottom = '10px';
        box.style.right = '10px';
        box.style.width = '300px';
        box.style.backgroundColor = 'white';
        box.style.border = '1px solid lightgray';
        box.style.padding = '10px';
        box.style.zIndex = '1000';
        box.style.overflowY = 'auto';
        box.style.maxHeight = '400px';

        // Close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&#x2716;'; // Unicode character for "×"
        closeButton.className = 'icon-button close-button';
        closeButton.onclick = () => document.body.removeChild(box);
        box.appendChild(closeButton);

        // Chat log container
        const chatLog = document.createElement('div');
        chatLog.id = 'chatLog';
        chatLog.style.marginTop = '10px';
        chatLog.style.maxHeight = '300px';
        chatLog.style.overflowY = 'auto';
        box.appendChild(chatLog);

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
                    handleAction('custom', query);
                }
            }
        });

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Summary button
        const summarizeButton = document.createElement('button');
        summarizeButton.textContent = 'Summarize';
        summarizeButton.onclick = () => {
            const query = chatInput.value.trim();
            if (query) {
                appendToChatLog(`You: ${query}`);
                handleAction('summarize', query);
            } else {
                handleAction('summarize');
            }
        };
        buttonContainer.appendChild(summarizeButton);

        // Explain button
        const explainButton = document.createElement('button');
        explainButton.textContent = 'Explain';
        explainButton.onclick = () => {
            const query = chatInput.value.trim();
            if (query) {
                appendToChatLog(`You: ${query}`);
                handleAction('explain', query);
            } else {
                handleAction('explain');
            }
        };
        buttonContainer.appendChild(explainButton);

        // Paraphrase button
        const paraphraseButton = document.createElement('button');
        paraphraseButton.textContent = 'Paraphrase';
        paraphraseButton.onclick = () => {
            const query = chatInput.value.trim();
            if (query) {
                appendToChatLog(`You: ${query}`);
                handleAction('paraphrase', query);
            } else {
                handleAction('paraphrase');
            }
        };
        buttonContainer.appendChild(paraphraseButton);

        box.appendChild(buttonContainer);

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

            // Add buttons
            addCopyButton(responseElem, responseText);
            addEditButton(responseElem, response);
            addRetryButton(responseElem, action, latestQuery);

            chatLog.appendChild(responseElem);
            chatLog.scrollTop = chatLog.scrollHeight;
        });
    }

    // Function to append text to the chat log
    function appendToChatLog(text) {
        const chatLog = document.getElementById('chatLog');
        const newMessage = document.createElement('div');
        newMessage.textContent = text;

        // Add buttons
        addCopyButton(newMessage, text);
        addEditButton(newMessage, text.replace('You: ', ''));

        chatLog.appendChild(newMessage);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    // Function to add a copy button
    function addCopyButton(element, text) {
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '&#x1F4CB;'; // Unicode character for "📋"
        copyButton.className = 'icon-button copy-button';
        copyButton.onclick = () => {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.error('Error copying text to clipboard:', err);
            });
        };
        element.appendChild(copyButton);
    }

    // Function to add a retry button
    function addRetryButton(element, action, text) {
        const retryButton = document.createElement('button');
        retryButton.innerHTML = '&#x21BB;'; // Unicode character for "↻"
        retryButton.className = 'icon-button retry-button';
        retryButton.onclick = () => handleAction(action, text);
        element.appendChild(retryButton);
    }

    // Function to add an edit button
    function addEditButton(element, text) {
        const editButton = document.createElement('button');
        editButton.innerHTML = '&#x270E;'; // Unicode character for "✎"
        editButton.className = 'icon-button edit-button';
        editButton.onclick = () => {
            const chatInput = document.getElementById('chatInput');
            chatInput.value = text;
            chatInput.focus();
        };
        element.appendChild(editButton);
    }

    // Function to get the last "You: text" from the chat log
    function getLastYouText() {
        const chatLog = document.getElementById('chatLog');
        const latestQueryElem = Array.from(chatLog.children).reverse().find(elem => elem.textContent.startsWith('You:'));
        return latestQueryElem ? latestQueryElem.textContent.replace('You: ', '').trim() : null;
    }

    if (text) {
        appendToChatLog(`You: ${text}`);
        handleAction(action, text);
    }
}
