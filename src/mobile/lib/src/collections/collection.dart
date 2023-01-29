// @filename: collection.dart
import 'dart:collection';

abstract class Collection<T> {
  int maxsize;
  Collection(this.maxsize);
  Queue<Object> storage = Queue();
  int get size => storage.length;
  bool get isFull => storage.length == maxsize;
  bool get isEmpty => storage.isEmpty;
}
