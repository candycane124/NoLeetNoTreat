document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("code-button").addEventListener("click", openCode);
});

function openCode() {
    console.log("opening");
    chrome.tabs.create({ url: "./code.html"});
}
