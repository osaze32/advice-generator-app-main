// The API address is stored once so we never repeat it
const ADVICE_URL = "https://api.adviceslip.com/advice";

const adviceId = document.querySelector("#advice-id");
const adviceText = document.querySelector("#advice-text");
const diceButton = document.querySelector("#dice-button");

// Fetching: ask the API for advice and return the "slip" object
async function fetchAdvice() {
  // cache: "no-store" stops the browser from reusing an old response
  const response = await fetch(ADVICE_URL, { cache: "no-store" });

  // fetch does not throw on 404/500, so we check this ourselves
  if (!response.ok) {
    throw new Error("Status " + response.status);
  }

  const data = await response.json();
  return data.slip; // the data is nested under "slip"
}

// Rendering: put the data on the page
// textContent is used (not innerHTML) so API data can't inject HTML
function renderAdvice(slip) {
  adviceId.textContent = slip.id;
  adviceText.textContent = "\u201C" + slip.advice + "\u201D";
}

function renderError() {
  adviceText.textContent = "Sorry, we couldn't get advice right now. Please try again.";
}

// Puts it all together and handles the three states: loading, success, error
async function getAdvice() {
  // Loading
  diceButton.disabled = true;
  adviceText.textContent = "Loading...";

  try {
    const slip = await fetchAdvice();
    renderAdvice(slip); // Success
  } catch (error) {
    console.error(error);
    renderError(); // Error
  } finally {
    // Always runs, so the button never gets stuck disabled
    diceButton.disabled = false;
  }
}

diceButton.addEventListener("click", getAdvice);

// Get advice once when the page loads so the card is never empty
getAdvice();