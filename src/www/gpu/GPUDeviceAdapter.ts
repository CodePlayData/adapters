// @filename: GPUDeviceAdapter.ts

/* Copyright 2023 Pedro Paulo Teixeira dos Santos

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import { NoGpuAvaiable } from "../utils/errors/NoGpuAvaiable.js";
import { GPUCommandRepository } from "./GPUCommandRepository.js";

class GPUDeviceAdapter {
    /** @type { GPUCommandBuffer } */
    commands: GPUCommandBuffer[] = [];

    /**
     *  This constructor is not directly callabe. You shold await the init() method of this class,
     *  that insted calls this constructor returning all objects that you need to use GPU.
     * @param adapter @type { GPUAdapter } - The instance thar user the interface.
     * @param device @type { GPUDevice } - The interface with the bare GPU.
     * @param repository @type { GPUCommandRepository } - Some repo to store all commands that should be executed in the GPU.
     */
    constructor(readonly adapter: GPUAdapter, readonly device: GPUDevice, readonly repository: GPUCommandRepository) {
    }

    /**
     * The method to be called to instantiate this class.
     * @param repository @type { GPUCommandRepository } - Some repo to store all commands that should be executed in the GPU. 
     * @param options @type { GPURequestAdapterOptions } - In case there many gpu profiles this options directly point to some one of them.
     * @param descriptor @type { GPUDeviceDescriptor } - Same as options.
     * @returns @type { GPUDeviceAdapter }
     */
    static async init(repository: GPUCommandRepository, options?: GPURequestAdapterOptions, descriptor?: GPUDeviceDescriptor) {
        const instance = await navigator.gpu.requestAdapter(options);
        if(instance === null) {
            throw new NoGpuAvaiable();
        } else {
            const device = await instance.requestDevice(descriptor);
            return new GPUDeviceAdapter(instance, device, repository)
        }
    }

    /**
     *  Clear the repo of commands and passes all to the GPU to be executed, like a flush.
     */
    run() {
        this.commands = this.repository.get();
        this.device.queue.submit(this.commands);
        this.commands = [];
    }
}

export {
    GPUDeviceAdapter
}