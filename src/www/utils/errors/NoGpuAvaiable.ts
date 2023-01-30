class NoGpuAvaiable extends Error {
    constructor() {
        super('There is no GPU avaiable.')
    }
}

export {
    NoGpuAvaiable
}