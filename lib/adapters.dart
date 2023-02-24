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

library adapters;

export 'src/collections/collection.dart' show Collection;
export 'src/collections/generic_queue.dart' show GenericQueue;
export 'src/collections/queue.dart' show Queue;
export 'src/http/Header/header.dart' show Header;
export 'src/utils/exceptions/header_list_conversion_failure.dart'
    show HeaderListConversionFailure;
export 'src/utils/exceptions/header_string_separator_not_supported.dart'
    show HeaderStringSeparatorNotSupported;
export 'src/utils/exceptions/header_type_not_supported.dart'
    show HeaderTypeNotSuportted;
export 'src/utils/exceptions/queue_is_empty.dart' show QueueIsEmpty;
export 'src/utils/exceptions/queue_is_full.dart' show QueueIsFull;
