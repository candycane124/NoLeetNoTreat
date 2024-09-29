// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("get-daily-button").addEventListener("click", findDaily);
// });
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("get-problem-button").addEventListener("click", findProblem);
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("get-credit-button").addEventListener("click", getCredit);
});

const baseURL = "https://alfa-leetcode-api.onrender.com";
const maxQs = 3300;

var currQuestion = localStorage.getItem("currTitleSlug");
var currTitle = localStorage.getItem("currTitle");
if (!currQuestion) currQuestion = "";
if (currTitle) document.getElementById("completed").innerHTML = `<div class="blurb">Finished solving ${currTitle}?</div><button id="get-credit-button">Get Credit</button>`;
else currTitle = "";

function displayCurrItem() {
    chrome.storage.local.get("currItem", function(result) {
        console.log("Retrieved from extension storage:", result.currItem);
        localStorage.setItem("currItem", result.currItem);
    });
    var currItem = localStorage.getItem("currItem");
    if (currItem) document.getElementById("instruction").innerHTML = `Complete a LeetCode problem before you buy ${currItem}! Remember to log into your linked LeetCode account.`;
    else document.getElementById("instruction").innerHTML = `Practice your coding skills on LeetCode!`;    
}
displayCurrItem();

function storeAll(json) {
    console.log("storing all q's");
    allQs = json.problemsetQuestionList;
    console.log(allQs);
    localStorage.setItem("allQs", allQs);
}
var allQs = localStorage.getItem("allQs");
if (!allQs) {
    console.log("getting all problems");
    fetch(`${baseURL}/problems?limit=${maxQs}`)
        .then((response) => response.json())
        .then((json) => storeAll(json))
        .catch((error) => console.error(`Error storing data: ${error.message}`));
}

// function findDaily() {
//     let url = `${baseURL}/daily`;
//     fetch(url)
//         .then((response) => response.json())
//         .then((json) => getProblem(json.titleSlug))
//         .catch((error) => console.error(`Error fetching data: ${error.message}`));
// }

async function findProblem() {
    let i = Math.floor(Math.random() * maxQs); //start at random question
    let diff = document.getElementById("difficulty").value;
    let filter = diff != "None";
    console.log("searching for problem, starting at", i);
    while (i < 3300) {
        let q = allQs[i];
        console.log("checking if problem is suitable", q);
        if (!filter || q.difficulty == diff) { //check difficulty match
            if (!q.isPaidOnly) { //check not paid only
                const alreadySolved = await checkProblem(q.titleSlug);
                if (!alreadySolved) { //check not solved recently
                    getProblem(q.titleSlug);
                    break;
                }
            }
        }
        i++;
    }
    if (i > 3300) {
        alert("Error occured while searching for problem, please try again.");
    }
    // getProblem("two-sum");
}

function getProblem(titleSlug) {
    let url = `${baseURL}/select?titleSlug=${titleSlug}`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => displayResults(json))
        .catch((error) => console.error(`Error getting data: ${error.message}`));
}

function displayResults(json) {
    currQuestion = json.titleSlug;
    currTitle = json.questionTitle;
    localStorage.setItem("currTitleSlug", currQuestion);
    localStorage.setItem("currTitle", currTitle);
    console.log("displaying results & setting currq!", currQuestion);
    let newText = `<div class='blurb'>Here is your question: ${currTitle}. Once you have an accepted submission, hit 'Get Credit' below! </div>`;
    document.getElementById("question").innerHTML = newText + json.question;
    document.getElementById("completed").innerHTML = `<div class="blurb">Finished solving ${currTitle}?</div><button id="get-credit-button">Get Credit</button>`;
    console.log(json);
    chrome.tabs.create({ url: json.link});
}

async function getCredit() {
    const problemSolved = await checkProblem(currQuestion);
    if (problemSolved) {
        alert("Congratulations, you've completed the LeetCode question! Refresh the page to get your Treat ;)");

        // Retrieve item_code from chrome storage
        chrome.storage.local.get("item_code", function(result) {
            const item_code = result.item_code; // Get the stored item_code
            if (!item_code) {
                console.error("No item_code found in storage.");
                return;  
            }

            // Check if allowed_items exists in localStorage

            chrome.storage.local.get("allowed_items", function(data) {
                let allowed_items = data.allowed_items || { item_codes: [] };

                // Check if item_code is already in allowed_items
                if (!allowed_items.item_codes.includes(item_code)) {
                    allowed_items.item_codes.push(item_code); // Add new item_code to the array
                    chrome.storage.local.set({ allowed_items }, function() {
                        console.log("Allowed items updated:", allowed_items);
                    });
                } else {
                    console.log("Item code is already in allowed_items.");
                }
            });


            // if (!localStorage.getItem("allowed_items")) {
            //     // If no allowed_items, create it with the item_code
            //     localStorage.setItem("allowed_items", JSON.stringify({ item_codes: [item_code] }));
            // } else {
            //     // Parse the existing allowed_items from localStorage
            //     const allowed_items = JSON.parse(localStorage.getItem("allowed_items"));

            //     // Check if item_code is already in allowed_items
            //     if (!allowed_items.item_codes.includes(item_code)) {
            //         allowed_items.item_codes.push(item_code); // Add new item_code to the array
            //         localStorage.setItem("allowed_items", JSON.stringify(allowed_items)); // Save updated allowed_items
            //     } else {
            //         console.log("Item code is already in allowed_items.");
            //     }
            // }
        });
    } else {
        alert("Unable to verify question completion, please submit on LeetCode again or try again later.");
    }
}

async function checkProblem(titleSlug) {
    let url = `${baseURL}/${sessionStorage.getItem('username')}/acSubmission?limit=100`;
    console.log("Checking if problem is solved:", titleSlug);
    try {
        const response = await fetch(url);
        const json = await response.json();
        for (const i in json.submission) {
            if (json.submission[i].titleSlug == titleSlug) {
                console.log("found match!", json.submission[i].titleSlug, titleSlug)
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error(`Error checking data: ${error.message}`);
        return false;
    }
}