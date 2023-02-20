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
import 'package:adapters/src/http/body.dart';
import 'package:adapters/src/http/header.dart';
import 'package:adapters/src/http/response_options.dart';
import 'package:adapters/src/utils/enums/response_type.dart';

class Response {
  Header? headers;
  late final Body body;
  late bool _bodyUsed;
  late final bool ok;
  late final bool redirected;
  late final int status;
  late final String statusMsg;
  late final ResponseType type;
  late Uri? url;

  Response([dynamic bodyInput, ResponseOptions? options]) {
    body = Body(bodyInput);
    type = ResponseType.cors;
    _bodyUsed = false;
    url = Uri.file('/');
    if (options != null) {
      status = options.status;
      statusMsg = options.statusMsg;
      if (options.status > 200 && options.status <= 209) {
        ok = true;
      }
      if (options.headers?.has('Location')) {
        redirected = true;
        url = Uri.tryParse(options.headers?.get('Location'));
      } else {
        redirected = false;
      }
    }
    headers = options?.headers;
  }

  Response clone() {
    bodyUsed = true;
    return this;
  }

  bool get bodyUsed {
    return _bodyUsed;
  }

  set bodyUsed(bool used) {
    if (_bodyUsed == false) {
      _bodyUsed = used;
    }
  }

  Blob blob() {
    bodyUsed = true;
    return body.blob();
  }

  FormData formData() {
    bodyUsed = true;
    return body.formData();
  }

  String json() {
    bodyUsed = true;
    return body.json();
  }

  String text() {
    bodyUsed = true;
    return body.toString();
  }

  static redirect(int statusCode, String statusMsg, String to, Response previousResponse) {
    ResponseOptions options =
        ResponseOptions(statusCode, previousResponse.headers, statusMsg);
    options.headers?.set('Location', to);
    Response newResponse = Response(previousResponse.body, options);
    return newResponse;
  }

  static error(int statusCode, Header headers, String errorMsg) {
    ResponseOptions options = ResponseOptions(statusCode, headers, errorMsg);
    Response response = Response(null, options);
    return response;
  }
}
