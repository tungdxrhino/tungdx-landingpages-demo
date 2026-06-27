const models = [
  {
    name: "Ebony",
    image: "assets/product-ebony.png",
  },
  {
    name: "Cocobolo",
    image: "assets/product-cocobolo.png",
  },
  {
    name: "Bocote",
    image: "assets/product-bocote.png",
  },
];

const popupImages = [
  {
    src: "assets/popup-carbon.png",
    alt: "Premium Japanese Carbon Fiber detail",
  },
  {
    src: "assets/popup-tip.png",
    alt: "The All-New Time Tip detail",
  },
  {
    src: "assets/popup-shaft.png",
    alt: "Ultra-Low Deflection Shaft detail",
  },
  {
    src: "assets/popup-finish.png",
    alt: "Masterful Finish and Aesthetic Depth detail",
  },
];

const topbarOffset = () => document.querySelector(".topbar").offsetHeight;

function scrollToSection(target) {
  const element = document.getElementById(target);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - topbarOffset() + 1;
  window.scrollTo({ top, behavior: "smooth" });
}

document.addEventListener("click", (event) => {
  const scrollButton = event.target.closest("[data-scroll]");
  if (!scrollButton) return;

  const target = scrollButton.dataset.scroll;
  if (target === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (target === "launch") {
    closeModal();
  }

  scrollToSection(target);
});

const carouselTrack = document.getElementById("carouselTrack");
const modelDots = document.getElementById("modelDots");
let activeModel = 1;
let carouselTouchStart = 0;
let carouselPointerStart = 0;
let suppressCarouselClick = false;
let carouselAnimationTimer = 0;

function modelPosition(index) {
  if (index === activeModel) return "is-active";
  if (index === (activeModel + models.length - 1) % models.length) return "is-prev";
  if (index === (activeModel + 1) % models.length) return "is-next";
  return "is-hidden";
}

function renderModels() {
  carouselTrack.innerHTML = models
    .map((model, index) => {
      return [
        '<article class="model-card ' + modelPosition(index) + '" data-model="' + index + '">',
        '  <img src="' + model.image + '" alt="Retro II ' + model.name + '" />',
        '  <h3>Retro II <span>' + model.name + '</span></h3>',
        '  <p class="price">$529</p>',
        '  <button class="asset-button claim-small" type="button" data-scroll="launch">',
        '    <img src="assets/CTA_Claim_Short.png" alt="Claim Offer" />',
        '  </button>',
        '</article>',
      ].join("");
    })
    .join("");

  modelDots.innerHTML = models
    .map((model, index) => {
      const current = index === activeModel ? "true" : "false";
      return '<button type="button" aria-label="Show Retro II ' + model.name + '" aria-current="' + current + '" data-dot="' + index + '"></button>';
    })
    .join("");
}

function carouselDirection(from, to) {
  if (to === (from + 1) % models.length) return 1;
  if (to === (from + models.length - 1) % models.length) return -1;
  return to > from ? 1 : -1;
}

function animateCarousel(direction) {
  carouselTrack.classList.remove("is-sliding-next", "is-sliding-prev");
  window.clearTimeout(carouselAnimationTimer);
  void carouselTrack.offsetWidth;
  carouselTrack.classList.add(direction > 0 ? "is-sliding-next" : "is-sliding-prev");
  carouselAnimationTimer = window.setTimeout(() => {
    carouselTrack.classList.remove("is-sliding-next", "is-sliding-prev");
  }, 460);
}

function setActiveModel(index, direction = 0) {
  const nextModel = (index + models.length) % models.length;
  if (nextModel === activeModel) return;
  const movement = direction || carouselDirection(activeModel, nextModel);
  activeModel = nextModel;
  renderModels();
  animateCarousel(movement);
}

renderModels();

document.querySelector(".carousel-prev").addEventListener("click", () => setActiveModel(activeModel - 1, -1));
document.querySelector(".carousel-next").addEventListener("click", () => setActiveModel(activeModel + 1, 1));

carouselTrack.addEventListener("click", (event) => {
  if (suppressCarouselClick) return;
  const card = event.target.closest(".model-card");
  if (!card) return;
  const index = Number(card.dataset.model);
  if (index !== activeModel) setActiveModel(index);
});

modelDots.addEventListener("click", (event) => {
  const dot = event.target.closest("[data-dot]");
  if (!dot) return;
  setActiveModel(Number(dot.dataset.dot));
});

carouselTrack.addEventListener("touchstart", (event) => {
  carouselTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

carouselTrack.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - carouselTouchStart;
  if (Math.abs(delta) < 42) return;
  setActiveModel(activeModel + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
}, { passive: true });

carouselTrack.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" || event.target.closest("button")) return;
  carouselPointerStart = event.clientX;
});

carouselTrack.addEventListener("pointerup", (event) => {
  if (!carouselPointerStart) return;
  const delta = event.clientX - carouselPointerStart;
  carouselPointerStart = 0;
  if (Math.abs(delta) < 46) return;
  suppressCarouselClick = true;
  window.setTimeout(() => { suppressCarouselClick = false; }, 80);
  setActiveModel(activeModel + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
});

const modal = document.getElementById("featureModal");
const modalCard = document.querySelector(".modal-card");
const modalImage = document.getElementById("modalImage");
let activePopup = 0;
let modalTouchStart = 0;
let modalPointerStart = 0;
let modalPointerActive = false;

function renderPopup() {
  modalImage.src = popupImages[activePopup].src;
  modalImage.alt = popupImages[activePopup].alt;
}

function openModal(index) {
  activePopup = index;
  renderPopup();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector(".modal-close").focus();
}

function closeModal() {
  if (!modal.classList.contains("is-open")) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  resetModalDrag();
}

function movePopup(direction) {
  activePopup = (activePopup + direction + popupImages.length) % popupImages.length;
  renderPopup();
}

function resetModalDrag() {
  modalPointerActive = false;
  modalPointerStart = 0;
  modalCard.classList.remove("is-dragging");
  modalCard.style.setProperty("--modal-drag-x", "0px");
  modalCard.style.setProperty("--modal-drag-rotate", "0deg");
}

document.querySelectorAll("[data-popup]").forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(Number(trigger.dataset.popup)));
});

document.querySelector(".modal-close").addEventListener("click", closeModal);
document.querySelector("[data-close-modal]").addEventListener("click", closeModal);
document.querySelector(".modal-prev").addEventListener("click", () => movePopup(-1));
document.querySelector(".modal-next").addEventListener("click", () => movePopup(1));

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") movePopup(-1);
  if (event.key === "ArrowRight") movePopup(1);
});

modal.addEventListener("touchstart", (event) => {
  modalTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

modal.addEventListener("touchend", (event) => {
  const delta = event.changedTouches[0].clientX - modalTouchStart;
  if (Math.abs(delta) < 48) return;
  movePopup(delta < 0 ? 1 : -1);
}, { passive: true });

modalCard.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" || event.target.closest("button")) return;
  modalPointerActive = true;
  modalPointerStart = event.clientX;
  modalCard.classList.add("is-dragging");
});

window.addEventListener("pointermove", (event) => {
  if (!modalPointerActive) return;
  const delta = Math.max(-110, Math.min(110, event.clientX - modalPointerStart));
  modalCard.style.setProperty("--modal-drag-x", delta + "px");
  modalCard.style.setProperty("--modal-drag-rotate", (delta / 24) + "deg");
});

window.addEventListener("pointerup", (event) => {
  if (!modalPointerActive) return;
  const delta = event.clientX - modalPointerStart;
  resetModalDrag();
  if (Math.abs(delta) < 58) return;
  movePopup(delta < 0 ? 1 : -1);
});

const offerForm = document.getElementById("offerForm");
const emailInput = document.getElementById("email");
const claimButton = document.getElementById("claimButton");
const claimButtonImage = claimButton.querySelector("img");
const formStatus = document.getElementById("formStatus");

function syncOfferButton() {
  claimButton.disabled = !emailInput.checkValidity();
  if (formStatus.textContent) formStatus.textContent = "";
}

emailInput.addEventListener("input", syncOfferButton);
emailInput.addEventListener("blur", syncOfferButton);

offerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    syncOfferButton();
    return;
  }

  claimButtonImage.alt = "Offer Claimed";
  claimButton.disabled = true;
  formStatus.textContent = "Thank you. Your launch offer has been reserved.";
});
