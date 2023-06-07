uniform sampler2D tDiffuse;
uniform sampler2D tDepth;
uniform vec3 lightPosition;
uniform mat4 viewCameraProjectionMatrix;
uniform mat4 viewCameraMatrixWorldInverse;
uniform mat4 viewCameraModelViewMatrix;
uniform float targetCameraNear;
uniform float targetCameraFar;
uniform float cameraNear;
uniform float cameraFar;
uniform mat4 cameraProjectionMatrix;
uniform mat4 cameraMatrixWorldInverse;
uniform mat4 cameraInverseProjectionMatrix;
uniform float u_distance;

varying vec2 vUv;

#include <packing>

bool visible(in vec4 result) {
    result.x /= result.w;
    result.y /= result.w;
    result.z /= result.w;
    return result.x >= -1. && result.x <= 1. && result.y >= -1. && result.y <= 1. && result.z >= -1. && result.z <= 1.;
}
// float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
//     return (near * far) / ((far - near) * invClipZ - far);
// }
float getDepth(const in sampler2D depthTexture, const in vec2 screenPosition) {
    #if DEPTH_PACKING == 1
    return unpackRGBAToDepth(texture2D(tDepth, screenPosition));
    #else
    return texture2D(tDepth, screenPosition).x;
    #endif
}
float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = getDepth(depthSampler, coord);
    // viewZ 即渲染片段和摄影机之间的z距离
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}
float getViewZ(const in float depth) {
    return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);
}
vec3 getViewPosition(const in vec2 screenPosition, const in float depth, const in float viewZ) {
    float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];
    vec4 clipPosition = vec4((vec3(screenPosition, depth) - 0.5) * 2.0, 1.0);
    clipPosition *= clipW; // unprojection.

    return (cameraInverseProjectionMatrix * clipPosition).xyz;
}
vec4 toEye(in vec2 uv, in float depth) {
    vec2 xy = vec2((uv.x * 2. - 1.), (uv.y * 2. - 1.));
    vec4 posInCamera = cameraInverseProjectionMatrix * vec4(xy, depth, 1.);
    posInCamera = posInCamera / posInCamera.w;
    return posInCamera;
}
void main(void) {
    vec4 texel = texture2D(tDiffuse, vUv);
    // 获取该像素点的深度值
    float centerDepth = getDepth(tDepth, vUv);
    // 计算出渲染片段和摄影机之间的z距离
    float centerViewZ = getViewZ(centerDepth);
    // 像素的世界坐标
    // vec3 viewPosition = getViewPosition(vUv, centerDepth, centerViewZ);
    vec4 viewPosition = toEye(vUv, centerDepth);
    // // 像素的世界坐标
    // vec4 worldPositon = cameraMatrixWorldInverse * vec4(viewPosition, 1.0);
    // 灯光起点到目标的向量
    // vec3 lightDir = normalize(lightPosition - viewPosition);
    // vec3 normal = normalize(vNormal);
    // float diff = dot(lightDir, normal);
    // 虚拟相机中的坐标
    vec4 vcPos = viewCameraModelViewMatrix * viewPosition;
    vec4 result = viewCameraProjectionMatrix * vcPos;
    float dist1 = length(vcPos.xyz);
    float dist = distance(viewPosition.xyz, vec3(100, 100, -200));
    // if(visible(result)) {
    //     if(diff >= 0.0) {
    //         gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    //     } else {
    //         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    //     }
    // } else {
    // // gl_FragColor.rgb = 1. - vec3(centerDepth);
    // // gl_FragColor.a = 1.0;
    //     gl_FragColor = vec4(texel);
    // }
    if(dist < u_distance) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    } else {
        gl_FragColor = vec4(texel);
    }
    // gl_FragColor.rgb = vec3(u_distance / 1000.0);
    // gl_FragColor = texture2D(tDepth, vUv);
    // gl_FragColor = texel;
}