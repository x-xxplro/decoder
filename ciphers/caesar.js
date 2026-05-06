const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

export function decryptCaesar(text, shift) {
  shift = ((shift % 33) + 33) % 33;
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    const index = ALPHABET.indexOf(upper);
    if (index === -1) return char;
    const newIndex = (index - shift + 33) % 33;
    return ALPHABET[newIndex];
  }).join('');
}

export function getAlphabet() {
  return ALPHABET.split('');
}