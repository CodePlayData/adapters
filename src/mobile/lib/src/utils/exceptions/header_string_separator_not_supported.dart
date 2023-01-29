class HeaderStringSeparatorNotSupported implements Exception {
  String msg = 'The only separator allowed for strings is ";"';
  @override
  String toString() => msg;
}
