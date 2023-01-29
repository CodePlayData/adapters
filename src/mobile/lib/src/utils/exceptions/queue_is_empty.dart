class QueueIsEmpty implements Exception {
  String msg = 'The queue is empty.';
  @override
  String toString() => msg;
}
