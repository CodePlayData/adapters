// @filename: GPUCommandRepository.ts
import "@webgpu/types";

interface GPUCommandRepository {
    commandIndex: number;
    commandDB: GPUCommandBuffer[];

    push(command: GPUCommandBuffer): void;
    get(): GPUCommandBuffer[];
    delete(index: number): void;
    clear(): void;
}

export {
    GPUCommandRepository
}