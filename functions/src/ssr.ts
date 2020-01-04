import * as angularUniversal from './universal/express-firebase';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

const ssr = (appName: string) => {
    const appLMM = require('./server/' + appName + '/main').LAZY_MODULE_MAP;

    return angularUniversal.trigger({
        index: __dirname + '/server/' + appName + '/index.html',
        main: __dirname + '/server/' + appName + '/main',
        enableProdMode: true,
        cdnCacheExpiry: 1200,
        browserCacheExpiry: 600,
        extraProviders: [
            provideModuleMap(appLMM)
        ]
    });

}

export const appSSR = ssr('app');
