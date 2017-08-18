Used repo for startup:
https://github.com/GoogleCloudPlatform/nodejs-getting-started.git

# Chatter

Simple chat app with websockets on front-end and a database on back-end.

## Start

* `npm run build` (production mode) or `npm run build:dev` (development mode) to generate a bundle js file for client app. `npm run start` to launch a http server that serves the web page and a websockets server that communicates chat messages with clients.

## Tips

* For development, use `webpack -d --watch`. `-d` for development mode (which generates source-map), and `--watch` so webpack keeps watching files and bundle them whenever you make changes.
