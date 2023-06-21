import {ShaderMaterial, WebGLRenderTarget, Vector2} from 'three';
import {Pass, FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
import vert from './vert.glsl';
import frag from './frag.glsl';
import viewVert from './viewVert.glsl';
import viewFrag from './viewFrag.glsl';
import depthVert from './depthVert.glsl';
import depthFrag from './depthFrag.glsl';

export default class ViewShadPass extends Pass {
    constructor(scene, camera, viewCamera, resolution = new Vector2(256, 256), mapSize = 4096 / 4) {
        super();
        this.scene = scene;
        this.camera = camera;
        this.viewCamera = viewCamera;
        this.mapSize = mapSize;
        this.depthTarget = new WebGLRenderTarget(mapSize, mapSize);
        this.viewDepthTarget = new WebGLRenderTarget(mapSize, mapSize);
        this.viewTarget = new WebGLRenderTarget(mapSize, mapSize);
        this.viewMaterial = new ShaderMaterial({
            uniforms: {
                lightPosition: {
                    //光源位置
                    value: viewCamera.position,
                },
                viewCameraProjectionMatrix: {
                    value: viewCamera.projectionMatrix,
                },
                viewCameraMatrixWorldInverse: {
                    value: viewCamera.matrixWorldInverse,
                },
                viewCameraNear: {
                    value: viewCamera.near,
                },
                viewCameraFar: {
                    value: viewCamera.far,
                },
                tDepth: {
                    value: null,
                },
            },
            vertexShader: viewVert,
            fragmentShader: viewFrag,
        });

        // this.testMaterial = new MeshNormalMaterial();
        // this.testMaterial.depthPacking = RGBADepthPacking;
        // this.testMaterial.blending = NoBlending;
        this.depthMaterial = new ShaderMaterial({
            vertexShader: depthVert,
            fragmentShader: depthFrag,
        });
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
            u_distance: {
                value: 0.051,
            },
            tDepth: {
                value: null,
            },
            tView: {value: null},
        };

        this.material = new ShaderMaterial({
            defines: {
                'DEPTH_PACKING': 0,
            },
            uniforms: this.uniforms,
            vertexShader: vert,
            fragmentShader: frag,
        });

        this.fsQuad = new FullScreenQuad(this.material);
    }

    render(renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */) {
        // 渲染目标相机下的深度图
        renderer.setRenderTarget(this.viewDepthTarget);
        this.scene.overrideMaterial = this.depthMaterial;
        renderer.render(this.scene, this.viewCamera);
        this.scene.overrideMaterial = null;
        this.viewMaterial.uniforms.tDepth.value = this.viewDepthTarget.texture;

        // 计算可视域
        renderer.setRenderTarget(this.viewTarget);
        this.scene.overrideMaterial = this.viewMaterial;
        renderer.render(this.scene, this.camera);
        this.scene.overrideMaterial = null;
        this.material.uniforms.tView.value = this.viewTarget.texture;

        // 渲染后续流程，为可视域上色
        this.material.uniforms.tDiffuse.value = readBuffer.texture;
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
