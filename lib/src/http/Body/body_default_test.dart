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

// ignore_for_file: depend_on_referenced_packages


import 'package:test/test.dart';

import 'dart:typed_data';

import 'package:adapters/src/http/Body/body_default.dart'
    if (dart.library.html) 'package:adapters/src/http/Body/body_html.dart' show Body;


void main() {
  // Teste com: dart test -p chrome .
  group('Testando a classe Body.', () {
    test('Inserindo uma List/TypedArray como input.', () {
      var lista = [1, 2, 3, 4];
      Body body = Body(lista);
      expect(body.body, lista);
    });

    test('Inserindo uma String como input.', () {
      String msg = 'Testando uma mensagem como input.';
      Body body = Body(msg);
      expect(body.body, msg);
    });

    test('Inserindo um Map como entrada.', () {
      Map map = {'slot1': 'test'};
      Body body = Body(map);
      expect(body.body, map);
    });

    test('Inserindo um Uint8List/ArrayBuffer como entrada.', () {
      Uint8List arrayBuffer = Uint8List.fromList([1, 225, 24]);
      Body body = Body(arrayBuffer);
      expect(body.body, arrayBuffer);
    });

    test('Inserindo uma Stream como entrada.', () {
      Stream stream = Stream.empty();
      Body body = Body(stream);
      expect(body.body, stream);
    });

    test('ArrayBuffer, deve retornar um Uint8List de uma List.', () {
      var lista = [1, 2, 3, 4];
      Body body = Body(lista);
      var arrayBuffer = body.arrayBuffer();
      expect(arrayBuffer, [1, 2, 3, 4]);
    });

    test('Json, deve retornar um json de um Map.', () {
      var map = {'input1': 'teste'};
      Body body = Body(map);
      var json = body.json();
      expect(json, '{"input1":"teste"}');
    });

    test('Text, deve retornar uma string.', () {
      var msg = 'testando 1, 2, 3,...';
      Body body = Body(msg);
      var text = body.text();
      expect(text, msg);
    });
  });
}
