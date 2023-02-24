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

// ignore_for_file: annotate_overrides

import 'dart:convert';
import 'dart:html';
import 'dart:typed_data';

import 'package:adapters/src/http/Body/body.dart';

import '../../utils/exceptions/cannot_parse_into_json.dart';
import '../../utils/exceptions/cannot_turn_into_array_buffer.dart';
import '../../utils/exceptions/cannot_turn_into_blob.dart';
import '../../utils/exceptions/cannot_turn_into_form_data.dart';

class Body implements BodyI {
  dynamic _body;

  Body(dynamic input) {
    if (input is List) {
      _body = input;
    } else if (input is String) {
      _body = input;
    } else if (input is Map) {
      _body = input;
    } else if (input is Blob) {
      _body = input;
    } else if (input is Uint8List) {
      _body = input;
    } else if (input is FormData) {
      _body = input;
    } else if (input is UrlSearchParams) {
      _body = input;
    } else if (input is Stream) {
      _body = input;
    }
  }

  Uint8List arrayBuffer() {
    try {
      var list = List<int>.from(_body);
      var array8bit = Uint8List.fromList(list);
      return array8bit;
    } catch (e) {
      throw CannotTurnIntoArrayBuffer();
    }
  }

  Blob blob() {
    try {
      var blob = Blob(_body);
      return blob;
    } catch (e) {
      throw CannotTurnIntoBlob();
    }
  }

  FormData formData() {
    try {
      var formdata = FormData();
      Map mapbody = _body as Map;
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
      return jsonEncode(_body);
    } catch (e) {
      throw CannotParseIntoJson();
    }
  }

  String text() {
    return toString();
  }

  get body {
    return _body;
  }

  @override
  String toString() {
    return _body.toString();
  }
}
