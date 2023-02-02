import 'package:adapters/src/utils/header.dart';

abstract class RequestOptions {
  String? method;
  Header? headers;
  dynamic body;
  String? mode;
  String? credentials;
  String? cache;
  String? redirect;
  String? referrer;
  String? referrerPolicy;
  String? integrity;

  RequestOptions(
      {this.method,
      this.headers,
      this.body,
      this.mode,
      this.credentials,
      this.cache,
      this.redirect,
      this.referrer,
      this.referrerPolicy,
      this.integrity});
}
