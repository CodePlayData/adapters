class HeaderTypeNotSuportted implements Exception {
  String msg = 'This type of header is not supported yet.';
  @override
  String toString() => msg;
}
