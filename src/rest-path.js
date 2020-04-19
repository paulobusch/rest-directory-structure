const fs = require('fs');
const path = require('path');
const _ = require('lodash');
class RestPath {    
    compile() {
        if (!this.config) throw new Error('Require configure RestPath'); 
        const routers = this.getRouters();
        const fileTemplate = fs.readFileSync('./src/template/documentation.html').toString('utf8');
        const json = JSON.stringify(_.orderBy(routers, ['path', 'method']));
        return fileTemplate
            .replace(/\${rows}/gi, json);
    }
    getRouters() {
        if (!this.config) throw new Error('Require configure RestPath'); 
        const routers = [];
        const files = this._listFiles(this.config.input);
        for (let file of files) {
            const module = path.join('./../', file);
            const call = require(module);
            const pathRout = file.split(this.config.input)[1];
            const dir = pathRout.substr(0, pathRout.lastIndexOf('/'));
            const name = pathRout.substr(pathRout.lastIndexOf('/') + 1);
            const router = { path: this._getRouter(dir), call: call, method: this._getMethod(name) };
            if (!router.method || !router.path) continue;
            routers.push(router);
        }
        return routers;
    }
    setConfig(config) { 
        this.config = config; 
    }
    _getRouter(dir) {
        const { params } = this.config;
        if (!dir) return null;
        return dir
            .replace(new RegExp(params.identifier, 'g'), ':')
            .replace(new RegExp(params.separator, 'g'), '/');
    }
    _getMethod(file) {
        const { files } = this.config;
        switch(file) {
            case files.get: return 'get'; 
            case files.put: return 'put'; 
            case files.post: return 'post'; 
            case files.delete: return 'delete'; 
        }
        return null;
    }
    _listFiles(dirPath, arrayOfFiles) {
        let files = fs.readdirSync(dirPath)
        arrayOfFiles = arrayOfFiles || [];
       
        for (let file of files) {
            if (fs.statSync(`${dirPath}/${file}`).isDirectory())
              arrayOfFiles = this._listFiles(`${dirPath}/${file}`, arrayOfFiles);
            else
              arrayOfFiles.push(`${dirPath}/${file}`);
        }
        return arrayOfFiles;
    }
}

module.exports = { 
    RestPath: new RestPath()
};