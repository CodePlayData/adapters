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

@TestOn('browser')

import 'dart:html';

import 'package:test/test.dart';

import 'package:adapters/src/http/Body/body_html.dart';


void main() {
  // Teste com: dart test -p chrome .
  group('Testando a classe Body no browser.', () {

    test('Inserindo um blob como entrada.', () {
      Blob blob = Blob([1, 2, 3]);
      Body body = Body(blob);
      expect(body.body, blob);
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

    test('Blob, deve retornar um blob de uma lista.', () {
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

  });
}
