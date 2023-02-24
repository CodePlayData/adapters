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

import 'package:adapters/src/http/Body/body_default.dart'
    if (dart.library.html) 'package:adapters/src/http/Body/body_html.dart' show Body;

import 'package:adapters/src/http/Header/header.dart';
import 'package:adapters/src/http/Response/response_options.dart';

import 'package:adapters/src/utils/enums/redirect_status_code.dart';
import 'package:adapters/src/utils/enums/response_type.dart';

class Response {
  Header? headers;
  late final Body body;
  late bool _bodyUsed;
  late final bool ok;
  late final bool redirected;
  late final int status;
  late final String statusMsg;
  late ResponseType type;
  late Uri? url;
  static late Response _response;

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
      } else {
        ok = false;
      }
      if (options.headers?.has('Location')) {
        redirected = true;
        url = Uri.tryParse(options.headers?.get('Location'));
      } else {
        redirected = false;
      }

      if (options.type != null) {
        type = options.type!;
      }
    }
    headers = options?.headers;
    _response = this;
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

  dynamic blob() {
    bodyUsed = true;
    return body.blob();
  }

  dynamic formData() {
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

  static redirect(String url, [RedirectStatusCode? statusCode]) {
    ResponseOptions options = ResponseOptions(
        statusCode!.code, _response.headers, statusCode.codeMsg);
    options.headers?.set('Location', url);
    Response newResponse = Response(_response.body, options);
    _response = newResponse;
    return newResponse;
  }

  static error() {
    ResponseOptions options = ResponseOptions(
        0, Header({'Connection': 'close'}), '', ResponseType.error);
    Response errorResponse = Response(null, options);
    _response = errorResponse;
    return errorResponse;
  }
}
