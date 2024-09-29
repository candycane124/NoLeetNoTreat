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

document.addEventListener('DOMContentLoaded', async () => {
    // First, check if a username exists in Chrome storage or localStorage
    const savedUsername = await getStoredUsername();

    if (savedUsername) {
        // Username is already stored, fetch the user data and skip the input prompt
        document.getElementById('login').style.display = 'none';  // Hide the login section
        const savedUser = await fetchLeetCodeUserData(savedUsername);
        console.log('User data:', savedUser);
        document.getElementById('login-status').innerHTML = `
        <p>Welcome back ${savedUsername}!</p>
        <p>Problems solved: ${savedUser.totalSolved}</p>
    `;
    }
});

async function getStoredUsername() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['leetcodeUsername'], (result) => {
            if (result.leetcodeUsername) {
                resolve(result.leetcodeUsername); // Username found in Chrome storage
            } else {
                resolve(localStorage.getItem('username')); // Try localStorage as a fallback
            }
        });
    });
}

document.getElementById('logout').addEventListener('click', () => {
    // Clear the stored username from Chrome storage and localStorage
    chrome.storage.sync.remove('leetcodeUsername');
    localStorage.removeItem('username');
    document.getElementById('login').style.display = 'block'; // Show the login section
    document.getElementById('login-status').innerHTML = ''; // Hide the login status
});

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

        if (userData) {
            // Update UI based on fetched data
            document.getElementById('login').style.display = 'none'; // Hide the login section
            document.getElementById('login-status').innerHTML = `
                <p>Welcome back ${username}!</p>
                <p>Problems solved: ${userData.totalSolved}</p>
            `;
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