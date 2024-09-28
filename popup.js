document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded");
    document.getElementById("code-button").addEventListener("click", openCode);
});

async function openCode() {
    console.log("opening");

    try {
        let tab = await getCurrentTab();
        console.log(tab);
        if (chrome.sidePanel) {
            console.log("hey");
            chrome.sidePanel.open({ tabId: tab.id });
        } else {
            chrome.tabs.create({ url: "./code.html"});
        }
    } catch (error) {
        console.error("Error getting current tab:", error);
    }
}

function getCurrentTab() {
    return new Promise((resolve, reject) => {
        let queryOptions = { active: true, currentWindow: true };
        chrome.tabs.query(queryOptions, (tabs) => {
            console.log(tabs);
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(tabs[0]);
            }
        });
    });
}
