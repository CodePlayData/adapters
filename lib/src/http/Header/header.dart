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

import 'package:adapters/src/utils/exceptions/header_list_conversion_failure.dart';
import 'package:adapters/src/utils/exceptions/header_string_separator_not_supported.dart';
import 'package:adapters/src/utils/exceptions/header_type_not_supported.dart';

class Header {
  late final Map<String, String> _headers;

  Map<String, String> _convertStringToMap(String input) {
    try {
      var map = <String, String>{};
      input.split(";").forEach((header) {
        var parts = header.split(":");
        if (parts.length == 2) {
          map[parts[0].trim()] = parts[1].trim();
        } else {
          throw HeaderStringSeparatorNotSupported();
        }
      });
      return map;
    } catch (e) {
      throw HeaderStringSeparatorNotSupported();
    }
  }

  Map<String, String> _convertToMap(List<List<String>> headers) {
    try {
      var map = <String, String>{};
      headers.forEach((header) => map[header[0]] = header[1]);
      return map;
    } catch (e) {
      throw HeaderListConversionFailure(e);
    }
  }

  Header(dynamic input) {
    if (input is Map<String, String>) {
      _headers = input;
    } else if (input is List<List<String>>) {
      _headers = _convertToMap(input);
    } else if (input is String) {
      _headers = _convertStringToMap(input);
    } else {
      throw HeaderTypeNotSuportted();
    }
  }

  Map<String, String> get headers => _headers;

  append(String name, String value) {
    _headers[name] = value;
  }

  delete(String name) {
    _headers.remove(name);
  }

  entries() {
    return _headers.values;
  }

  forEach(Function callback) {
    _headers.forEach((key, value) {
      callback(key, value);
    });
  }

  get(String name) {
    return _headers[name];
  }

  has(String name) {
    return _headers.keys.contains(name);
  }

  keys() {
    return _headers.keys;
  }

  set(String name, String value) {
    if (has(name)) {
      _headers.update(name, (newvalue) => value);
    } else {
      _headers[name] = value;
    }
  }

  values() {
    return _headers.values;
  }
}
