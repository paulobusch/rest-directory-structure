const { RestPath } = require('./rest-path');
const express = require('express');
const app = express();

const config = {
    input: 'rest',
    files: {
        get: 'get.js',
        post: 'post.js',
        put: 'put.js',
        delete: 'del.js'
    },
    params: {
        identifier: '@',
        separator: ','
    }
};

RestPath.setConfig(config);
const noAuth = ['login'];
const auth = async (req, res, next) => { next(); };
for (let router of RestPath.getRouters()) {
    const byAuth = !noAuth.some(a => router.path.indexOf(a) !== -1);
    if (byAuth)
        app[router.method](router.path, auth, router.call);
    else
        app[router.method](router.path, router.call);
}
app.get('/', (req, res) => {
    res.send(RestPath.compile());
});
app.listen(3000, () => { console.log('Runing on port: 3000'); });