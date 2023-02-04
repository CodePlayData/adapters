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

class Response {
  Header? headers;
  dynamic body;
  late bool bodyUsed;
  late bool ok;
  late String redirect;
  late String status;
  late String statusText;
  late String type;
  late Uri url;

  Response({dynamic body, ResponseOptions? options});
  // o body tem que aceitar Blob ok, Uint8List ok, FormData ok, String ok, UrlSearchParams? ok, ReadbleStream?
  // a maior dificuldade do response parece ser aceitar essas entradas, pois elas
  // se tornarão a propriedade `body` da response.
  // Na especificação tem um exemplo com o blob, parece ser o inicio mais simples.
  // A parte de options parece ser mais simples.

  Response clone() {
    return this;
  }
}
