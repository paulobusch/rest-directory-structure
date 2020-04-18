# Arquitetura montada a partir do padrão REST
## Proposta
[o] Geração automática das rotas REST, a partir da estrutura de pastas do projeto
[o] Separação de responsabilidades de cada end-point em seu respectivo arquivo
[o] Geração de uma documetação simples das rotas da API
   
## Opções
[o] Compile: Compila as rotas para uma documentação HTML
[o] GetRouters: Obtem as rotas da estrutura
[o] SetConfig: Definir as configurações 

## Exemplo
```
REST: 
    POST    = users
    GET     = users
    GET     = users/:id
    PUT     = users/:id
    DELETE  = users/:id

REST na estrutura de pastas 
    users/
        post.ts
        get.ts
        @id/
            get.ts
            put.ts
            del.ts
```
    
## Configuração
```
input: Diretório com a estrutura REST de pastas
files: {
    get: Nome do arquivo para GET
    post: Nome do arquivo para POST 
    put: Nome do arquivo para PUT
    delete: Nome do arquivo para DELETE 
}
params: {
    identifier: Identificador de parâmetro (@)       
    separator: Separador de parâmetro (,)
}
```