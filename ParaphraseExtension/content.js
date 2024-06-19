chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { action, text } = message;
                if (action === 'paraphrase') {
                    displayText(action, text || 'No  text received.');
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
                chatInput.value = response;
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
        handleAction(action, text);
    }
}



