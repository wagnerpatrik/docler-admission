# Chatter

Dockler admission application, built with [Socket.io-Client](https://socket.io/) v: 2.2.0.

## Running the app with npm/yarn

For first run: cd/navigate to project folder and run ```npm/yarn install```

Then: run ```npx serve``` and navigate to: http://localhost:5000 in your browser.

## Running the app without npm/yarn
Without basic dev server import/export functionality won't work, so please checkout commit #3b02416 and then
edit chatter.html file and swap the first script-tag's source attribute to: https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js
and open the edited file in your browser.
