const envelopeScene = document.getElementById("envelopeScene");
const openButton = document.getElementById("openLetter");
const closeButton = document.getElementById("closeLetter");
const letterCard = document.getElementById("letterCard");
const clickHint = document.getElementById("clickHint");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");

const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let isOpen = false;
let isAnimating = false;
let animationTimer;

function openLetter() {
  if (isOpen || isAnimating) return;

  isAnimating = true;
  isOpen = true;

  openButton.setAttribute("aria-expanded", "true");
  envelopeScene.classList.add("opening");

  clickHint.textContent = "opening your little surprise... ♡";

  pageTitle.textContent = "Just for you ♡";
  pageSubtitle.textContent = "A little note from my heart.";

  // Let the envelope flap open before revealing the letter.
  const delay = reduceMotion.matches ? 0 : 650;

  animationTimer = window.setTimeout(() => {
    letterCard.inert = false;
    letterCard.setAttribute("aria-hidden", "false");
    letterCard.classList.add("visible");

    clickHint.textContent = "a little something from me to you ♡";
    isAnimating = false;

    // Bring the letter into view on smaller screens.
    if (window.innerWidth <= 600) {
      window.setTimeout(() => {
        letterCard.scrollIntoView({
          behavior: reduceMotion.matches ? "auto" : "smooth",
          block: "start"
        });
      }, 150);
    }
  }, delay);
}

function closeLetter() {
  if (!isOpen || isAnimating) return;

  isAnimating = true;
  isOpen = false;

  window.clearTimeout(animationTimer);

  letterCard.classList.remove("visible");
  letterCard.inert = true;
  letterCard.setAttribute("aria-hidden", "true");

  envelopeScene.classList.remove("opening");
  openButton.setAttribute("aria-expanded", "false");

  clickHint.textContent = "click to open ♡";
  pageTitle.textContent = "Open when you're ready...";
  pageSubtitle.textContent = "I made this just for you!";

  const delay = reduceMotion.matches ? 0 : 650;

  window.setTimeout(() => {
    isAnimating = false;
    openButton.focus({ preventScroll: true });
  }, delay);
}

// Clicking anywhere on the envelope opens the letter.
openButton.addEventListener("click", openLetter);

// Close button resets the envelope for another opening.
closeButton.addEventListener("click", closeLetter);

// Escape key also closes the letter.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && isOpen && !isAnimating) {
    closeLetter();
  }
});

// Hide missing PNGs instead of displaying broken image icons.
document.querySelectorAll(".sticker").forEach((sticker) => {
  sticker.addEventListener("error", () => {
    sticker.hidden = true;
  });
});