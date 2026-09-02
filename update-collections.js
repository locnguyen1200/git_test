const fs = require('fs');
const path = require('path');

const collections = [
  { name: 'Black & White', folder: 'bw_photos', link: 'black-and-white.html' },
  { name: 'Colour', folder: 'colour_photos', link: 'colour.html' },
  { name: 'Places', folder: 'places_photos', link: 'places.html' },
  { name: 'Portraits', folder: 'portrait_photos', link: 'portraits.html' },
  { name: 'Family', folder: 'family_photos', link: null, showInSystemAlert: false }
];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const outputPath = path.join(__dirname, 'collection-data.js');
const historyPath = path.join(__dirname, 'collection-alert-history.json');

function getPhotos(collection) {
  const folderPath = path.join(__dirname, collection.folder);
  return fs.existsSync(folderPath)
    ? fs.readdirSync(folderPath).filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    : [];
}

function readHistory() {
  if (!fs.existsSync(historyPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch {
    throw new Error(`Could not read ${path.basename(historyPath)}. Restore or remove the file before updating alerts.`);
  }
}

function readCurrentAlerts() {
  if (!fs.existsSync(outputPath)) return [];
  try {
    const output = fs.readFileSync(outputPath, 'utf8').replace(/^window\.collectionData = /, '').replace(/;\s*$/, '');
    const data = JSON.parse(output);
    return data.alertHistory?.length ? data.alertHistory : (data.collections || []);
  } catch {
    return [];
  }
}

function getDateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getExpiryDate(dateAdded) {
  const date = new Date(`${dateAdded}T00:00:00Z`);
  return getDateString(new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 2)));
}

function updateData() {
  const existingHistory = readHistory();
  const visibleCollections = collections.filter((collection) => collection.showInSystemAlert !== false);
  const knownPhotos = existingHistory?.knownPhotos || {};
  const today = getDateString();
  const alertHistory = (existingHistory?.alerts || readCurrentAlerts())
    .filter((alert) => alert.name !== 'Family')
    .map((alert, index) => ({
      ...alert,
      id: alert.id || `${alert.link || alert.name}:${alert.dateAdded}:${alert.photosAdded}:${index}`,
      expiresOn: alert.expiresOn || getExpiryDate(alert.dateAdded)
    }));

  visibleCollections.forEach((collection) => {
    const photos = getPhotos(collection);
    const knownCollectionPhotos = new Set(knownPhotos[collection.folder] || []);
    const newPhotoCount = existingHistory ? photos.filter((photo) => !knownCollectionPhotos.has(photo)).length : 0;

    if (newPhotoCount > 0) {
      alertHistory.push({
        id: `${collection.folder}:${Date.now()}`,
        name: collection.name,
        photosAdded: newPhotoCount,
        dateAdded: today,
        expiresOn: getExpiryDate(today),
        link: collection.link
      });
    }
    knownPhotos[collection.folder] = [...new Set([...knownCollectionPhotos, ...photos])].sort();
  });

  const activeAlerts = alertHistory.filter((alert) => today < alert.expiresOn).reverse();
  const history = alertHistory.slice().reverse();
  const latestCollection = activeAlerts[0] || null;
  const output = `window.collectionData = ${JSON.stringify({ latestCollection, collections: activeAlerts, alertHistory: history }, null, 2)};\n`;
  fs.writeFileSync(outputPath, output);
  fs.writeFileSync(historyPath, `${JSON.stringify({ knownPhotos, alerts: alertHistory }, null, 2)}\n`);
  console.log(`Updated ${path.basename(outputPath)}: ${latestCollection ? latestCollection.name : 'no collections'}`);
}

updateData();

if (process.argv.includes('--watch')) {
  console.log('Watching photo folders for new images...');
  setInterval(updateData, 2000);
}
