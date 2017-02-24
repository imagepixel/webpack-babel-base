import '../sass/main.scss';

import myDefaultFunc, {myFunc, MY_CONST} from './module';

// Require all available icons
const context = require.context('../assets/icons', false, /\.svg?$/);
context.keys().forEach(context);

myDefaultFunc();
myFunc();
console.log(MY_CONST); // eslint-disable-line no-console

require(['./async-module'], (asyncModule) => {
  asyncModule.myAsyncFunc();
});
