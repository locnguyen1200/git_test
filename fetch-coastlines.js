const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
// Let's use 50m for higher resolution if needed, but 110m is already MUCH better than what we have.
// Let's use 50m:
const url50m = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_coastline.geojson';

https.get(url50m, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const geojson = JSON.parse(data);
      const polygons = [];
      
      geojson.features.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
          // Downsample slightly to optimize? Every 2nd point.
          const coords = feature.geometry.coordinates;
          const simplified = [];
          for (let i = 0; i < coords.length; i += 2) {
            simplified.push([Number(coords[i][0].toFixed(3)), Number(coords[i][1].toFixed(3))]);
          }
          if (simplified.length > 0) {
            polygons.push(simplified);
          }
        } else if (feature.geometry.type === 'MultiLineString') {
          feature.geometry.coordinates.forEach(line => {
            const simplified = [];
            for (let i = 0; i < line.length; i += 2) {
              simplified.push([Number(line[i][0].toFixed(3)), Number(line[i][1].toFixed(3))]);
            }
            if (simplified.length > 0) {
              polygons.push(simplified);
            }
          });
        }
      });
      
      const fileContent = `window.globeHighResCoastlines = ${JSON.stringify(polygons)};`;
      fs.writeFileSync('/Users/minhlocnguyen/repos/git_test/globe-coastlines.js', fileContent);
      console.log('Successfully wrote globe-coastlines.js with ' + polygons.length + ' lines.');
    } catch (e) {
      console.error('Error parsing:', e);
    }
  });
}).on('error', err => {
  console.error('Network Error:', err);
});

