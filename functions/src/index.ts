import * as angularUniversal from './express/express-firebase';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
const { AppModuleNgFactory, LAZY_MODULE_MAP } = require('./server/main');

export const server1 = angularUniversal.trigger({
  index: __dirname + '/server/index.html',
  main: __dirname + '/server/main',
  enableProdMode: true,
  cdnCacheExpiry: 1200,
  browserCacheExpiry: 600,
  extraProviders: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
});
