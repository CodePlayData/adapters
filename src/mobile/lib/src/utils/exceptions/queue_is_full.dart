class QueueIsFull implements Exception {
  String msg = 'The queue is full.';
  @override
  String toString() => msg;
}
