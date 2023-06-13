uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform sampler2D tView;
uniform float cameraNear;
uniform float cameraFar;

varying vec2 vUv;
#include <packing>

float getDepth(const in sampler2D depthTexture, const in vec2 screenPosition) {
    #if DEPTH_PACKING == 1
    return unpackRGBAToDepth(texture2D(tDepth, screenPosition));
    #else
    return texture2D(tDepth, screenPosition).x;
    #endif
}

void main(void) {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec4 depthTexel = texture2D(tDepth, vUv);

    vec4 viewTexel = texture2D(tView, vUv);
    // 在可视区域内 如果可以看到
    if(viewTexel.xy == vec2(0.0) && viewTexel.z == 1.0) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    // 在可视区域内 如果看不到
    else if(viewTexel.yz == vec2(0.0) && viewTexel.x == 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } 
    // 不在可视区域内
    else {
         gl_FragColor = vec4(texel);
    } 
    // gl_FragColor = texel;
    // gl_FragColor = viewTexel;
}