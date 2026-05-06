const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

export function decryptVigenere(cipherText, key) {
  if (!key) return cipherText;
  const cleanKey = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  if (!cleanKey) return cipherText;
  
  let result = '';
  for (let i = 0, j = 0; i < cipherText.length; i++) {
    const char = cipherText[i];
    const upperChar = char.toUpperCase();
    const index = ALPHABET.indexOf(upperChar);
    if (index === -1) {
      result += char;
      continue;
    }
    const keyChar = cleanKey[j % cleanKey.length];
    const keyIndex = ALPHABET.indexOf(keyChar);
    const newIndex = (index - keyIndex + 33) % 33;
    result += ALPHABET[newIndex];
    j++;
  }
  return result;
}