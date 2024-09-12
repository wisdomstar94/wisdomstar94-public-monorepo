export function getRandomString(strLength: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < strLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
