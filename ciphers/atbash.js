const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
const REVERSED = ALPHABET.split('').reverse().join('');

export function decryptAtbash(text) {
  return text.split('').map(char => {
    const upper = char.toUpperCase();
    const index = ALPHABET.indexOf(upper);
    if (index === -1) return char;
    return REVERSED[index];
  }).join('');
}