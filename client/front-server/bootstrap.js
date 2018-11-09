require('ignore-styles').default(['.css', '.png']);

require('babel-register')({
    ignore: [ /(node_modules)/],
    presets: ['env', 'react-app'],
    plugins: [
        'syntax-dynamic-import',
        'dynamic-import-node',
        'react-loadable/babel'
    ]
});

require('./src/server.js');