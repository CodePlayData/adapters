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

Abaixo estão os _adapters_ já implementados até agora:

| _File_   | Descrição  |
|:---------|:-----------|
|[GenericQueue](./src/collections/GenericQueue.ts) |  Essa classe normalmente é colocada antes de um banco de dados para controlar a _inflow_ e evitar o consumo de memória do servidor. Possui o comportamento de uma fila.|
| [IndexedDB*](./src/databases/IndexedDB.ts) | Utilizado para acessar a _database_ à documentos (NoSQL) orientada a eventos  de mesmo nome presente na maioria dos _browsers_ atuais.*|
| [LocalStorage](./src/databases/LocalStorage.ts) | Esse adaptador acessa o localstorage dos _browsers_ atuais, que normalmente se comportam como um banco em memória.|
| [MongoDB](./src/databases/MongoDB.ts) | Um adaptador para o clássico banco de dados orientado a documentos de mesmo nome. |
| [GPU**](./src/gpu/GPUDeviceAdapter.ts) | Esse adaptador é a forma de acesso a GPU pelos _browsers_ mais atuais**. **Ainda está em acesso Alpha**.|
| [Fetch](./src/http/client/Fetch.ts) | O http _client_ nativo de todos os _browsers_ atuais. |
| [Express](./src/http/server/ExpressApp.ts) | O servidor http mais utilizado em aplicações NodeJs.|

---
`*` O IndexedDB não pode ser testado abstraído do frontend, por isso não existem arquivos de teste.

`**` Esse adaptador de GPU na verdade utiliza uma API nativa chamada WebGPU, que ainda está em Draft funcionando apenas em versões de desenvolvedores dos _browsers_. Também não possui arquivos de testes devido ao mencionado.


