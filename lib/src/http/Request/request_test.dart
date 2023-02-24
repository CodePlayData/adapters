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

import 'package:adapters/src/utils/enums/request_method.dart';
import 'package:adapters/src/http/Request/request.dart';
import 'package:adapters/src/http/Request/request_options.dart';
import 'package:test/test.dart';

void main() {
  // Teste com: dart test -p chrome .
  group('Testando a classe Request.', () {
    Request request = Request(Uri.http('localhost'));

    test('Testando o estado inicial.', () {
      expect(request.method, 'GET');
      expect(request.mode, 'cors');
      expect(request.referrerPolicy, '');
      expect(request.referrer, 'about:client');
      expect(request.integrity, '');
      expect(request.redirect, 'follow');
      expect(request.cache, 'default');
      expect(request.credentials, 'same-origin');
      expect(request.url, Uri.http('localhost'));
    });

    test('Trocando uma das propriedades: metodo.', () {
      request.method = 'POST';
      expect(request.method, 'POST');
    });

    test('Usando outra request como input para copiar por ref.', () {
      Request newRequest = Request(request);
      expect(newRequest.url, Uri.http('localhost'));
      expect(newRequest.method, 'POST');
      expect(request.method, 'POST');
    });

    test('Testando um input errado.', () {
      expect(
          () => Request(1),
          throwsA(predicate((e) =>
              e.toString() ==
              'This type of input cannot be used in the Request constructor.')));
    });

    test('Clonando uma nova request em memória.', () {
      Request anotherRequest = request.clone();
      anotherRequest.method = RequestMethod.head.method;
      expect(request.method, 'POST');
      expect(anotherRequest.method, 'HEAD');
      expect(request.method, 'POST');
    });

    test('Testando inserir um body.', () {
      var options = RequestOptions(body: {'name': 'test'});
      Request request2 = Request(Uri.http('localhost'), options: options);
      expect(request2.body.body, {'name': 'test'});
    });

    test('Metodo arrayBuffer.', () {
      var options = RequestOptions(body: [1, 2, 3, 4, 5, 6]);
      Request request3 = Request(Uri.http('localhost'), options: options);
      expect(request3.arrayBuffer(), [1, 2, 3, 4, 5, 6]);
    });

    test('Metodo json.', () {
      var options = RequestOptions(body: {'hello': 'world'});
      Request request5 = Request(Uri.http('localhost'), options: options);
      expect(request5.json(), '{"hello":"world"}');
    });

    test('Metodo text.', () {
      var options = RequestOptions(body: 'hello world');
      Request request6 = Request(Uri.http('localhost'), options: options);
      expect(request6.text(), 'hello world');
    });
  });
}
