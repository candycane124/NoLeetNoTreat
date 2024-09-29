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


var allQs = [];
function storeAll(json) {
    console.log("storing all q's");
    allQs = json.problemsetQuestionList;
    console.log(allQs);
}
console.log("getting all problems");
fetch(`${baseURL}/problems?limit=${maxQs}`)
    .then((response) => response.json())
    .then((json) => storeAll(json))
    .catch((error) => console.error(`Error storing data: ${error.message}`));

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
            const alreadySolved = await checkProblem(q.titleSlug);
            if (!q.isPaidOnly && !alreadySolved) { //check not paid & not solved recently
                getProblem(q.titleSlug);
                break;
            }
        }
        i++;
    }
    if (i > 3300) {
        alert("Error occured while searching for problem, please try again.");
    }
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
        alert("user completed the question, allow user to buy item");
    } else {
        alert("unable to verify question completion, please submit on leetcode again");
    }
}

async function checkProblem(titleSlug) {
    let url = `${baseURL}/${sessionStorage.getItem('username')}/acSubmission?limit=100`;
    console.log("checking if problem is solved:", titleSlug);
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