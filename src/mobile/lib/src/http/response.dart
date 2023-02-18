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
  late final bool ok;
  late final bool redirected;
  late final int status;
  late final String statusText;
  late final ResponseType type;
  late final Uri url;

  Response(this.url, this.redirected, this.type, dynamic bodyInput,
      ResponseOptions options) {
    body = Body(bodyInput);
    if (options.status > 200 && options.status <= 209) {
      ok = true;
    }
    statusText = options.statusMsg;
    headers = options.headers;
  }

  Response clone() {
    return this;
  }

  bool get bodyUsed {
    return body.bodyUsed;
  }

  set bodyUser(bool used) {
    if (bodyUsed == false) {
      body.bodyUsed = used;
    }
  }

  Blob blob() {
    return body.blob();
  }

  FormData formData() {
    return body.formData();
  }

  String json() {
    return body.json();
  }

  String text() {
    return body.toString();
  }

  static redirect(Uri newurl, Response response) {
    return Response(newurl, true, ResponseType.basic, response.body,
        ResponseOptions(302, response.headers!, 'Permanent Redirect'));
  }

  static error(int statusCode, Header headers, String errorMsg) {
    return Response(Uri.directory('/'), false, ResponseType.error, null,
        ResponseOptions(statusCode, headers, errorMsg));
  }
}
