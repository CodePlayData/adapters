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
import 'package:adapters/src/http/Response/response.dart';
import 'package:adapters/src/http/Response/response_options.dart';
import 'package:adapters/src/utils/enums/redirect_status_code.dart';
import '../../utils/enums/response_type.dart';

void main() {
  // Teste com: dart test -p chrome .
  group('Testando a classe Response.', () {
    test('Sem nenhum input.', () {
      Response response = Response();

      expect(response.type.toString(), ResponseType.cors.toString());
      expect(response.url, Uri.file('/'));
      expect(response.type.toString(), ResponseType.cors.toString());
    });

    test('Com apenas o Body de input.', () {
      Response response = Response('test');

      expect(response.text(), 'test');
    });

    test('Com body e options.', () {
      ResponseOptions options =
          ResponseOptions(202, Header({'Location': 'http://localhost'}), 'ok');

      Response response = Response('test', options);

      expect(response.status, 202);
      expect(response.bodyUsed, false);
    });

    test('Testando bodyUsed.', () {
      Response response = Response('test');
      String input = response.text();

      expect(response.bodyUsed, true);
    });

    test('Clonando a response.', () {
      Response response = Response('test');

      Response cloned = response.clone();

      expect(response, cloned);
    });

    test('Redirect uma response.', () {
      ResponseOptions options = ResponseOptions(
          200,
          Header({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
          'ok');
      Response response = Response('input', options);

      response = Response.redirect(
          'http://localhost:3000/', RedirectStatusCode.temporaryRedirect);

      expect(response.headers?.get('Location'), 'http://localhost:3000/');
      expect(response.redirected, true);
      expect(response.status, 307);
      expect(response.statusMsg, 'Temporary Redirect');
    });

    test('Error de uma response.', () {
      ResponseOptions options = ResponseOptions(
          200,
          Header({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }),
          'ok');
      Response response = Response('input', options);
      response = Response.error();

      expect(response.status, 0);
      expect(response.type.toString(), ResponseType.error.toString());
    });
  });
}
