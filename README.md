# Angular Universal Firebase Boilerplate

A Firebase boilerplate for an Angular project with Universal preinstalled and correctly configured to deploy to Firebase Functions and Hosting.

## Installation

```npm
$ git clone https://github.com/ribalnasr/angular-universal-firebase-functions-boilerplate YOUR_PROJECT_NAME
```

Navigate to the project's folder

```npm
$ cd YOUR_PROJECT_NAME
```

Install dependencies in root, apps/app/ folder and functions/ folder, by running:

```npm
$ npm run init
```

## Usage

A blank Angular app is inside apps/app/ folder. Build Your website there.


## Development server

Run `npm run serve` for a dev server. This is similar to running `ng serve` inside the apps/app folder.

## Production (SSR) server

Make sure you have firebase-tools installed

```npm
$ npm i -g firebase-tools@latest
```

Login to firebase

```npm
$ firebase login
```
then follow the instructions in your browser

Specify the firebase project you're using:

```npm
$ firebase use YOUR_PROJECT_ID
```

**Build SSR version**
Run `npm run init` to merge site/package.json to functions/package.json.
Then run `npm run build` to build the server version. (This will update files in /public and /functions/lib.)

**serve SSR version**
Run `npm run serve:ssr` for the SSR server. (You might need to enter your user's password.)
Note: Production server does not auto-reload on file changes. You will have to build and serve again.


## Deployment
Before deploying make sure to compile and build the latest changes to your code by running `npm run build`.
This automatically builds the SSR version into the functions/lib folder, and the browser version into the public/ folder and then moves the index.html from the public/ folder to the functions/lib/server folder.

**To deploy the latest built files and functions:**
```npm
$ npm run deploy
```

This will deploy functions and hosting files. To deploy everything run `npm run deploy:all`.