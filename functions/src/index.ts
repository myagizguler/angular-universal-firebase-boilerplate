import * as angularUniversal from 'angular7-universal-express-firebase';

export const serverapp = angularUniversal.trigger({
  index: __dirname + '/../ssr/browser/index.html',
  main: __dirname + '/../ssr/server/main',
  enableProdMode: true,
  cdnCacheExpiry: 1200,
  browserCacheExpiry: 600
});
