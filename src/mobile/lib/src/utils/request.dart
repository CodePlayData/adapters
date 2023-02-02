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
import 'dart:io';

import 'package:adapters/src/utils/header.dart';
import 'package:adapters/src/utils/request_options.dart';
import 'package:adapters/src/utils/exceptions/invalid_request_input.dart';

class Request {
  Header? headers;
  String method = "GET";
  String mode = "cors";
  late Uri url;
  String referrerPolicy = "";
  String referrer = "about:client";
  String integrity = '';
  String redirect = 'follow';
  String cache = 'default';
  String credentials = 'same-origin';
  dynamic body;

  Request(dynamic input) : url = input;

  @override
  String toString() {
    var summary = {
      'method': method,
      'headers': headers,
      'mode': mode,
      'referrer': referrer,
      'referrerPolicy': referrerPolicy
    };
    return summary.toString();
  }
}
