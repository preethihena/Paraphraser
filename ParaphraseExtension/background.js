// // background.js
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.contextMenus.create({
//       id: "paraphraseContextMenu",
//       title: "Paraphrase Selected Text",
//       contexts: ["selection"]
//     });
//   });
  
//   chrome.contextMenus.onClicked.addListener((info, tab) => {
//     if (info.menuItemId === "paraphraseContextMenu") {
//       const selectedText = info.selectionText;
      
//       // Send the selected text to the content script for paraphrasing
//       chrome.tabs.sendMessage(tab.id, { action: "paraphrase", text: selectedText }, (response) => {
//         if (response && response.paraphrasedText) {
//           // Log the paraphrased text received from the content script
//           console.log("Paraphrased text:", response.paraphrasedText);
//         } else {
//           console.error("Error: No paraphrased text received.");
//         }
//       });
//     }
//   });

//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'paraphrase') {
//           try {
//             // Send the selected text to the content script for paraphrasing
//           console.log(message);
//           chrome.tabs.sendMessage(sender.tab.id, { action: "paraphrase", text: message.text }, (response) => {
//           if (response && response.paraphrasedText) {
//             // Log the paraphrased text received from the content script
//             console.log("Paraphrased text:", response.paraphrasedText);
//           } else {
//             console.error("Error: No paraphrased text received.");
//           }
//         });

//         } catch (error) {
//             console.error('Error processing paraphrase message:', error.message);
//             sendResponse({ error: error.message });
//         }
//     } else {
//         // Log unrecognized actions
//         console.warn('Unrecognized action:', message.action);
//         sendResponse({ error: 'Unrecognized action' });
//     }

//     return true; // Keep the message channel open for asynchronous response
// });


chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
      id: "summarize",
      title: "Summarize",
      contexts: ["selection"]
  });
  chrome.contextMenus.create({
      id: "explain",
      title: "Explain",
      contexts: ["selection"]
  });
  chrome.contextMenus.create({
      id: "paraphrase",
      title: "Paraphrase",
      contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "summarize" || info.menuItemId === "explain" || info.menuItemId === "paraphrase"|| action === 'custom') {
      chrome.tabs.sendMessage(tab.id, { action: info.menuItemId, text: info.selectionText });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action, text } = message;
  if (action === 'paraphrase' || action === 'summarize' || action === 'explain' || action === 'custom') {
      processText(text, action.toUpperCase()).then(response => sendResponse(response)).catch(error => handleError(error, sendResponse));
  }
  return true; // Keep the message channel open for asynchronous response
});

async function processText(text, promptType) {
  if (text) {
      try {
          const response = await fetch('http://localhost:8000/process-prompt', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: text, prompt_type: promptType }) // Use textToParaphrase for the body
          });

          console.log("Response status:", response.status); // Debugging line
          const data = await response.json();
          console.log("Response data:", data); // Debugging line

          if (data.text) { // Adjust this according to your API response structure
              return data.text;
          } else {
              return 'No text returned.';
          }
      } catch (error) {
          console.error('Error:', error); // Log any errors encountered during fetch
          return `Error processing text for ${promptType}.`;
      }
  } else {
      console.log("No text to process."); // Debugging line
      return 'No text to process.';
  }
}

function handleError(error, sendResponse) {
  console.error('Error processing text:', error);
  sendResponse({ error: 'Error processing text' });
}
