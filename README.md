# Angular Universal Firebase Functions Boilerplate

A Firebase boilerplate for an Angular project with Universal preinstalled and correctly configured to deploy to Firebase Functions and Hosting.

Comes with pre-installed:
- Bootsrap & NgBootstrap (https://ng-bootstrap.github.io)
- Angular/Fire2 (https://github.com/angular/angularfire2)

## Installation

```npm
$ git clone https://github.com/ribalnasr/angular-universal-firebase-functions-boilerplate YOUR_PROJECT_NAME
```

Navigate to the project's folder

```npm
$ cd YOUR_PROJECT_NAME
```

Install dependencies in root, site/ folder and functions/ folder, by running:

```npm
$ npm run init
```

## Usage

A blank Angular app is inside site/ folder. Build Your website there.

## Deployment

Make sure you have firebase-tools installed

```npm
$ npm i -g firebase-tools
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

Then deploy to firebase.
Note: Deploying functions automatically builds the ssr version into the functions/lib folder, and the browser version into the public/ folder and then moves the index.html from the public folder to the functions folder.

```npm
$ npm run fire:deploy
```

This will build and deploy functions and hosting files. To deploy everything run `npm run fire:deploy:all`.

## Development server

Run `npm run serve` for a dev server.

## Production (SSR) server

Run `npm run fire:build:serve` for the SSR server.
Note: Production server does not auto-reload on file changes. You will have to build and serve again.