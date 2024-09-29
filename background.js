chrome.runtime.onInstalled.addListener(() => {
    // Setup when extension is installed
    chrome.storage.sync.get('leetcodeUsername', ({ leetcodeUsername }) => {
        if (leetcodeUsername) {
            console.log('LeetCode account linked:', leetcodeUsername);
        }
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openSidePanel") {
      console.log("Received request to open side panel");
  
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        let currentTab = tabs[0];
        console.log("Current Tab:", currentTab);
  
        if (chrome.sidePanel) {
          chrome.sidePanel.open({ tabId: currentTab.id });
        } else {
          chrome.tabs.create({ url: "./code.html" });
        }
      });
    }
});
  