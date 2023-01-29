class HeaderListConversionFailure implements Exception {
  Object error;
  String msg =
      'The list provided could not be converted to a Map object. The failure is:';
  HeaderListConversionFailure(this.error);
  @override
  String toString() => '$msg $error';
}
