const fs = require('fs');
const path = require('path');

const collections = [
  { name: 'Black & White', folder: 'bw_photos', link: 'black-and-white.html' },
  { name: 'Colour', folder: 'colour_photos', link: 'colour.html' },
  { name: 'Places', folder: 'places_photos', link: 'places.html' },
  { name: 'Portraits', folder: 'portrait_photos', link: 'portraits.html' }
];
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const outputPath = path.join(__dirname, 'collection-data.js');

function getCollectionData(collection) {
  const folderPath = path.join(__dirname, collection.folder);
  const files = fs.existsSync(folderPath)
    ? fs.readdirSync(folderPath).filter((file) => imageExtensions.has(path.extname(file).toLowerCase()))
    : [];
  const newestTime = files.reduce((latest, file) => {
    const modifiedTime = fs.statSync(path.join(folderPath, file)).mtimeMs;
    return Math.max(latest, modifiedTime);
  }, 0);

  return {
    name: collection.name,
    photosAdded: files.length,
    dateAdded: newestTime ? new Date(newestTime).toISOString().slice(0, 10) : null,
    link: collection.link,
    newestTime
  };
}

function updateData() {
  const data = collections.map(getCollectionData).filter((collection) => collection.photosAdded > 0);
  const latest = data.slice().sort((first, second) => second.newestTime - first.newestTime)[0] || null;
  const latestCollection = latest ? (({ newestTime, ...collection }) => collection)(latest) : null;
  const cleanCollections = data
    .sort((first, second) => second.newestTime - first.newestTime)
    .map(({ newestTime, ...collection }) => collection);
  const output = `window.collectionData = ${JSON.stringify({ latestCollection, collections: cleanCollections }, null, 2)};\n`;
  fs.writeFileSync(outputPath, output);
  console.log(`Updated ${path.basename(outputPath)}: ${latestCollection ? latestCollection.name : 'no collections'}`);
}

updateData();

if (process.argv.includes('--watch')) {
  console.log('Watching photo folders for new images...');
  setInterval(updateData, 2000);
}
