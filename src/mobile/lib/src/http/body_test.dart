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

import 'dart:html';
import 'dart:typed_data';
import 'package:adapters/src/http/body.dart';
import 'package:test/test.dart';

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

    test('Inserindo um blob como entrada.', () {
      Blob blob = Blob([1, 2, 3]);
      Body body = Body(blob);
      expect(body.body, blob);
    });

    test('Inserindo um Uint8List/ArrayBuffer como entrada.', () {
      Uint8List arrayBuffer = Uint8List.fromList([1, 225, 24]);
      Body body = Body(arrayBuffer);
      expect(body.body, arrayBuffer);
    });

    test('Inserindo um FormData como entrada.', () {
      FormData formData = FormData();
      formData.append('input1', 'test');
      Body body = Body(formData);
      expect(body.body, formData);
    });

    test('Inserindo UrlSearchParams como entrada.', () {
      UrlSearchParams searchParams = UrlSearchParams();
      searchParams.append('input1', 'test');
      Body body = Body(searchParams);
      expect(body.body.get('input1'), searchParams.get('input1'));
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

    test('Blob, deve retornar um blob de uma.', () {
      var list = ['input1', 'input2'];
      Body body = Body(list);
      var blob = body.blob();
      expect(blob.size, 12);
    });

    test('FormData, deve retornar um FormaData de um Map.', () {
      var map = {'input1': 'teste'};
      Body body = Body(map);
      var form = body.formData();
      var formToCompare = FormData();
      formToCompare.append('input1', 'teste');
      expect(form.get('input1'), formToCompare.get('input1'));
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
