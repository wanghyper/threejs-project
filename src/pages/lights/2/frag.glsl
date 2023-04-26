#include <packing>
#ifdef GL_ES
precision mediump float;  
    #endif
uniform sampler2D depthTexture;
uniform vec3 color;
varying vec4 result;
uniform float cameraNear;
uniform float cameraFar;

float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}

void main() {

    vec3 shadowCoord = (result.xyz / result.w) / 2.0 + 0.5; // 归一化
    //   vec4 rgbaDepth = texture2D(depthTexture, shadowCoord.xy); 
    //   float depth = rgbaDepth.r; // 拿到深度纹理中对应坐标存储的深度

    //   float visibility = (shadowCoord.z > depth + 0.3) ? 0.0 : 1.0; // 判断片元是否在阴影中
    //   vec4 v_Color = vec4(color, 1.0);
    //   gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);

    float fragCoordZ = texture2D(depthTexture, shadowCoord.xy).r;
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    float depth = viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
    float visibility = (shadowCoord.z > depth) ? 0.0 : 1.0; // 判断片元是否在阴影中
    vec4 v_Color = vec4(color, 1.0);
    gl_FragColor = vec4(v_Color.rgb * visibility, v_Color.a);
}