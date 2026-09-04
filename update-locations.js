const fs = require('fs');
const path = require('path');

const REPO_DIR = __dirname;
const CONFIG_PATH = path.join(REPO_DIR, 'photo-locations.json');
const OUTPUT_JS_PATH = path.join(REPO_DIR, 'photo-locations.js');

// Extensive Built-in Geo-Dictionary of photography hubs and major cities
const GEO_DICTIONARY = {
  // Asia & Pacific
  'tokyo': { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  'kyoto': { name: 'Kyoto', lat: 35.0116, lon: 135.7681, country: 'Japan' },
  'osaka': { name: 'Osaka', lat: 34.6937, lon: 135.5023, country: 'Japan' },
  'mount fuji': { name: 'Mount Fuji', lat: 35.3606, lon: 138.7274, country: 'Japan' },
  'fuji': { name: 'Mount Fuji', lat: 35.3606, lon: 138.7274, country: 'Japan' },
  'sapporo': { name: 'Sapporo', lat: 43.0618, lon: 141.3545, country: 'Japan' },
  'hiroshima': { name: 'Hiroshima', lat: 34.3853, lon: 132.4553, country: 'Japan' },
  'nara': { name: 'Nara', lat: 34.6851, lon: 135.8048, country: 'Japan' },
  'seoul': { name: 'Seoul', lat: 37.5665, lon: 126.9780, country: 'South Korea' },
  'busan': { name: 'Busan', lat: 35.1796, lon: 129.0756, country: 'South Korea' },
  'jeju': { name: 'Jeju', lat: 33.4996, lon: 126.5312, country: 'South Korea' },
  'ho chi minh': { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, country: 'Vietnam' },
  'ho chi minh city': { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, country: 'Vietnam' },
  'saigon': { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, country: 'Vietnam' },
  'hcm': { name: 'Ho Chi Minh City', lat: 10.8231, lon: 106.6297, country: 'Vietnam' },
  'hanoi': { name: 'Hanoi', lat: 21.0285, lon: 105.8542, country: 'Vietnam' },
  'da nang': { name: 'Da Nang', lat: 16.0544, lon: 108.2022, country: 'Vietnam' },
  'hoi an': { name: 'Hoi An', lat: 15.8801, lon: 108.3380, country: 'Vietnam' },
  'hue': { name: 'Hue', lat: 16.4637, lon: 107.5909, country: 'Vietnam' },
  'dalat': { name: 'Dalat', lat: 11.9404, lon: 108.4583, country: 'Vietnam' },
  'da lat': { name: 'Dalat', lat: 11.9404, lon: 108.4583, country: 'Vietnam' },
  'nha trang': { name: 'Nha Trang', lat: 12.2388, lon: 109.1967, country: 'Vietnam' },
  'phu quoc': { name: 'Phu Quoc', lat: 10.2899, lon: 103.9840, country: 'Vietnam' },
  'ha long': { name: 'Ha Long', lat: 20.9505, lon: 107.0734, country: 'Vietnam' },
  'halong': { name: 'Ha Long', lat: 20.9505, lon: 107.0734, country: 'Vietnam' },
  'sapa': { name: 'Sapa', lat: 22.3364, lon: 103.8438, country: 'Vietnam' },
  'sa pa': { name: 'Sapa', lat: 22.3364, lon: 103.8438, country: 'Vietnam' },
  'ninh binh': { name: 'Ninh Binh', lat: 20.2506, lon: 105.9745, country: 'Vietnam' },
  'can tho': { name: 'Can Tho', lat: 10.0452, lon: 105.7469, country: 'Vietnam' },
  'quy nhon': { name: 'Quy Nhon', lat: 13.7820, lon: 109.2197, country: 'Vietnam' },
  'vung tau': { name: 'Vung Tau', lat: 10.3460, lon: 107.0843, country: 'Vietnam' },
  'bangkok': { name: 'Bangkok', lat: 13.7563, lon: 100.5018, country: 'Thailand' },
  'chiang mai': { name: 'Chiang Mai', lat: 18.7883, lon: 98.9853, country: 'Thailand' },
  'phuket': { name: 'Phuket', lat: 7.8804, lon: 98.3923, country: 'Thailand' },
  'singapore': { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore' },
  'hong kong': { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, country: 'Hong Kong' },
  'taipei': { name: 'Taipei', lat: 25.0330, lon: 121.5654, country: 'Taiwan' },
  'bali': { name: 'Bali', lat: -8.3405, lon: 115.0920, country: 'Indonesia' },
  'jakarta': { name: 'Jakarta', lat: -6.2088, lon: 106.8456, country: 'Indonesia' },
  'kuala lumpur': { name: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, country: 'Malaysia' },
  'manila': { name: 'Manila', lat: 14.5995, lon: 120.9842, country: 'Philippines' },
  'sydney': { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' },
  'melbourne': { name: 'Melbourne', lat: -37.8136, lon: 144.9631, country: 'Australia' },
  'auckland': { name: 'Auckland', lat: -36.8485, lon: 174.7633, country: 'New Zealand' },
  'queenstown': { name: 'Queenstown', lat: -45.0312, lon: 168.6626, country: 'New Zealand' },

  // North America
  'new york': { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  'new york city': { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  'nyc': { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  'los angeles': { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'USA' },
  'la': { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'USA' },
  'san francisco': { name: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'USA' },
  'sf': { name: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'USA' },
  'seattle': { name: 'Seattle', lat: 47.6062, lon: -122.3321, country: 'USA' },
  'chicago': { name: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'USA' },
  'miami': { name: 'Miami', lat: 25.7617, lon: -80.1918, country: 'USA' },
  'austin': { name: 'Austin', lat: 30.2672, lon: -97.7431, country: 'USA' },
  'boston': { name: 'Boston', lat: 42.3601, lon: -71.0589, country: 'USA' },
  'toronto': { name: 'Toronto', lat: 43.6532, lon: -79.3832, country: 'Canada' },
  'vancouver': { name: 'Vancouver', lat: 49.2827, lon: -123.1207, country: 'Canada' },
  'montreal': { name: 'Montreal', lat: 45.5017, lon: -73.5673, country: 'Canada' },
  'mexico city': { name: 'Mexico City', lat: 19.4326, lon: -99.1332, country: 'Mexico' },
  'honolulu': { name: 'Honolulu', lat: 21.3069, lon: -157.8583, country: 'USA' },
  'hawaii': { name: 'Honolulu', lat: 21.3069, lon: -157.8583, country: 'USA' },

  // Europe
  'paris': { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  'london': { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  'rome': { name: 'Rome', lat: 41.9028, lon: 12.4964, country: 'Italy' },
  'florence': { name: 'Florence', lat: 43.7696, lon: 11.2558, country: 'Italy' },
  'venice': { name: 'Venice', lat: 45.4408, lon: 12.3155, country: 'Italy' },
  'milan': { name: 'Milan', lat: 45.4642, lon: 9.1900, country: 'Italy' },
  'berlin': { name: 'Berlin', lat: 52.5200, lon: 13.4050, country: 'Germany' },
  'munich': { name: 'Munich', lat: 48.1351, lon: 11.5820, country: 'Germany' },
  'amsterdam': { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'Netherlands' },
  'barcelona': { name: 'Barcelona', lat: 41.3851, lon: 2.1734, country: 'Spain' },
  'madrid': { name: 'Madrid', lat: 40.4168, lon: -3.7038, country: 'Spain' },
  'prague': { name: 'Prague', lat: 50.0755, lon: 14.4378, country: 'Czech Republic' },
  'vienna': { name: 'Vienna', lat: 48.2082, lon: 16.3738, country: 'Austria' },
  'zurich': { name: 'Zurich', lat: 47.3769, lon: 8.5417, country: 'Switzerland' },
  'lisbon': { name: 'Lisbon', lat: 38.7223, lon: -9.1393, country: 'Portugal' },
  'athens': { name: 'Athens', lat: 37.9838, lon: 23.7275, country: 'Greece' },
  'santorini': { name: 'Santorini', lat: 36.3932, lon: 25.4615, country: 'Greece' },
  'dublin': { name: 'Dublin', lat: 53.3498, lon: -6.2603, country: 'Ireland' },
  'edinburgh': { name: 'Edinburgh', lat: 55.9533, lon: -3.1883, country: 'UK' },
  'reykjavik': { name: 'Reykjavik', lat: 64.1466, lon: -21.9426, country: 'Iceland' },
  'copenhagen': { name: 'Copenhagen', lat: 55.6761, lon: 12.5683, country: 'Denmark' },
  'stockholm': { name: 'Stockholm', lat: 59.3293, lon: 18.0686, country: 'Sweden' },

  // South America, Africa & Middle East
  'rio': { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
  'rio de janeiro': { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729, country: 'Brazil' },
  'buenos aires': { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816, country: 'Argentina' },
  'cairo': { name: 'Cairo', lat: 30.0444, lon: 31.2357, country: 'Egypt' },
  'cape town': { name: 'Cape Town', lat: -33.9249, lon: 18.4241, country: 'South Africa' },
  'marrakech': { name: 'Marrakech', lat: 31.6295, lon: -7.9811, country: 'Morocco' },
  'dubai': { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE' },
  'istanbul': { name: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'Turkey' }
};

const GALLERIES = [
  { file: 'black-and-white.html', folder: 'bw_photos', name: 'Black & White' },
  { file: 'colour.html', folder: 'colour_photos', name: 'Colour' },
  { file: 'places.html', folder: 'places_photos', name: 'Places' },
  { file: 'portraits.html', folder: 'portrait_photos', name: 'Portraits' }
];

function readConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
      return { customCoordinates: {}, photos: {} };
    }
  }
  return { customCoordinates: {}, photos: {} };
}

function resolveCoordinates(locationName, customCoords = {}) {
  const norm = locationName.trim().toLowerCase();
  if (customCoords[norm]) {
    return { name: locationName, ...customCoords[norm] };
  }
  if (GEO_DICTIONARY[norm]) {
    return GEO_DICTIONARY[norm];
  }
  return null;
}

function scanHtmlFiles() {
  const htmlTags = {};
  GALLERIES.forEach((g) => {
    const filePath = path.join(REPO_DIR, g.file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf8');
    const regex = /<img[^>]*class=["'][^"']*gallery-trigger[^"']*["'][^>]*>/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const tag = match[0];
      const srcMatch = tag.match(/src=["']([^"']+)["']/i);
      const locMatch = tag.match(/data-location=["']([^"']+)["']/i);
      const altMatch = tag.match(/alt=["']([^"']+)["']/i);
      if (srcMatch && locMatch) {
        const src = srcMatch[1].replace(/^\.\//, '');
        htmlTags[src] = {
          location: locMatch[1].trim(),
          alt: altMatch ? altMatch[1] : g.name,
          gallery: g.name,
          galleryLink: g.file
        };
      }
    }
  });
  return htmlTags;
}

function updateLocations() {
  const config = readConfig();
  const customCoords = config.customCoordinates || {};
  const photoMappings = config.photos || {};
  const htmlTags = scanHtmlFiles();

  // Merge HTML tags and JSON mappings
  const allPhotoTags = {};

  // Add from JSON first
  Object.keys(photoMappings).forEach((photoPath) => {
    const loc = photoMappings[photoPath];
    let galleryName = 'Gallery';
    let galleryLink = 'index.html';
    for (const g of GALLERIES) {
      if (photoPath.includes(g.folder) || photoPath.startsWith(g.folder)) {
        galleryName = g.name;
        galleryLink = g.file;
        break;
      }
    }
    allPhotoTags[photoPath] = {
      location: typeof loc === 'string' ? loc : (loc.location || loc.name),
      alt: typeof loc === 'object' && loc.alt ? loc.alt : `${galleryName} Photo`,
      gallery: galleryName,
      galleryLink
    };
  });

  // HTML data-location attributes override or augment
  Object.keys(htmlTags).forEach((photoPath) => {
    allPhotoTags[photoPath] = htmlTags[photoPath];
    if (!photoMappings[photoPath]) {
      photoMappings[photoPath] = htmlTags[photoPath].location;
    }
  });

  // Group photos by location
  const locationGroups = {};
  let totalPhotos = 0;

  Object.keys(allPhotoTags).forEach((photoSrc) => {
    const tagInfo = allPhotoTags[photoSrc];
    const locName = tagInfo.location;
    if (!locName) return;

    const coords = resolveCoordinates(locName, customCoords);
    if (!coords) {
      console.warn(`Warning: Could not resolve coordinates for location '${locName}' (photo: ${photoSrc}). Add to customCoordinates in photo-locations.json.`);
      return;
    }

    const key = coords.name.toLowerCase();
    if (!locationGroups[key]) {
      locationGroups[key] = {
        name: coords.name,
        lat: coords.lat,
        lon: coords.lon,
        country: coords.country || '',
        count: 0,
        photos: []
      };
    }

    locationGroups[key].photos.push({
      src: photoSrc,
      alt: tagInfo.alt,
      gallery: tagInfo.gallery,
      galleryLink: tagInfo.galleryLink
    });
    locationGroups[key].count++;
    totalPhotos++;
  });

  const locationList = Object.values(locationGroups).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  // Write updated JSON
  config.photos = photoMappings;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');

  // Write JavaScript client data for zero-CORS browser loading
  const clientData = {
    generatedAt: new Date().toISOString(),
    totalLocations: locationList.length,
    totalTaggedPhotos: totalPhotos,
    locations: locationList
  };

  const jsOutput = `window.globeLocationData = ${JSON.stringify(clientData, null, 2)};\n`;
  fs.writeFileSync(OUTPUT_JS_PATH, jsOutput);

  console.log(`Updated photo-locations: ${locationList.length} locations, ${totalPhotos} tagged photos.`);
  locationList.forEach(l => {
    console.log(`  - ${l.name} (${l.lat}, ${l.lon}): ${l.count} photo(s)`);
  });

  return clientData;
}

// Handle CLI arguments (e.g. node update-locations.js --tag <photo> <location>)
const args = process.argv.slice(2);
if (args[0] === '--tag' && args[1] && args[2]) {
  const photo = args[1];
  const loc = args.slice(2).join(' ');
  const config = readConfig();
  config.photos[photo] = loc;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n');
  console.log(`Tagged ${photo} with location "${loc}".`);
}

updateLocations();
