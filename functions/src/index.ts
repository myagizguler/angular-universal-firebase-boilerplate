import * as angularUniversal from 'angular7-universal-express-firebase';

export const server = angularUniversal.trigger({
  index: __dirname + '/server/index.html',
  main: __dirname + '/server/main',
  enableProdMode: true,
  cdnCacheExpiry: 1200,
  browserCacheExpiry: 600,
});
