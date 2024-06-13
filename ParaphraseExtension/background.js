// background.js
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "paraphraseContextMenu",
      title: "Paraphrase Selected Text",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "paraphraseContextMenu") {
      const selectedText = info.selectionText;
      
      // Send the selected text to the content script for paraphrasing
      chrome.tabs.sendMessage(tab.id, { action: "paraphrase", text: selectedText }, (response) => {
        if (response && response.paraphrasedText) {
          // Log the paraphrased text received from the content script
          console.log("Paraphrased text:", response.paraphrasedText);
        } else {
          console.error("Error: No paraphrased text received.");
        }
      });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'paraphrase') {
          try {
            // Send the selected text to the content script for paraphrasing
          console.log(message);
          chrome.tabs.sendMessage(sender.tab.id, { action: "paraphrase", text: message.text }, (response) => {
          if (response && response.paraphrasedText) {
            // Log the paraphrased text received from the content script
            console.log("Paraphrased text:", response.paraphrasedText);
          } else {
            console.error("Error: No paraphrased text received.");
          }
        });

        } catch (error) {
            console.error('Error processing paraphrase message:', error.message);
            sendResponse({ error: error.message });
        }
    } else {
        // Log unrecognized actions
        console.warn('Unrecognized action:', message.action);
        sendResponse({ error: 'Unrecognized action' });
    }

    return true; // Keep the message channel open for asynchronous response
});


  


  