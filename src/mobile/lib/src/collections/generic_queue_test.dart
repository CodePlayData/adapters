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
