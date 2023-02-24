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

@TestOn('browser')

import 'package:test/test.dart';

import 'package:adapters/src/utils/enums/request_method.dart';
import 'package:adapters/src/http/Request/request.dart';
import 'package:adapters/src/http/Request/request_options.dart';

void main() {
  // Teste com: dart test -p chrome .
  group('Testando a classe Request no browser.', () {
    Request request = Request(Uri.http('localhost'));


    test('Metodo formData.', () {
      var options = RequestOptions(body: {'name': 'test'});
      Request request2 = Request(Uri.http('localhost'), options: options);
      expect(request2.formData().has('name'), true);
    });

    test('Metodo blob.', () {
      var options = RequestOptions(body: [1, 2, 3, 4, 5, 6]);
      Request request4 = Request(Uri.http('localhost'), options: options);
      expect(request4.blob().size, 6);
    });
  });
}
