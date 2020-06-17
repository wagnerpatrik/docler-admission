const WS_URL = 'http://35.157.80.184:8080/';
const HIDDEN_CLASS = 'hidden';
const LS_USER_NAME_KEY = 'userName';
const NODE_SELECTORS = [
  '#conversation',
  '#user-name',
  '#user-name-wrapper',
  '#user-name-input',
  '#message-input',
  '.input-container',
];
const HARMFUL_CHARACTERS_MAP = {
  '`': '&grave;',
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};
const HARMFUL_CHARACTERS_RE = /[`&<>"'/]/gi;

export {
  WS_URL,
  HIDDEN_CLASS,
  LS_USER_NAME_KEY,
  NODE_SELECTORS,
  HARMFUL_CHARACTERS_MAP,
  HARMFUL_CHARACTERS_RE,
};
