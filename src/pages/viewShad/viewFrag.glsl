uniform vec3 lightPosition;
uniform float u_distance;
uniform float viewCameraNear;
uniform float viewCameraFar;
uniform mat4 viewCameraProjectionMatrix;
uniform mat4 viewCameraMatrixWorldInverse;
uniform sampler2D tDepth;

varying vec3 vNormal;
varying vec4 vModelPos;
#include <packing>
bool visible(in vec4 result) {
    result.x /= result.w;
    result.y /= result.w;
    result.z /= result.w;
    return result.x >= -1. && result.x <= 1. && result.y >= -1. && result.y <= 1. && result.z >= -1. && result.z <= 1.;
}
float rgbaToValue(vec4 color) {
  float red = color.r * 255.0;
  float green = color.g * 255.0;
  float blue = color.b * 255.0;
  float alpha = color.a * 255.0;
  float value = red * 16777216.0 + green * 65536.0 + blue * 256.0 + alpha;
  return value;
}
float getDepth(const in sampler2D depthTexture, const in vec2 screenPosition) {
    // return texture2D(depthTexture, screenPosition).x;
    return rgbaToValue(texture2D(depthTexture, screenPosition));
}
float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = getDepth(depthSampler, coord);
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, viewCameraNear, viewCameraFar);
    return viewZToOrthographicDepth(viewZ, viewCameraNear, viewCameraFar);
}

void main(void) {
    // viewCamera中的坐标
    vec4 viewPos = viewCameraMatrixWorldInverse * vModelPos;
    // 点到相机源点的距离
    // float dist1 = length(viewPos.xyz);
    // 当前点到目标的距离
    // float dist = distance(vModelPos.xyz, lightPosition);
    // viewCamera的投影
    vec4 clipPos = viewCameraProjectionMatrix * viewPos;
    vec3 shadowCoord = clipPos.xyz / clipPos.w * 0.5 + 0.5;
    float depth_shadowCoord = shadowCoord.z;
     // 获取viewCamera的深度图
    float depth = getDepth(tDepth, shadowCoord.xy);
    float viewZ = perspectiveDepthToViewZ(depth, viewCameraNear, viewCameraFar);
    float cosTheta = dot(normalize(lightPosition), vNormal);
    float difLight = max(0.0, cosTheta);
    float bias = 0.006 * tan(acos(cosTheta)); // cosTheta is dot( n,l ), clamped between 0 and 1
    bias = clamp(bias, 0.0, 0.01);
    // float shadowFactor = step(shadowCoord.z, depth);
    // 将可视结果放到本次texture供下次使用
    if(visible(clipPos)) {
        if(clipPos.z - u_distance <= depth) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    } else {
        discard;
    }
}