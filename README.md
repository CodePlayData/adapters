<div align="center">

# Adapters

![](./assets/adapters-dark-logo.png)

</div>

Seguindo os princípios do [Ports and Adapters - _Alistair Cockburn_](https://alistair.cockburn.us/hexagonal-architecture/) essa _lib_ é um agregado de todos os adaptadores utilizados por outros pacotes do projeto **CodePlayData**.

<br>

> Os comentários no código estarão em inglês e a documentação/testes em português.

<br>

---

<br>

## Implementação

Os diretórios estarão separados por categoria de _adapter_, por exemplo: para um _adapter_ de banco de dados em _browser_ procure os disponíveis em `src/databases/browser/IndexedDB/`. Os _adapters_ serão exportados seguindo o mesmo raciocínio a partir da pasta `src`, então para utilizá-los siga o exemplo abaixo:

```typescript
import { database, http } from '@codeplaydata/adapters';

const db = new database.browser.IndexedDB();
const server = new http.server.ExpressServer();

/.../
```

Repare que apesar de a chamada parecer mais prolíxa ela possui um motivo. Todos as base de dados poderão ter interfaces em comuns, assim como todas que forem de browser. O mesmo se repete para o http, que no caso todos os _servers_ terão interfaces em comum. Obviamente é possível desestruturar essa chamada e trabalhar diretamente com a classe para ficar menos prolíxo:

```typescript
import { database: { browser: { IndexedDB }}} from '@codeplaydata/adapters';
import { http: { server: { ExpressServer() }}} from '@codeplaydata/adapters';

const db = new IndexedDB();
const server = new ExpressServer();

/.../
```

Para seguir com o paradigma do _Ports and Adapters_ todas essas classes seguiram interfaces em comum, contudo, isso não quer dizer que não seja possível trabalhar com o _driver_ escolhido de forma customizada, basta procurar em qual propriedade da classe está o driver, veja abaixo um exemplo: 

```typescript
import { http: { server: { ExpressServer() }}} from '@codeplaydata/adapters';

const server = new ExpressServer();

// método comum da interface
server.listen
// método comum da interface
server.use
// propriedade opcional da interface
server?.router

// método específico do Express.
server.app.on(/.../)

/.../
```

Repare que o no exemplo acima ainda que a interface server...






Abaixo estão os _adapters_ já implementados até agora:

| _File_   | Descrição  |
|:---------|:-----------|
|[GenericQueue](./src/collections/GenericQueue.ts) |  Essa classe pode ser usada antes de um banco de dados para controlar o _inflow_ e evitar indisponibilidade. Possui o comportamento de uma fila.|
| [IndexedDB*](./src/databases/IndexedDB.ts) | Utilizado para acessar a _database_ à documentos (NoSQL) orientada a eventos  de mesmo nome presente na maioria dos _browsers_ atuais.*|
| [LocalStorage](./src/databases/LocalStorage.ts) | Esse adaptador acessa o localstorage dos _browsers_ atuais, que normalmente se comportam como um banco em memória.|
| [MongoDB](./src/databases/MongoDB.ts) | Um adaptador para o clássico banco de dados orientado a documentos de mesmo nome. |
| [GPU**](./src/gpu/GPUDeviceAdapter.ts) | Esse adaptador é a forma de acesso a GPU pelos _browsers_ mais atuais**. **Ainda está em acesso Alpha**.|
| [Fetch](./src/http/client/Fetch.ts) | O http _client_ nativo de todos os _browsers_ atuais. |
| [Express](./src/http/server/ExpressApp.ts) | O servidor http mais utilizado em aplicações NodeJs.|

---
`*` O IndexedDB não pode ser testado abstraído do frontend, por isso não existem arquivos de teste.

`**` Esse adaptador de GPU na verdade utiliza uma API nativa chamada WebGPU, que ainda está em Draft funcionando apenas em versões de desenvolvedores dos _browsers_. Também não possui arquivos de testes devido ao mencionado.

<br>

## Como Usar

Abaixo vemos os exemplos de utilização das classes citadas.

<br>

### Fetch

```typescript
import { Fetch } from "@codeplaydata/adapters";

const httpClient = new Fetch();
const request = new Request('https://httpstat.us/200');
const response = await httpClient.fetch(request);

```

<br>

### GenericQueue

```typescript
import { GenericQueue } from "@codeplaydata/adapters";

const localstorage = new LocalStorage();
const queue = new GenericQueue(localstorage, 2);

queue.query(/.../);

```

<br>

### Express

```typescript
import { ExpressApp, ExpressRouter } from "@codeplaydata/adapters";

const router = new ExpressRouter();
    await router.register('get', '/data', async function() {
        return;
    })
const api = new ExpressApp([{ path: '/teste', router: router.router }]);
/.../
```

<br>

### GPU

```typescript
import { GPUDeviceAdapter, GPUCommandRepository } from "@codeplaydata/adapters";

const gpu = new GPUDeviceAdapter(new GPUCommandRepository());
/.../
```

<br>

### MongoDB

```typescript
import { MongoDB } from "@codeplaydata/adapters";

const mongo = new MongoDB('mongodb://127.0.0.1:27017');

mongo.database = 'teste';
mongo.store = 'collection1';

await mongo.query(/.../)
```

<br>

### LocalStorage

```typescript
import { LocalStorage } from "@codeplaydata/adapters";

const localstorage = new LocalStorage();
localstorage.query(/.../)
```

<br>

### IndexedDB

```typescript
import { IndexedDB } from "@codeplaydata/adapters";

const idbconfig = {
    name: 'LocalTestStorage',
    version: 1,
    repositories: [
        {
            name: 'features',
            id: 'name',
            indexes: [
                {
                    indexName: 'name',
                    keypath: 'name'
                }
            ]
        }
    ]
}

const indexeddb = new IndexedDB(idbconfig);
indexeddb.query(/.../);
/.../
```

---

Copyright 2023 Pedro Paulo Teixeira dos Santos

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
