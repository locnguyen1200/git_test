const lat = 40.7128;
const lon = -74.006;
const yaw = lon * Math.PI / 180;
const pitch = lat * Math.PI / 180;

const phi = (lat * Math.PI) / 180;
const theta = (lon * Math.PI) / 180;

const x = Math.cos(phi) * Math.sin(theta);
const y = Math.sin(phi);
const z = Math.cos(phi) * Math.cos(theta);

const cosY = Math.cos(yaw);
const sinY = Math.sin(yaw);
const x1 = x * cosY - z * sinY;
const z1 = x * sinY + z * cosY;

const cosP = Math.cos(pitch);
const sinP = Math.sin(pitch);
const y2 = y * cosP - z1 * sinP;
const z2 = y * sinP + z1 * cosP;

console.log("x1:", x1);
console.log("y2:", y2);
console.log("z2:", z2);
console.log("visible:", z2 > 0);
