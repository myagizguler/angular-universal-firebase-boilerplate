import * as angularUniversal from './universal/express-firebase';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

const appLMM = require('./server/app/main').LAZY_MODULE_MAP;

export const appSSR = angularUniversal.trigger({
    index: __dirname + '/server/app/index.html',
    main: __dirname + '/server/app/main',
    enableProdMode: true,
    cdnCacheExpiry: 1200,
    browserCacheExpiry: 600,
    extraProviders: [
        provideModuleMap(appLMM)
    ]
});
