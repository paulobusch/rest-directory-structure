const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function getRouter(params, dir) {
    if (!dir) return null;
    return dir
        .replace(new RegExp(params.identifier, 'g'), ':')
        .replace(new RegExp(params.separator, 'g'), '/')
        .replace(new RegExp('\\\\', 'g'), '/');
}

function getMethod(files, file) {
    if (files.get.some(n => file.indexOf(n) === 0)) return 'get';
    if (files.put.some(n => file.indexOf(n) === 0)) return 'put';
    if (files.post.some(n => file.indexOf(n) === 0)) return 'post';
    if (files.delete.some(n => file.indexOf(n) === 0)) return 'delete';
    return null;
}

function listFiles(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || [];
   
    for (let file of files) {
        const findDir = path.join(dirPath, file);
        if (fs.statSync(findDir).isDirectory())
          arrayOfFiles = listFiles(findDir, arrayOfFiles);
        else
          arrayOfFiles.push(findDir);
    }
    return arrayOfFiles;
};

class RestTree {    
    compile(currentPath) {
        if (!this.config) throw new Error('Require configure RestTree'); 
        const routers = this.getRouters(currentPath);
        const pathFile = path.join(__dirname, 'docs/index.html');
        const fileTemplate = fs.readFileSync(pathFile).toString('utf8');
        const json = JSON.stringify(_.orderBy(routers, ['path', 'method']));
        return fileTemplate
            .replace(/\${rows}/gi, json);
    }
    getRouters(currentPath) {
        if (!currentPath) throw new Error('Invalid currentPath, require value');
        if (!this.config) throw new Error('Require configure RestTree'); 
        const baseFolder = this.config.input.substr(0, this.config.input.indexOf('\\'));
        this.currentPath = currentPath.substr(0, currentPath.lastIndexOf(baseFolder));
        const routers = [];
        const files = listFiles(path.join(this.currentPath, this.config.input));
        for (let file of files) {
            const pathRout = file.split(this.config.input)[1];
            const dir = pathRout.substr(0, pathRout.lastIndexOf('\\'));
            const name = pathRout.substr(pathRout.lastIndexOf('\\') + 1);
            const router = { path: getRouter(this.config.params, dir), module: require(file), method: getMethod(this.config.files, name) };
            if (!router.method || !router.path) continue;
            routers.push(router);
        }
        return routers;
    }
    setConfig(config) {
        if (!config.input || !config.files || !config.params) 
            throw new Error('Invalid configuration for set, require props: input, files and params'); 
        this.config = config;
    }
}

module.exports = { 
    RestTree: new RestTree()
};