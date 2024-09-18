export function compareVersion(target1: string, target2: string): 'left-higher' | 'right-higher' | 'same' {
  const target1Split = target1
    .replace('v', '')
    .split('.')
    .map((k) => Number(k));
  const target2Split = target2
    .replace('v', '')
    .split('.')
    .map((k) => Number(k));

  // major version check
  if (target1Split[0] > target2Split[0]) {
    return 'left-higher';
  }

  if (target1Split[0] < target2Split[0]) {
    return 'right-higher';
  }

  // minor version check
  if (target1Split[1] > target2Split[1]) {
    return 'left-higher';
  }

  if (target1Split[1] < target2Split[1]) {
    return 'right-higher';
  }

  // patch version check
  if (target1Split[2] > target2Split[2]) {
    return 'left-higher';
  }

  if (target1Split[2] < target2Split[2]) {
    return 'right-higher';
  }

  return 'same';
}
