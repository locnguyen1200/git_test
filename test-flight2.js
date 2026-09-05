const tokyo = { lat: 35.6762, lon: 139.6503 };
const ny = { lat: 40.7128, lon: -74.006 };

const targetYawAngle = ny.lon * Math.PI / 180;
const targetPitchAngle = ny.lat * Math.PI / 180;

let startYaw = tokyo.lon * Math.PI / 180;
let startPitch = tokyo.lat * Math.PI / 180;

let diffYaw = (targetYawAngle - startYaw) % (Math.PI * 2);
if (diffYaw > Math.PI) diffYaw -= Math.PI * 2;
if (diffYaw < -Math.PI) diffYaw += Math.PI * 2;

function project(lat, lon, yaw, pitch) {
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

  return z2 > 0;
}

for (let i = 0; i <= 10; i++) {
  const progress = i / 10;
  const ease = 0.5 - Math.cos(progress * Math.PI) / 2;
  const currentYaw = startYaw + diffYaw * ease;
  const currentPitch = startPitch + (targetPitchAngle - startPitch) * ease;
  console.log(`Progress: ${progress.toFixed(1)}, Yaw: ${currentYaw.toFixed(2)}, Visible: ${project(ny.lat, ny.lon, currentYaw, currentPitch)}`);
}
