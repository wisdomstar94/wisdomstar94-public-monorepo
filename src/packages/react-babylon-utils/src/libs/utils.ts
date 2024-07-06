export function calculateDistance3D(point1: { x: number; y: number; z: number }, point2: { x: number; y: number; z: number }) {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  const dz = point2.z - point1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}