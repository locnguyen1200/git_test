// Shared lightbox carousel used by each individual gallery page.
const galleryModal = document.querySelector('#gallery-modal');
const galleryImage = document.querySelector('#gallery-image');
const galleryCount = document.querySelector('#gallery-count');
const galleryTriggers = Array.from(document.querySelectorAll('.gallery-trigger'));
const galleryClose = document.querySelector('.gallery-close');
const galleryPrevious = document.querySelector('#gallery-previous');
const galleryNext = document.querySelector('#gallery-next');
let currentPicture = 0;

function updateGallery() {
  const picture = galleryTriggers[currentPicture];
  galleryImage.src = picture.src;
  galleryImage.alt = picture.alt;
  galleryCount.textContent = `${currentPicture + 1}/${galleryTriggers.length}`;
}

function openGallery(trigger) {
  currentPicture = galleryTriggers.indexOf(trigger);
  updateGallery();
  galleryModal.hidden = false;
  document.body.classList.add('gallery-open');
  galleryClose.focus();
}

function closeGallery() {
  galleryModal.hidden = true;
  document.body.classList.remove('gallery-open');
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener('click', () => openGallery(trigger));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openGallery(trigger);
    }
  });
});

galleryPrevious.addEventListener('click', () => {
  if (!galleryTriggers.length) return;
  currentPicture = (currentPicture - 1 + galleryTriggers.length) % galleryTriggers.length;
  updateGallery();
});

galleryNext.addEventListener('click', () => {
  if (!galleryTriggers.length) return;
  currentPicture = (currentPicture + 1) % galleryTriggers.length;
  updateGallery();
});

galleryClose.addEventListener('click', closeGallery);
galleryModal.addEventListener('click', (event) => {
  if (event.target === galleryModal) closeGallery();
});
document.addEventListener('keydown', (event) => {
  if (galleryModal.hidden) return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') galleryPrevious.click();
  if (event.key === 'ArrowRight') galleryNext.click();
});
