import { HARMFUL_CHARACTERS_RE, HARMFUL_CHARACTERS_MAP } from './constants.js';

const compose = (...fns) => (initalValue) =>
  fns.reduceRight((accumulatedValue, f) => f(accumulatedValue), initalValue);

const appendMessage = (parent) => (node) => node && parent.append(node);

const toggleClass = (classes, cssClass) =>
  classes[[...classes].includes(cssClass) ? 'remove' : 'add'](cssClass);

const scrollToBottom = (scrolledElement) =>
  (scrolledElement.scrollTop = scrolledElement.scrollHeight);

const sanitizer = (string) =>
  string.replace(HARMFUL_CHARACTERS_RE, (match) => HARMFUL_CHARACTERS_MAP[match]);

export { compose, appendMessage, toggleClass, scrollToBottom, sanitizer };
