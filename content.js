console.log("Content script is running");

var productTitle = "";

function initialize() {
  console.log("Okay here");
  setTimeout(() => {
    const payButton = document.querySelector(
      'input[name="submit.add-to-cart"]'
    );

    const productTitleElement = document.getElementById("productTitle");
    const priceElement = document.querySelector(".a-price-whole");

    productTitle = productTitleElement
      ? productTitleElement.innerText.trim()
      : "Amazon Product";

    console.log(`Product title: ${productTitle}`);

    const productPrice = priceElement ? priceElement.innerText.trim() : "10";

    console.log(`Price: ${productPrice}`);

    const prompt = `I'm about to buy ${productTitle} that costs around ${productPrice} dollars. Give me a short and brief but strong sentence or two on why I shouldn't buy it, and tie in a sustainability fact, that uses some kind of statistic.`;
    const prompt2 =
      "I'm a woman trying to solve a hard (LeetCode)question, give me an inspirational quote from some women tech leader to solve it! Just the quote.";

    // Always show the popup first
    if (payButton) {
      payButton.setAttribute("type", "button");
      payButton.onclick = (event) => {
        event.preventDefault();
        displayPopup(prompt, prompt2); // Pass the prompt to displayPopup
      };
    }
  }, 1500);
}

// Function to display the popup right away
function displayPopup(prompt, prompt2) {
  const overlay = document.createElement("div");

  overlay.id = "overlay";

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

  popup.id = "popup";

  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  popup.innerHTML = `
                <div class="container">
              <h2>Nice try...</h2>
              <img src="${chrome.runtime.getURL(
                "assets/slogan.gif"
              )}" alt="slogan" style="width:60%;" />
              <p>Sustainability alert!</p>
              <p id="ai-response">Fetching a crazy sustainability fact...</p>
              <button id="open-code-button">I don't care</button>
              <p id="quote">Inspiration coming..</p>
              <img src="https://media.tenor.com/cXUxKfB1aCkAAAAi/no-nope.gif" alt="No Nope Sticker" style="width:60%;" />
              <br/>
              <button id="close-popup">Close</button>
              </div>
          `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

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
      console.log("Generated content:", data.response);
      updatePopupContent(data.response); // Update the popup content
    })
    .catch((error) => console.error("Error:", error));

  setTimeout(() => {
    fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt2 }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Generated quote:", data.response);
        addQuote(data.response);
      })
      .catch((error) => console.error("Error:", error));
  }, 3000);

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
      quoteElement.innerHTML = responseText
        ? responseText
        : "Don't be afraid to ask for help, but don't be afraid to think for yourself. - Marissa Mayer";
      console.log(`Added quote with text: ${responseText}`);
    }
  }

  document.getElementById("close-popup").onclick = () => {
    document.body.removeChild(overlay);
  };

  document
    .getElementById("open-code-button")
    .addEventListener("click", openCode);
}

function openCode() {
  console.log("Requesting open side panel");
  console.log("Item:", productTitle);
  // Send a message to the background script to open the side panel
  chrome.runtime.sendMessage({ action: "openSidePanel", item: productTitle });
}

function isItemAllowed(item_code) {
  const allowedItems = JSON.parse(localStorage.getItem("allowed_items")) || {
    item_codes: [],
  };
  return allowedItems.item_codes.includes(item_code);
}

function getSpanWith10Chars() {
    const spans = document.querySelectorAll("span"); // Select all span elements
    const regex = /^B.*\d.*$/; // Regular expression to check if string starts with 'B' and contains at least one number
    
    for (let span of spans) {
      const text = span.textContent;
      if (text.length === 10 && regex.test(text)) {
        // Check if the span text is exactly 10 characters, starts with 'B', and contains at least one number
        return span;
      }
    }
    return null; // Return null if no matching span is found
  }

function sendItemCodeToBackground(item_code) {
  chrome.runtime.sendMessage(
    { action: "sendItemCode", item_code },
    function (response) {
      console.log("Response from background:", response);
    }
  );
}

function storeItemCodeInChromeStorage(item_code) {
  chrome.storage.local.set({ item_code }, function () {
    console.log("Item code stored:", item_code);
  });
}

// Check if the DOM is already loaded
if (document.readyState === "loading") {
  const item_code_span = getSpanWith10Chars();
  if (item_code_span) {
    // If a valid span is found
    const item_code = item_code_span.textContent; // Extract the text content (item code)

    // If item is not allowed, initialize
    if (!isItemAllowed(item_code)) {
      storeItemCodeInChromeStorage(item_code);
      document.addEventListener("DOMContentLoaded", initialize);
    }
  }
} else {
  const item_code_span = getSpanWith10Chars();
  if (item_code_span) {
    // If a valid span is found
    const item_code = item_code_span.textContent; // Extract the text content (item code)

    // If item is not allowed, initialize
    if (!isItemAllowed(item_code)) {
      storeItemCodeInChromeStorage(item_code);
      console.log(`${item_code}`);
      initialize();
    }
  }
}
