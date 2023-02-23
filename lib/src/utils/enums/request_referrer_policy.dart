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

enum RequestReferrerPolicy {
  none(""),
  noReferrer('no-referrer'),
  noReferrerWhenDowngrade('no-referrer-when-downgrade'),
  origin('origin'),
  originWhenCrossOrigin('origin-when-cross-origin'),
  sameOrigin('same-origin'),
  strictOrigin('strict-origin'),
  strictOriginWhenCrossOrigin('strict-origin-when-cross-origin'),
  unsafeUrl('unsafe-url');

  const RequestReferrerPolicy(this.policy);
  final String policy;
}
