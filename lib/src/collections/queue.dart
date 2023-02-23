// Copyright 2023 Pedro Paulo Teixeira dos Santos

//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at

//        http://www.apache.org/licenses/LICENSE-2.0

//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

import 'package:adapters/src/collections/collection.dart';
import 'package:adapters/src/utils/exceptions/queue_is_empty.dart';
import 'package:adapters/src/utils/exceptions/queue_is_full.dart';

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
