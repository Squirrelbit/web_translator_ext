chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SELECTED_TEXT") {
    chrome.runtime.sendMessage(message);
    sendResponse({ status: "success" });
  }
  return true;
});

