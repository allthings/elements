webpackJsonp([25894613747747],{'./node_modules/babel-loader/lib/index.js?{"plugins":["/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/gatsby/dist/utils/babel-plugin-extract-graphql.js","/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/babel-plugin-add-module-exports/lib/index.js","/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/babel-plugin-transform-object-assign/lib/index.js"],"presets":[["/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/babel-preset-env/lib/index.js",{"loose":true,"uglify":true,"modules":"commonjs","targets":{"browsers":["> 1%","last 2 versions","IE >= 9"]},"exclude":["transform-regenerator","transform-es2015-typeof-symbol"]}],"/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/babel-preset-stage-0/lib/index.js","/Users/mschwoerer/Develop/qipp/elements/documentation/node_modules/babel-preset-react/lib/index.js"],"cacheDirectory":true}!./src/pages/behaviours/ResourceProvider.js':function(e,s,o){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}s.__esModule=!0;var t=o("./node_modules/react/react.js"),l=r(t),n=o("../src/atoms/View.jsx"),a=r(n),u=o("./src/components/Example.js"),d=r(u),i=o("./src/components/Notes.jsx"),c=r(i),m=o("../src/behaviour/ResourceProvider.jsx"),p=r(m);s.default=function(){return l.default.createElement(a.default,null,l.default.createElement(c.default,{for:p.default}),l.default.createElement("h3",null,"Using static resources"),l.default.createElement("p",null,"Elements uses a set of static resources like images or icons. In order to benefit from caching across all apps, these resources are provided by a static asset CDN."),l.default.createElement("h3",null,"When to use the ResouceProvider"),l.default.createElement("p",null,"Whenever you like to use Icons or Illustrations, you need to use the ResouceProvider to let the components know where they are."),l.default.createElement(d.default,null,'<ThemeProvider>\n    <ResourceProvider>\n        <Icon name="trendingUp" color="red" />\n    </ResourceProvider>\n</ThemeProvider>'))},e.exports=s.default}});