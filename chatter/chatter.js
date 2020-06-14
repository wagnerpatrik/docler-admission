import { NODE_SELECTORS, WS_URL, LS_USER_NAME_KEY, HIDDEN_CLASS } from '../shared/constants.js';
import { compose, appendMessage, toggleClass, scrollToBottom } from '../shared/helpers.js';

let userName;
const socket = io(WS_URL);
const [
  chatWindow,
  userNameSpan,
  userNameSpanWrapper,
  userNameInput,
  userMessageInput,
  userNameInputWrapper,
] = NODE_SELECTORS.map((selector) => document.querySelector(selector));

const createMessageNode = (() => {
  const createSenderNode = (uName, parent) => {
    let userSpan = document.createElement('span');
    userSpan.className = 'sender';
    userSpan.innerText = `${uName}: `;
    parent.append(userSpan);
  };

  return (party) => ({ user, message }) => {
    let messageElem = document.createElement('div');
    messageElem.className = `message ${party}`;

    party === 'bot' && createSenderNode(user, messageElem);

    let messageSpan = document.createElement('span');
    messageSpan.className = `text ${party}`;
    messageSpan.innerText = message;
    messageElem.append(messageSpan);

    setTimeout(scrollToBottom, 0, chatWindow);
    return messageElem;
  };
})();

const { saveUserName, toggleUserNameSources } = (() => {
  const toggleUserNameSources = () =>
    [userNameInputWrapper.classList, userNameSpanWrapper.classList].forEach(
      (wrapper) => toggleClass(wrapper, HIDDEN_CLASS));

  const saveUserName = (data) => {
    const { uName } = typeof data === 'object' ? (toggleUserNameSources(), data) : { uName: data };
    if (!uName) return;

    userName = uName;
    window.localStorage.setItem(LS_USER_NAME_KEY, userName);
    userNameInput.value = userNameSpan.innerHTML = userName;
  };

  (() => {
    const userName = window.localStorage.getItem(LS_USER_NAME_KEY) || userNameInput.value;
    userName ? saveUserName(userName) : toggleUserNameSources();
  })();

  return { saveUserName, toggleUserNameSources };
})();

const { handleBotResponse, handleUserInput } = (() => {
  const createUserMessage = (data) => createMessageNode('user')(data);
  const createBotMessage = ({ user, message }) =>
    user !== userName && createMessageNode('bot')({ user, message });

  const handleBotResponse = compose(appendMessage(chatWindow), createBotMessage);
  const appendUserMessage = compose(appendMessage(chatWindow), createUserMessage);

  const handleUserInput = ({ target: { value: message } }) => {
    const payload = { message, user: userName };
    socket.send(payload);
    appendUserMessage(payload);
    userMessageInput.value = '';
  };

  return { handleBotResponse, handleUserInput };
})();

window.onload = () => {
  socket.on('message', handleBotResponse);
  userMessageInput.addEventListener('change', handleUserInput);
  userNameSpanWrapper.addEventListener('click', toggleUserNameSources);
  userNameInput.addEventListener(
    'keypress',
    ({ key }) => key === 'Enter' && saveUserName({ uName: userNameInput.value }),
  );
};
