# Angular Universal Firebase Functions Boilerplate

A boilerplate for Angular project with Universal preinstalled and correctly configured to deploy to Firebase Functions.

## Installation

```npm
$ git clone https://github.com/ribalnasr/angular-universal-firebase-functions-boilerplate YOUR_PROJECT_NAME
```

Install dependencies in root and functions/ folder:

```npm
$ npm i && cd functions && npm i && cd ..
```

## Usage

An blank Angular app is inside src/ folder. Build Your website there.

## Deployment

Specify the firebase project your using:

```npm
$ firebase use YOUR_PROJECT_ID
```

Then deploy to firebase.
Note: Deploying functions automatically build the ssr version into the functions/ folder.

```npm
$ firebase deploy --only hosting,functions
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Note: Only deployed version is SEO-friendly. Development server uses the browser version for faster coding.