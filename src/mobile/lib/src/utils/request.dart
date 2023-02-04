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

import 'dart:convert';
import 'dart:html';
import 'dart:typed_data';
import 'package:adapters/src/utils/enums/request_cache.dart';
import 'package:adapters/src/utils/enums/request_credentials.dart';
import 'package:adapters/src/utils/enums/request_method.dart';
import 'package:adapters/src/utils/enums/request_mode.dart';
import 'package:adapters/src/utils/enums/request_redirect.dart';
import 'package:adapters/src/utils/enums/request_referrer.dart';
import 'package:adapters/src/utils/enums/request_referrer_policy.dart';
import 'package:adapters/src/utils/exceptions/cannot_parse_into_json.dart';
import 'package:adapters/src/utils/exceptions/cannot_turn_into_array_buffer.dart';
import 'package:adapters/src/utils/exceptions/cannot_turn_into_blob.dart';
import 'package:adapters/src/utils/exceptions/cannot_turn_into_form_data.dart';
import 'package:adapters/src/utils/header.dart';
import 'package:adapters/src/utils/request_options.dart';
import 'package:adapters/src/utils/exceptions/invalid_request_input.dart';

class Request {
  Header? headers;
  late String method;
  late String mode;
  late Uri url;
  late String referrerPolicy;
  late String referrer;
  late String integrity;
  late String redirect;
  late String cache;
  late String credentials;
  dynamic body;

  Request(dynamic input, {RequestOptions? options}) {
    if (input is Uri) {
      headers = options?.headers;
      method = (options?.method != null
          ? options?.method?.method
          : RequestMethod.get.method)!;
      mode = (options?.mode != null
          ? options?.mode?.mode
          : RequestMode.cors.mode)!;
      url = input;
      referrerPolicy = (options?.referrerPolicy != null
          ? options?.referrerPolicy?.policy
          : RequestReferrerPolicy.none.policy)!;
      referrer = (options?.referrer != null
          ? options?.referrer?.referrer
          : RequestReferrer.client.referrer)!;
      integrity = (options?.integrity ?? '');
      redirect = (options?.redirect != null
          ? options?.redirect?.redirect
          : RequestRedirect.follow.redirect)!;
      cache = (options?.cache != null
          ? options?.cache?.cache
          : RequestCache.defaultish.cache)!;
      credentials = (options?.credentials != null
          ? options?.credentials?.credentials
          : RequestCredentials.sameOrigin.credentials)!;
      body = options?.body;
    } else if (input is Request) {
      headers = input.headers;
      method = input.method;
      mode = input.mode;
      url = input.url;
      referrerPolicy = input.referrerPolicy;
      referrer = input.referrer;
      integrity = input.integrity;
      redirect = input.redirect;
      cache = input.cache;
      credentials = input.credentials;
      body = input.body;
    } else {
      throw InvalidRequestInput();
    }
  }

  Uint8List arrayBuffer() {
    try {
      var array8bit = Uint8List.fromList(body);
      return array8bit;
    } catch (e) {
      throw CannotTurnIntoArrayBuffer();
    }
  }

  Blob blob() {
    try {
      var blob = Blob(body);
      return blob;
    } catch (e) {
      throw CannotTurnIntoBlob();
    }
  }

  FormData formData() {
    try {
      var formdata = FormData();
      Map mapbody = body as Map;
      mapbody.forEach((key, value) {
        formdata.append(key, value);
      });
      return formdata;
    } catch (e) {
      throw CannotTurnIntoFormData();
    }
  }

  String json() {
    try {
      return jsonEncode(body);
    } catch (e) {
      throw CannotParseIntoJson();
    }
  }

  String text() {
    return body.toString();
  }

  Request clone() {
    return Request(this);
  }
}
