const fs = require('fs');
const data = JSON.parse(fs.readFileSync('photo-locations.json'));
const photos = data.photos;
const newPhotos = {};
for (const key in photos) {
  if (fs.existsSync(key)) {
    newPhotos[key] = photos[key];
  } else {
    // try to fix the name
    const match = key.match(/^(.*_)0+(\d{2,}\.jpg)$/);
    if (match) {
      const fixedKey = match[1] + match[2];
      if (fs.existsSync(fixedKey)) {
        newPhotos[fixedKey] = photos[key];
      }
    }
  }
}
data.photos = newPhotos;
fs.writeFileSync('photo-locations.json', JSON.stringify(data, null, 2));
