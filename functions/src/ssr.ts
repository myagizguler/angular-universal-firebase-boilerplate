import * as angularUniversal from './universal/express-firebase';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

const siteLMM = require('./server/site/main').LAZY_MODULE_MAP;

export const siteSSR = angularUniversal.trigger({
    index: __dirname + '/server/site/index.html',
    main: __dirname + '/server/site/main',
    enableProdMode: true,
    cdnCacheExpiry: 1200,
    browserCacheExpiry: 600,
    extraProviders: [
        provideModuleMap(siteLMM)
    ]
});
