let userName;

const [
  chatWindow,
  userNameSpan,
  userNameSpanWrapper,
  userNameInput,
  userMessageInput,
  userNameInputWrapper,
] = (() =>
  [
    '#conversation',
    '#user-name',
    '#user-name-wrapper',
    '#user-name-input',
    '#message-input',
    '.input-container',
  ].map((selector) => document.querySelector(selector)))();

const socket = (() => {
  const WS_URL = 'http://35.157.80.184:8080/';
  return io(WS_URL);
})();

const createMessageNode = (() => {
  const scrollBottom = () => (chatWindow.scrollTop = chatWindow.scrollHeight);

  const createSenderNode = (name, div) => {
    let userSpan = document.createElement('span');
    userSpan.className = 'sender';
    userSpan.innerText = `${name}: `;
    div.append(userSpan);
  };

  const createMessageNode = (party) => ({ user, message }) => {
    let messageElem = document.createElement('div');
    messageElem.className = `message ${party}`;

    party === 'bot' && createSenderNode(user, messageElem);

    let messageSpan = document.createElement('span');
    messageSpan.className = `text ${party}`;
    messageSpan.innerText = message;
    messageElem.append(messageSpan);

    setTimeout(scrollBottom, 0);
    return messageElem;
  };

  return createMessageNode;
})();

const { saveUserName, toggleUserNameSources } = (() => {
  const LS_USER_NAME_KEY = 'userName';

  const toggleUserNameSources = () => {
    const hiddenClass = 'hidden';
    let inputClass = userNameInputWrapper.classList;
    let userNameClass = userNameSpanWrapper.classList;

    inputClass[[...inputClass].includes(hiddenClass) ? 'remove' : 'add'](hiddenClass);
    userNameClass[[...userNameClass].includes(hiddenClass) ? 'remove' : 'add'](hiddenClass);
  };

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
  const compose = (...fns) => (initalValue) => fns.reduceRight((g, f) => f(g), initalValue);

  const createUserMessage = (data) => createMessageNode('user')(data);
  const createBotMessage = ({ user, message }) =>
    user !== userName && createMessageNode('bot')({ user, message });

  const appendMessage = (node) => node && chatWindow.append(node);

  const handleBotResponse = compose(appendMessage, createBotMessage);
  const appendUserMessage = compose(appendMessage, createUserMessage);

  const handleUserInput = ({ target: { value: message } }) => {
    const payload = { message, user: userName };
    socket.send(payload)
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
