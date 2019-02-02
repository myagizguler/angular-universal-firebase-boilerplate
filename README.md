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

Install dependencies in root and functions/ folder:

```npm
$ npm i && cd functions && npm i && cd ..
```

## Usage

A blank Angular app is inside src/ folder. Build Your website there.

## Deployment

Make sure you have firebase-tools installed

```npm
$ npm i -g firebase-tools
```

Specify the firebase project your using:

```npm
$ firebase use YOUR_PROJECT_ID
```

Then deploy to firebase.

```npm
$ firebase deploy --only functions,hosting
```
Note: Deploying functions automatically pre-runs `npm run build:ssr` which builds the ssr version into the functions/lib folder and the browser version into the public/ folder, then moves the index.html from the public folder to the functions folder.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run fireserve` for the Universal server. Navigate to `http://localhost:5000/`. The app will not automatically reload when source files are modified. This command builds the universal version first by running `npm build:ssr`, then serves Firebase hosting and function by running `sudo firebase serve --only hosting,functions`. You might need to enter your password.