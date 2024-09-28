chrome.runtime.onInstalled.addListener(() => {
    // Setup when extension is installed
    chrome.storage.sync.get('leetcodeUsername', ({ leetcodeUsername }) => {
        if (leetcodeUsername) {
            console.log('LeetCode account linked:', leetcodeUsername);
        }
    });
});
