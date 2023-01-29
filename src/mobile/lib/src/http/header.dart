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
}
