const city = {
  "name": "New York",
  "lat": 40.7128,
  "lon": -74.006,
  "country": "USA",
  "count": 1,
  "photos": [
    {
      "src": "places_photos/places_photos_image_004.jpg",
      "alt": "Places Photo",
      "gallery": "Places",
      "galleryLink": "places.html"
    }
  ]
};

const POPUP_PAGE_SIZE = 4;
const popupCurrentPage = 1;

const allPhotos = city.photos || [];
const totalPhotos = allPhotos.length;
const count = city.count || totalPhotos;
const pageStart = (popupCurrentPage - 1) * POPUP_PAGE_SIZE;
const pagePhotos = allPhotos.slice(pageStart, pageStart + POPUP_PAGE_SIZE);

const html = `
          <div class="popup-grid">
            ${pagePhotos.map((p) => `
              <div class="popup-thumb-wrap">
                <a href="${p.galleryLink || '#'}" class="popup-thumb-link" title="${p.alt || city.name}">
                  <img src="${p.src}" alt="${p.alt || city.name}" class="popup-thumb" loading="lazy">
                </a>
              </div>
            `).join('')}
          </div>
`;

console.log(html);
