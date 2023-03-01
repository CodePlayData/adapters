<div align="center">

# Adapters

![](https://raw.githubusercontent.com/CodePlayData/adapters/dart-flutter/assets/adapters-dark-logo.png)

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
|**GenericQueue** |  Essa classe normalmente é colocada antes de um banco de dados para controlar a _inflow_ e evitar o consumo de memória do servidor. Possui o comportamento de uma fila.|

---
<br>

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
