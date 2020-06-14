const compose = (...fns) => (initalValue) =>
  fns.reduceRight((g, f) => f(g), initalValue);

const appendMessage = (parent) => (node) =>
  node && parent.append(node);

const toggleClass = (node, cssClass) =>
  node[[...node].includes(cssClass) ? 'remove' : 'add'](cssClass);

const scrollToBottom = (scrolledElement) =>
  (scrolledElement.scrollTop = scrolledElement.scrollHeight);

export { compose, appendMessage, toggleClass, scrollToBottom };
