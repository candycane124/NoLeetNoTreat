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

document.getElementById('linkAccount').addEventListener('click', async () => {
    const username = document.getElementById('leetcode-username').value;

    if (username) {
        // Store the username in Chrome storage for future use
        
        chrome.storage.sync.set({ leetcodeUsername: username }, () => {
            document.getElementById('status').textContent = `LeetCode account linked: ${username}`;
        });

        // Optionally, fetch user data from LeetCode API or scrape the website
        const userData = await fetchLeetCodeUserData(username);
        console.log('User data:', userData);

        if (userData || username !== null) {
            // Update UI based on fetched data
            document.getElementById('login').innerHTML = '';
            document.getElementById('login-status').innerHTML = `
                <p>Welcome back ${username}!</p>
                <p>Problems solved: ${userData.totalSolved}</p>
            `;
            // window.username = username;
            localStorage.setItem('username', username);
        } else {
            document.getElementById('leetcode-username').innerHTML = ''; // Clear the input field
            document.getElementById('login-status').textContent = 'Failed to fetch user';
        }
    }
});

async function fetchLeetCodeUserData(username) {
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`; // Example of unofficial LeetCode API
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching LeetCode data:', error);
        return null;
    }
}