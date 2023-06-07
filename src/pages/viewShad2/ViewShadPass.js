import {
    ShaderMaterial,
    WebGLRenderTarget,
    DepthTexture,
    NearestFilter,
    Vector2,
    DepthFormat,
    UnsignedShortType,
    MeshDepthMaterial,
    RGBADepthPacking,
    NoBlending,
} from 'three';
import {Pass, FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
import vert from './vert.glsl';
import frag from './frag.glsl';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
export default class ViewShadPass extends Pass {
    constructor(scene, camera, viewCamera, resolution = new Vector2(256, 256)) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.viewCamera = viewCamera;
        this.depthTarget = new WebGLRenderTarget(resolution.x, resolution.y, {
            minFilter: NearestFilter,
            magFilter: NearestFilter,
        });

        this.depthMaterial = new MeshDepthMaterial();
        this.depthMaterial.depthPacking = RGBADepthPacking;
        this.depthMaterial.blending = NoBlending;

        this.depthTarget.depthTexture = new DepthTexture();
        this.depthTarget.depthBuffer = true;
        this.depthTarget.stencilBuffer = false;
        this.depthTarget.depthTexture.format = DepthFormat;
        this.depthTarget.depthTexture.type = UnsignedShortType;
        this.uniforms = {
            viewCameraProjectionMatrix: {
                value: viewCamera.projectionMatrix,
            },
            viewCameraMatrixWorldInverse: {
                value: viewCamera.matrixWorldInverse,
            },
            viewCameraModelViewMatrix: {
                value: viewCamera.modelViewMatrix,
            },
            u_distance: {
                value: 100,
            },
            lightPosition: {
                //光源位置
                value: viewCamera.position,
            },
            targetCameraNear: {value: viewCamera.near},
            targetCameraFar: {value: viewCamera.far},

            cameraNear: {value: this.camera.near},
            cameraFar: {value: this.camera.far},
            cameraProjectionMatrix: {value: this.camera.projectionMatrix},
            cameraMatrixWorldInverse: {value: this.camera.matrixWorldInverse},
            cameraInverseProjectionMatrix: {value: this.camera.projectionMatrixInverse},
            tDiffuse: {
                value: null,
            },
            tDepth: {value: this.depthTarget.depthTexture},
        };

        this.material = new ShaderMaterial({
            defines: {
                'DEPTH_PACKING': 1,
            },
            uniforms: this.uniforms,
            vertexShader: vert,
            fragmentShader: frag,
        });

        this.fsQuad = new FullScreenQuad(this.material);
        console.log(this.material);
        // UI控件
        const parameters = {
            u_distance: 100,
        };

        const update = () => {
            this.material.uniforms.u_distance.value = parameters.u_distance;
        };

        const gui = new GUI();
        gui.add(parameters, 'u_distance', 0, 5000, 1).onChange(update);
    }

    render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
        this.material.uniforms.tDiffuse.value = readBuffer.texture;

        // 渲染深度图
        renderer.setRenderTarget(this.depthTarget);
        this.scene.overrideMaterial = this.depthMaterial;
        renderer.render(this.scene, this.camera);
        this.scene.overrideMaterial = null;
        this.material.uniforms.tDepth.value = this.depthTarget.texture;

        // renderer.setRenderTarget(this.depthTarget);
        // renderer.clear();
        // renderer.render(this.scene, this.camera);

        // this.material.uniforms.lightPosition.value = this.viewCamera.position;
        // this.material.uniforms.tDepth.value = this.depthTarget.depthTexture;

        this.fsQuad.material = this.material;

        if (this.renderToScreen) {
            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);
        } else {
            renderer.setRenderTarget(writeBuffer);
            // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
            if (this.clear) {
                renderer.clear(renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil);
            }
            this.fsQuad.render(renderer);
        }
    }

    dispose() {
        this.material.dispose();

        this.fsQuad.dispose();
    }
}
