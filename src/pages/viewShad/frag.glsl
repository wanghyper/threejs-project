uniform sampler2D tDiffuse;
uniform sampler2D tView;

varying vec2 vUv;
#include <packing>


void main(void) {
    vec4 texel = texture2D(tDiffuse, vUv);

    vec4 viewTexel = texture2D(tView, vUv);
    gl_FragColor = texel;
    // 在可视区域内 如果可以看到
    if(viewTexel.xy == vec2(0.0) && viewTexel.z == 1.0) {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
    }
        // 在可视区域内 如果看不到
    else if(viewTexel.yz == vec2(0.0) && viewTexel.x == 1.0) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    // gl_FragColor = texel;
    // gl_FragColor = viewTexel;
}
