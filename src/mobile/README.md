<div align="center">

# Adapters

![](https://raw.githubusercontent.com/CodePlayData/adapters/main/assets/adapters-white-logo.png)

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
