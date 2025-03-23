import shader from './shaders.wgsl';

const initialize = async () => {
    const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('gfx-main');
    const adapter: GPUAdapter = <GPUAdapter>await navigator.gpu?.requestAdapter();
    const device: GPUDevice = <GPUDevice>await adapter?.requestDevice();
    const context: GPUCanvasContext = <GPUCanvasContext>canvas.getContext('webgpu');
    const format: GPUTextureFormat = 'bgra8unorm';
    context.configure({
        device: device,
        format: format
    });

    const pipeline: GPURenderPipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: 'vs_main'
        },

        fragment: {
            module: device.createShaderModule({
                code: shader
            }),
            entryPoint: 'fs_main',
            targets: [{
                format: format
            }]
        },

        primitive: {
            topology: 'triangle-list'
        },
    });

    const commandEncoder: GPUCommandEncoder = device.createCommandEncoder();
    const textureview: GPUTextureView = context.getCurrentTexture().createView();
    const renderpass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
        colorAttachments: [{
            view: textureview,
            clearValue: { r: 0.5, g: 0.5, b: 0.5, a: 1.0 },
            loadOp: 'clear',
            storeOp: 'store'
        }]
    });

    renderpass.setPipeline(pipeline);
    renderpass.draw(3, 1, 0, 0);
    renderpass.end();

    device.queue.submit([commandEncoder.finish()]);
}


initialize();
