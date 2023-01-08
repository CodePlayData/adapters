// @filename: GPUDeviceAdapter.ts

/**
 *  This adapter was built using webgpu web api. As all web api's standard it cannot be tested in node
 *  env.
 */

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
            throw new Error('There is no GPU avaiable.')
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