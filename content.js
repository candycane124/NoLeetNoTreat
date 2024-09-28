console.log("Content script is running");

function initialize() {
  console.log("Okay... here");
  setTimeout(() => {
    const payButton = document.querySelector(
      'input[name="submit.add-to-cart"]'
    );

    const productTitleElement = document.getElementById("productTitle");
 
    const priceElement = document.querySelector(".a-price-whole");


    const productTitle = productTitleElement
      ? productTitleElement.innerText.trim()
      : "Amazon Product";

    console.log(`Product title: ${productTitle}`);

    const productPrice = priceElement
      ? priceElement.innerText.trim()
      : "10";

    console.log(`Price: ${productPrice}`);

    if (payButton) {
      payButton.setAttribute("type", "button");
      payButton.onclick = (event) => {
        event.preventDefault(); // Prevent default page navigation

        const overlay = document.createElement("div");
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
        popup.style.backgroundColor = "#fff";
        popup.style.padding = "20px";
        popup.style.borderRadius = "8px";
        popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        popup.innerHTML = `
                    <h2>Nice try...</h2>
                    <img src="${chrome.runtime.getURL(
                      "assets/slogan.gif"
                    )}" alt="slogan" style="width:30%;" />
                    <p>Sustainability facts from OpenAI on your purchase.</p>
                    <p>Here's your LeetCode Question!</p>
                    <img src="https://media.tenor.com/cXUxKfB1aCkAAAAi/no-nope.gif" alt="No Nope Sticker" style="width:40%;" />
                    <button id="close-popup">Close</button>
                `;

        /** Prompting:
         *  I'm about to buy ${productTitle} that costs around ${a-price-whole} dollars.
         *  Give me a short and brief but strong sentence or two on why I shouldn't buy it, and tie in a sustainability fact, that uses some kind of statistic.
         */
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        document.getElementById("close-popup").onclick = () => {
          document.body.removeChild(overlay);
        };
      };
    }
  }, 1500);
}

// Check if the DOM is already loaded
if (document.readyState === "loading") {
  // If the document is still loading, wait for DOMContentLoaded
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  // If the document is already fully loaded, run the script immediately
  initialize();
}
