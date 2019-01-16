# Angular Universal Firebase Functions Boilerplate

A boilerplate for Angular project with Universal preinstalled and correctly configured to deploy to Firebase Functions.

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

An blank Angular app is inside src/ folder. Build Your website there.

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
Note: Deploying functions automatically build the ssr version into the functions/lib folder, and the browser version into the public/ folder and then moves the index.html from the public folder to the functions folder.

```npm
$ firebase deploy --only functions,hosting
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Note: Only deployed version is SEO-friendly. Development server uses the browser version for faster coding.