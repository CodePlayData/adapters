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

import 'package:adapters/src/collections/generic_queue.dart';
import 'package:test/test.dart';

void main() {
  group('Testando a classe GenericQueue.', () {
    final queue = GenericQueue(1);

    test('Inserindo um elemento.', () {
      expect(queue.isEmpty, true);
      expect(queue.size, 0);
      queue.enqueue({test: 'primeira entrada'});
      expect(queue.isEmpty, false);
      expect(queue.size, 1);
    });

    test('Inserindo um elemento em uma fila cheia.', () {
      expect(queue.isFull, true);
      expect(
        () => queue.enqueue({test: 'segunda entrada'}),
          throwsA(predicate((e) => e.toString() == 'The queue is full.'))
        );
    });

    test('Removendo um elemento.', () {
      expect(queue.isEmpty, false);
      expect(queue.size, 1);
      queue.dequeue();
      expect(queue.isEmpty, true);
      expect(queue.size, 0);
    });

    test('Removendo um elemento de uma fila vazia.', () {
      expect(queue.isEmpty, true);
      expect(queue.size, 0);
      expect(
        () => queue.dequeue(),
          throwsA(predicate((e) => e.toString() == 'The queue is empty.'))
        );
    });
  });
}
