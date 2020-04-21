Padrão REST na estrutura de pastas da aplicação
----
Features
----
* Geração automática das rotas REST, a partir da estrutura de pastas do projeto
* Separação de responsabilidades de cada end-point em seu respectivo arquivo
* Geração de uma documetação simples das rotas da API
   
Instalação
----------
    npm install rest-tree-directorty --save

API
---
* [`setConfig(config)`](#setconfigconfig)
* [`getRouters(currentPath)`](#getrouterscurrentpath)
* [`compile(currentPath)`](#compilecurrentpath)

----
### SetConfig(config)
Define as configurações da API.
- `input` especifica a pasta com a estrutura rest.
- `files` mapeamento dos arquivos para os métodos REST.
- `params` identificadores no nome das pastas.
    - `identifier` um parâmetro para a rota
    - `separator` mais de um parâmetro na rota
```json
{
    "input": "rest",
    "files": {
        "get": ["get", "list"],
        "post": ["create"],
        "put": ["update"],
        "delete": ["delete"]
    },
    "params": {
        "identifier": "@",
        "separator": ","
    }    
}
```

----
### GetRouters(currentPath)
Obtem as rotas da estrutura implementada.

- Retorno do método.
```js
return [{ 
    path: `string`, // A rota REST para o arquivo 
    module: `module`, // O módulo / função carregada
    method: `string`  // O método REST configurado
}];
```

- Abaixo um esboço da estrutura de pastas e sua correspondência no padrão REST.

```txt
REST na estrutura de pastas 
    users/
        create-user.ts
        detail-user.ts
        @id/
            list-user.ts
            update-user.ts
            delete-user.ts
            
REST: 
    POST    = users
    GET     = users
    GET     = users/:id
    PUT     = users/:id
    DELETE  = users/:id
```

- Exemplo de uso do método `getRouters`

```js
const { RestTree } = require('rest-tree-directorty');
const settings = require('./settings.json');
const express = require('express');
const app = express();

...

for (let router of RestTree.getRouters(__dirname))
    app[router.method](router.path, router.module);

...
```    

----
### Compile(currentPath)
Compila as rotas para uma documentação HTML.
- Gera uma tabela, uma coluna com o método REST e outra com a rota.
- Exemplo de uso do método compile

```js
const { RestTree } = require('./index');
const settings = require('./settings.json');
const express = require('express');
const app = express();

...

app.get('/', (req, res) => {
    res.send(RestTree.compile(__dirname));
});

...
```