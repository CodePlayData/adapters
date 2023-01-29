import 'package:adapters/src/collections/collection.dart';
import 'package:adapters/src/utils/exceptions/queue_is_empty.dart';
import 'package:adapters/src/utils/exceptions/queue_is_full.dart';
import 'collection.dart';

abstract class Queue extends Collection<Object> {
  Queue(super.maxsize);
  void enqueue(Object object) => {
    if (isFull) {throw QueueIsFull()},
    storage.addFirst(object)
  };

  void dequeue() => {
    if (isEmpty) {throw QueueIsEmpty()},
      storage.removeFirst()
  };
}