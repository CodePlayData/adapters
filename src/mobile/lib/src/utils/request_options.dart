import 'dart:html';

import 'package:adapters/src/utils/enums/request_cache.dart';
import 'package:adapters/src/utils/enums/request_credentials.dart';
import 'package:adapters/src/utils/enums/request_method.dart';
import 'package:adapters/src/utils/enums/request_mode.dart';
import 'package:adapters/src/utils/enums/request_redirect.dart';
import 'package:adapters/src/utils/enums/request_referrer.dart';
import 'package:adapters/src/utils/enums/request_referrer_policy.dart';
import 'package:adapters/src/utils/header.dart';

class RequestOptions {
  RequestMethod? method;
  Header? headers;
  dynamic body;
  RequestMode? mode;
  RequestCredentials? credentials;
  RequestCache? cache;
  RequestRedirect? redirect;
  RequestReferrer? referrer;
  RequestReferrerPolicy? referrerPolicy;
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
