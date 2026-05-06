const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.'
};
const REVERSE_MAP = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

export function morseToText(morseCode) {
  const words = morseCode.trim().split('/').map(w => w.trim());
  return words.map(word => 
    word.split(' ').map(symbol => REVERSE_MAP[symbol] || '?').join('')
  ).join(' ');
}

export function getMorseTable() {
  return MORSE_MAP;
}