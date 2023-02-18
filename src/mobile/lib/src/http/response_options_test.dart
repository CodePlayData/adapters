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

import 'package:adapters/src/http/header.dart';
import 'package:adapters/src/http/response_options.dart';
import 'package:test/test.dart';

main() {
  group('Testando a classe ResponseOptions.', () {
    test('Testando as options com apenas um parâmetro.', () {
      var options = ResponseOptions(202, Header({'type': 'application/json'}), 'ok');
      expect(options.status, 202);
    });
  });
}