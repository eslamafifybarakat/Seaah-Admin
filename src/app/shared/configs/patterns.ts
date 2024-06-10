export const patterns = {
  email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/,
  userName: /[A-Za-z]/,
  vatNumber: /^[0-9]{11,20}/,
  nationalIdentity: /^\d{10}$/,
  phone: '5[0-9]{8}',
  url: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
  arabicChars: '[\u0600-\u06FF ]+',
  englishChars: '[a-zA-Z ]+'
  // phone: /^\+966\d{9}$/,
  // phone: '051[01]\d{5}'
};
