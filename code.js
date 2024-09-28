document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("get-daily-button").addEventListener("click", findDaily);
});
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("get-problem-button").addEventListener("click", findProblem);
});

const baseURL = "https://alfa-leetcode-api.onrender.com";

var currQuestion = "";

function findDaily() {
    let url = `${baseURL}/daily`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => getProblem(json.titleSlug))
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function findProblem() {
    let url = `${baseURL}/problems`;
    let diff = document.getElementById("difficulty").value;
    let filter = diff != "None";
    console.log("finding problem of diff: ", diff);
    fetch(url)
        .then((response) => response.json())
        .then((json) => {
            for (const q of json.problemsetQuestionList) {
                if (!filter || q.difficulty == diff) {
                    console.log("found appropriate, getting: ", q.titleSlug);
                    getProblem(q.titleSlug);
                    break;
                }
            }
        })
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function getProblem(titleSlug) {
    let url = `${baseURL}/select?titleSlug=${titleSlug}`;
    fetch(url)
        .then((response) => response.json())
        .then((json) => displayResults(json))
        .catch((error) => console.error(`Error fetching data: ${error.message}`));
}

function displayResults(json) {
    currQuestion = json.titleSlug;
    console.log("displaying results, set currq, ", currQuestion);
    document.getElementById("question").innerHTML = json.question;
    console.log(json);
    chrome.tabs.create({ url: json.link});
}