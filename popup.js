document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("code-button").addEventListener("click", openCode);
});

function openCode() {
    console.log("opening");
    chrome.tabs.create({ url: "./code.html"});
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

        // Update UI based on fetched data
        document.getElementById('status').textContent += `\nFetched data: ${JSON.stringify(userData)}`;
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