console.log("Content script is running");

function initialize() {
  console.log("Okay here");
  setTimeout(() => {
    const payButton = document.querySelector('input[name="submit.add-to-cart"]');

    const productTitleElement = document.getElementById("productTitle");
    const priceElement = document.querySelector(".a-price-whole");

    const productTitle = productTitleElement
      ? productTitleElement.innerText.trim()
      : "Amazon Product";

    console.log(`Product title: ${productTitle}`);

    const productPrice = priceElement ? priceElement.innerText.trim() : "10";

    console.log(`Price: ${productPrice}`);

    const prompt = `I'm about to buy ${productTitle} that costs around ${productPrice} dollars. Give me a short and brief but strong sentence or two on why I shouldn't buy it, and tie in a sustainability fact, that uses some kind of statistic.`;

    // Always show the popup first
    if (payButton) {
      payButton.setAttribute("type", "button");
      payButton.onclick = (event) => {
        event.preventDefault();
        displayPopup(prompt); // Pass the prompt to displayPopup
      };
    }
  }, 1500);
}

// Function to display the popup right away
function displayPopup(prompt) {
  const overlay = document.createElement("div");


  overlay.id="overlay";

  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "1000";

  const popup = document.createElement("div");

  popup.id="popup";

  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popup.innerHTML = `
                <div class="container">
              <h2>Nice try...</h2>
              <img src="${chrome.runtime.getURL("assets/slogan.gif")}" alt="slogan" style="width:30%;" />
              <p>Sustainability facts from OpenAI on your purchase.</p>
              <p id="ai-response">Fetching sustainability facts...</p>
              <button id="open-code-button">I don't care</button>
              <p id="quote">Inspiration coming..</p>
              <img src="https://media.tenor.com/cXUxKfB1aCkAAAAi/no-nope.gif" alt="No Nope Sticker" style="width:40%;" />
              <br/>
              <button id="close-popup">Close</button>
              </div>
          `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  const prompt2 = "I'm a woman trying to solve a hard (LeetCode)question, give me an inspirational quote from some women tech leader to solve it! Just the quote.";


  // Fetch data from the backend right after displaying the popup
  fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log("Generated content:", data);
      updatePopupContent(data.response); // Update the popup content
    })
    .catch((error) => console.error("Error:", error));

    fetch("http://localhost:3000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt2 }),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Generated content:", data);
        addQuote(data.response); // Update the popup content
      })
      .catch((error) => console.error("Error:", error));

  // Function to update the popup content once the AI response is ready
  function updatePopupContent(responseText) {
    const aiResponseElement = document.getElementById("ai-response");
    if (aiResponseElement) {
      aiResponseElement.innerHTML = responseText;
      console.log("Replaced text with sustainability fact");
    }
  }

  // Function to update the popup content once the AI response is ready
  function addQuote(responseText) {
    const quoteElement = document.getElementById("quote");
    if (quoteElement) {
        quoteElement.innerHTML = responseText;
      console.log("Added quote");
    }
  }

  document.getElementById("close-popup").onclick = () => {
    document.body.removeChild(overlay);
  };

  document.getElementById("open-code-button").addEventListener("click", openCode);
}

function openCode() {
  console.log("Requesting tab info");
  // Send a message to the background script to open the side panel
  chrome.runtime.sendMessage({ action: "openSidePanel" });
}

// Check if the DOM is already loaded
if (document.readyState === "loading") {
  // If the document is still loading, wait for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  // If the document is already fully loaded, run the script immediately
  initialize();
}
