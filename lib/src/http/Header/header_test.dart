// Copyright 2023 Pedro Paulo Teixeira dos Santos

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import 'package:test/test.dart';

import 'package:adapters/src/http/Header/header.dart';

void main() {
  group('Testando a classe Header.', () {
    test('Inserindo uma string como input.', () {
      final header = Header('content-type: application/json; method: GET');
      expect(header.headers,
          {'content-type': 'application/json', 'method': 'GET'});
    });

    test('Inserindo uma string incorreta.', () {
      expect(
          () => Header('testando com uma string errada,.'),
          throwsA(predicate((e) =>
              e.toString() ==
              'The only separator allowed for strings is ";"')));
    });

    test('Inserindo um map como input.', () {
      final header = Header(
          {'Content-Type': 'application/json', 'Accept': 'application/json'});

      expect(header.headers,
          {'Content-Type': 'application/json', 'Accept': 'application/json'});
    });

    test('Inserindo um input do tipo incorreto.', () {
      expect(
          () => Header(1),
          throwsA(predicate((e) =>
              e.toString() == 'This type of header is not supported yet.')));
    });

    test('Inserindo um header pelo metodo append.', () {
      final header = Header('content-type: application/json');
      header.append('method', 'GET');
      expect(header.headers,
          {'content-type': 'application/json', 'method': 'GET'});
    });

    test('Deletando uma das entradas de um header.', () {
      final header = Header('content-type: application/json; method: GET');
      expect(header.headers,
          {'content-type': 'application/json', 'method': 'GET'});
      header.delete('content-type');
      expect(header.headers, {'method': 'GET'});
    });

    test('Testando o iterador do header.', () {
      final header = Header('content-type: application/json; method: GET');
      var values = ['application/json', 'GET'];
      var iterator = 0;
      for (var value in header.entries()) {
        expect(values[iterator], value);
        iterator++;
      }
    });

    test('Testando o forEach.', () {
      final header = Header('content-type: application/json; method: GET');
      var values = ['application/json', 'GET'];
      var iterator = 0;
      header.forEach(
          (key, value) => {expect(values[iterator], value), iterator++});
    });

    test('Testando um get.', () {
      final header = Header('content-type: application/json; method: GET');
      expect(header.get('method'), 'GET');
    });

    test('Testando se um header existe.', () {
      final header = Header('content-type: application/json; method: GET');
      expect(header.has('method'), true);
    });

    test('Recuperando as chaves de um header.', () {
      final header = Header('content-type: application/json; method: GET');
      var values = ['content-type', 'method'];
      var iterator = 0;
      for (var value in header.keys()) {
        expect(values[iterator], value);
        iterator++;
      }
    });

    test('Usando o Set para definir headers.', () {
      final header = Header('content-type: application/json');
      header.set('method', 'GET');
      expect(header.headers,
          {'content-type': 'application/json', 'method': 'GET'});
      header.set('method', 'POST');
      expect(header.headers,
          {'content-type': 'application/json', 'method': 'POST'});
    });

    test('Recuperando os valores de header.', () {
      final header = Header('content-type: application/json; method: GET');
      var values = ['application/json', 'GET'];
      var iterator = 0;
      for (var value in header.values()) {
        expect(values[iterator], value);
        iterator++;
      }
    });
  });
}
