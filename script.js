const productSpecHtml = [
  '<p><strong>THE SPECIFICATIONS</strong></p>',
  '<p><strong>The Architecture:</strong> Japanese Premium Carbon | Flawless Surface & Near-Perfect Roundness | Absolute Straightness</p>',
  '<p><strong>The Shaft:</strong> Dynamic Pro Taper | 30&quot; | 3.7 - 4.0 oz</p>',
  '<p><strong>The Butt:</strong> Carbon Composite | 29&quot; | 15 - 15.5 oz</p>',
  '<p><strong>Total Weight:</strong> 19 - 19.5 oz | Fully Adjustable Weight System</p>',
  '<p><strong>The Tip:</strong> Next-Generation TIME Tip (12.5mm) | 10 Formulated Compressed Layers</p>',
  '<p><strong>The Grip:</strong> Premium Cowhide Lizard-Embossed Leather</p>',
  '<p><strong>The Connection:</strong> (3/8-8) Precision-Milled Steel Joint | Matching Joint Protector Included</p>',
].join('');

function gallerySet(primary, second, third) {
  return [primary, second, third, primary, second, third, primary, second, third];
}

const models = [
  {
    name: 'Ebony',
    edition: 'Ebony Edition',
    sku: 'SKU: RETRO-II-EBONY',
    price: '$529',
    image: 'assets/product-ebony.png',
    gallery: gallerySet('assets/product-ebony.png', 'assets/products.png', 'assets/product-ebony.png'),
    intro: 'The ultimate understatement. Pure, deep black finish for absolute sophistication.',
  },
  {
    name: 'Cocobolo',
    edition: 'Cocobolo Edition',
    sku: 'SKU: RETRO-II-COCOBOLO',
    price: '$529',
    image: 'assets/product-cocobolo.png',
    gallery: gallerySet('assets/product-cocobolo.png', 'assets/products.png', 'assets/product-cocobolo.png'),
    intro: 'A tribute to warmth. Rich reddish-brown tones crafted for timeless elegance.',
  },
  {
    name: 'Bocote',
    edition: 'Bocote Edition',
    sku: 'SKU: RETRO-II-BOCOTE',
    price: '$529',
    image: 'assets/product-bocote.png',
    gallery: gallerySet('assets/product-bocote.png', 'assets/products.png', 'assets/product-bocote.png'),
    intro: 'The poetry of nature. Bold, exotic grain patterns that command silent attention.',
  },
];

const popupImages = [
  {
    src: 'assets/popup-carbon.png',
    alt: 'Premium Japanese Carbon Fiber detail',
  },
  {
    src: 'assets/popup-tip.png',
    alt: 'The All-New Time Tip detail',
  },
  {
    src: 'assets/popup-shaft.png',
    alt: 'Ultra-Low Deflection Shaft detail',
  },
  {
    src: 'assets/popup-finish.png',
    alt: 'Masterful Finish and Aesthetic Depth detail',
  },
];

const topbarOffset = () => document.querySelector('.topbar').offsetHeight;

function scrollToSection(target) {
  const element = document.getElementById(target);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - topbarOffset() + 1;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.addEventListener('click', (event) => {
  const scrollButton = event.target.closest('[data-scroll]');
  if (!scrollButton) return;

  const target = scrollButton.dataset.scroll;
  if (target === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (target === 'launch') {
    closeModal();
    closeProductModal();
    closeOfferModal();
  }

  scrollToSection(target);
});

const carouselTrack = document.getElementById('carouselTrack');
const modelDots = document.getElementById('modelDots');
let activeModel = 1;
let carouselTouchStart = 0;
let carouselPointerStart = 0;
let suppressCarouselClick = false;
let carouselAnimationTimer = 0;

function modelPosition(index) {
  if (index === activeModel) return 'is-active';
  if (index === (activeModel + models.length - 1) % models.length) return 'is-prev';
  if (index === (activeModel + 1) % models.length) return 'is-next';
  return 'is-hidden';
}

function renderModels() {
  carouselTrack.innerHTML = models
    .map((model, index) => {
      return [
        '<article class="model-card ' + modelPosition(index) + '" data-model="' + index + '">',
        '  <button class="model-image-button" type="button" data-product="' + index + '" aria-label="Open Retro II ' + model.name + ' details">',
        '    <img src="' + model.image + '" alt="Retro II ' + model.name + '" />',
        '  </button>',
        '  <h3>Retro II <span>' + model.name + '</span></h3>',
        '  <p class="price">' + model.price + '</p>',
        '  <button class="asset-button claim-small" type="button" data-scroll="launch">',
        '    <img src="assets/CTA_Claim_Short.png" alt="Claim Offer" />',
        '  </button>',
        '</article>',
      ].join('');
    })
    .join('');

  modelDots.innerHTML = models
    .map((model, index) => {
      const current = index === activeModel ? 'true' : 'false';
      return '<button type="button" aria-label="Show Retro II ' + model.name + '" aria-current="' + current + '" data-dot="' + index + '"></button>';
    })
    .join('');
}

function carouselDirection(from, to) {
  if (to === (from + 1) % models.length) return 1;
  if (to === (from + models.length - 1) % models.length) return -1;
  return to > from ? 1 : -1;
}

function animateCarousel(direction) {
  carouselTrack.classList.remove('is-sliding-next', 'is-sliding-prev');
  window.clearTimeout(carouselAnimationTimer);
  void carouselTrack.offsetWidth;
  carouselTrack.classList.add(direction > 0 ? 'is-sliding-next' : 'is-sliding-prev');
  carouselAnimationTimer = window.setTimeout(() => {
    carouselTrack.classList.remove('is-sliding-next', 'is-sliding-prev');
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

document.querySelector('.carousel-prev').addEventListener('click', () => setActiveModel(activeModel - 1, -1));
document.querySelector('.carousel-next').addEventListener('click', () => setActiveModel(activeModel + 1, 1));

carouselTrack.addEventListener('click', (event) => {
  if (suppressCarouselClick) return;
  const card = event.target.closest('.model-card');
  if (!card) return;
  const index = Number(card.dataset.model);

  if (event.target.closest('.model-image-button')) {
    if (index === activeModel) openProductModal(index);
    else setActiveModel(index);
    return;
  }

  if (index !== activeModel) setActiveModel(index);
});

modelDots.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-dot]');
  if (!dot) return;
  setActiveModel(Number(dot.dataset.dot));
});

carouselTrack.addEventListener('touchstart', (event) => {
  carouselTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

carouselTrack.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - carouselTouchStart;
  if (Math.abs(delta) < 42) return;
  suppressCarouselClick = true;
  window.setTimeout(() => { suppressCarouselClick = false; }, 120);
  setActiveModel(activeModel + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
}, { passive: true });

carouselTrack.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.target.closest('button')) return;
  carouselPointerStart = event.clientX;
});

carouselTrack.addEventListener('pointerup', (event) => {
  if (!carouselPointerStart) return;
  const delta = event.clientX - carouselPointerStart;
  carouselPointerStart = 0;
  if (Math.abs(delta) < 46) return;
  suppressCarouselClick = true;
  window.setTimeout(() => { suppressCarouselClick = false; }, 80);
  setActiveModel(activeModel + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
});

const modal = document.getElementById('featureModal');
const modalCard = document.querySelector('.modal-card');
const modalImage = document.getElementById('modalImage');
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
  closeOfferModal();
  closeProductModal();
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.modal-close').focus();
}

function closeModal() {
  if (!modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  resetModalDrag();
}

function movePopup(direction) {
  activePopup = (activePopup + direction + popupImages.length) % popupImages.length;
  renderPopup();
}

function resetModalDrag() {
  modalPointerActive = false;
  modalPointerStart = 0;
  modalCard.classList.remove('is-dragging');
  modalCard.style.setProperty('--modal-drag-x', '0px');
  modalCard.style.setProperty('--modal-drag-rotate', '0deg');
}

document.querySelectorAll('[data-popup]').forEach((trigger) => {
  trigger.addEventListener('click', () => openModal(Number(trigger.dataset.popup)));
});

document.querySelector('.modal-close').addEventListener('click', closeModal);
document.querySelector('[data-close-modal]').addEventListener('click', closeModal);
document.querySelector('.modal-prev').addEventListener('click', () => movePopup(-1));
document.querySelector('.modal-next').addEventListener('click', () => movePopup(1));

modal.addEventListener('touchstart', (event) => {
  modalTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

modal.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - modalTouchStart;
  if (Math.abs(delta) < 48) return;
  movePopup(delta < 0 ? 1 : -1);
}, { passive: true });

modalCard.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.target.closest('button')) return;
  modalPointerActive = true;
  modalPointerStart = event.clientX;
  modalCard.classList.add('is-dragging');
});

window.addEventListener('pointermove', (event) => {
  if (!modalPointerActive) return;
  const delta = Math.max(-110, Math.min(110, event.clientX - modalPointerStart));
  modalCard.style.setProperty('--modal-drag-x', delta + 'px');
  modalCard.style.setProperty('--modal-drag-rotate', (delta / 24) + 'deg');
});

window.addEventListener('pointerup', (event) => {
  if (!modalPointerActive) return;
  const delta = event.clientX - modalPointerStart;
  resetModalDrag();
  if (Math.abs(delta) < 58) return;
  movePopup(delta < 0 ? 1 : -1);
});

const productModal = document.getElementById('productModal');
const productGallery = document.getElementById('productGallery');
const productGalleryDots = document.getElementById('productGalleryDots');
const productModalTitle = document.getElementById('productModalTitle');
const productSku = document.getElementById('productSku');
const productPrice = document.getElementById('productPrice');
const productIntro = document.getElementById('productIntro');
const productSpec = document.getElementById('productSpec');
let activeProduct = 0;
let activeProductImage = 0;
let productTouchStart = 0;
let productPointerStart = 0;

function renderProductModal() {
  const product = models[activeProduct];
  productGallery.innerHTML = '<img src="' + product.gallery[activeProductImage] + '" alt="' + product.edition + ' detail image" />';
  productGalleryDots.innerHTML = product.gallery
    .map((image, index) => {
      const current = index === activeProductImage ? 'true' : 'false';
      return '<button type="button" aria-label="Show image ' + (index + 1) + '" aria-current="' + current + '" data-product-image="' + index + '"></button>';
    })
    .join('');
  productModalTitle.textContent = product.edition;
  productSku.textContent = product.sku;
  productPrice.textContent = product.price;
  productIntro.textContent = product.intro;
  productSpec.innerHTML = productSpecHtml;
}

function openProductModal(index) {
  activeProduct = index;
  activeProductImage = 0;
  renderProductModal();
  closeModal();
  closeOfferModal();
  productModal.classList.add('is-open');
  productModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  document.querySelector('.product-modal-close').focus();
}

function closeProductModal() {
  if (!productModal.classList.contains('is-open')) return;
  productModal.classList.remove('is-open');
  productModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function moveProductImage(direction) {
  const gallery = models[activeProduct].gallery;
  activeProductImage = (activeProductImage + direction + gallery.length) % gallery.length;
  renderProductModal();
}

productGalleryDots.addEventListener('click', (event) => {
  const dot = event.target.closest('[data-product-image]');
  if (!dot) return;
  activeProductImage = Number(dot.dataset.productImage);
  renderProductModal();
});

document.querySelector('.product-modal-close').addEventListener('click', closeProductModal);
document.querySelector('[data-close-product-modal]').addEventListener('click', closeProductModal);

productGallery.addEventListener('touchstart', (event) => {
  productTouchStart = event.changedTouches[0].clientX;
}, { passive: true });

productGallery.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - productTouchStart;
  if (Math.abs(delta) < 42) return;
  moveProductImage(delta < 0 ? 1 : -1);
}, { passive: true });

productGallery.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') return;
  productPointerStart = event.clientX;
});

productGallery.addEventListener('pointerup', (event) => {
  if (!productPointerStart) return;
  const delta = event.clientX - productPointerStart;
  productPointerStart = 0;
  if (Math.abs(delta) < 46) return;
  moveProductImage(delta < 0 ? 1 : -1);
});

const offerForm = document.getElementById('offerForm');
const emailInput = document.getElementById('email');
const claimButton = document.getElementById('claimButton');
const claimButtonImage = claimButton.querySelector('img');
const formStatus = document.getElementById('formStatus');
const offerModal = document.getElementById('offerModal');
const offerCode = document.getElementById('offerCode');
const copyOfferCode = document.getElementById('copyOfferCode');
const enterBoutique = document.getElementById('enterBoutique');
const returnToExperience = document.getElementById('returnToExperience');
const offerCountdown = document.getElementById('offerCountdown');
const offerCopyStatus = document.getElementById('offerCopyStatus');
let offerCountdownTimer = 0;
let offerCountdownValue = 12;

function syncOfferButton() {
  claimButton.disabled = false;
  if (formStatus.textContent) formStatus.textContent = '';
}

function isValidEmail() {
  return emailInput.value.trim() !== '' && emailInput.checkValidity();
}

function showEmailWarning() {
  formStatus.textContent = 'Please enter your email address to unlock this exclusive offer';
}

function generateOfferCode() {
  const number = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return 'RETRO.II.VI' + number + letter;
}

function startOfferCountdown() {
  window.clearInterval(offerCountdownTimer);
  offerCountdownValue = 12;
  offerCountdown.textContent = offerCountdownValue;
  offerCountdownTimer = window.setInterval(() => {
    offerCountdownValue -= 1;
    offerCountdown.textContent = offerCountdownValue;
    if (offerCountdownValue <= 0) closeOfferModal();
  }, 1000);
}

function openOfferModal() {
  offerCode.textContent = generateOfferCode();
  offerCopyStatus.textContent = '';
  closeModal();
  closeProductModal();
  offerModal.classList.add('is-open');
  offerModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  startOfferCountdown();
  copyOfferCode.focus();
}

function closeOfferModal() {
  if (!offerModal.classList.contains('is-open')) return;
  offerModal.classList.remove('is-open');
  offerModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  window.clearInterval(offerCountdownTimer);
}

async function saveOfferCode() {
  try {
    await navigator.clipboard.writeText(offerCode.textContent);
    offerCopyStatus.textContent = 'Code saved to clipboard.';
  } catch (error) {
    const range = document.createRange();
    range.selectNodeContents(offerCode);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    offerCopyStatus.textContent = 'Code selected. Copy it from your browser.';
  }
}

emailInput.addEventListener('input', syncOfferButton);
emailInput.addEventListener('blur', syncOfferButton);
claimButton.addEventListener('click', () => {
  if (!isValidEmail()) showEmailWarning();
});

offerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!isValidEmail()) {
    showEmailWarning();
    return;
  }

  claimButtonImage.alt = 'Offer Claimed';
  formStatus.textContent = '';
  openOfferModal();
});

copyOfferCode.addEventListener('click', saveOfferCode);
enterBoutique.addEventListener('click', () => {
  window.open('https://rhino-billiards.com', '_blank', 'noopener');
});
returnToExperience.addEventListener('click', closeOfferModal);
document.querySelector('[data-close-offer-modal]').addEventListener('click', closeOfferModal);

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeModal();
  closeProductModal();
  closeOfferModal();
});

document.addEventListener('keydown', (event) => {
  if (modal.classList.contains('is-open')) {
    if (event.key === 'ArrowLeft') movePopup(-1);
    if (event.key === 'ArrowRight') movePopup(1);
  }

  if (productModal.classList.contains('is-open')) {
    if (event.key === 'ArrowLeft') moveProductImage(-1);
    if (event.key === 'ArrowRight') moveProductImage(1);
  }
});

syncOfferButton();
