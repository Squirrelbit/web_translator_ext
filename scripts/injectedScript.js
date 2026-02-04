console.log("Content Script Loaded and Ready");

window.addEventListener('dblclick', () => {
  // Get selected text and clean up whitespace
  const selection = window.getSelection().toString().trim();

  if (selection.length > 0) {
    console.log("Word clicked:", selection);

    // Send message to background worker
    try {
        chrome.runtime.sendMessage({ 
            type: "SELECTED_TEXT", 
            text: selection 
            });
        }
        catch
            { console.warn("Side Panel might be closed"); }
  }
});