uniform mat4 viewCameraProjectionMatrix;
uniform mat4 viewCameraMatrixWorldInverse;
uniform sampler2D tDepth;

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
    return rgbaToValue(texture2D(depthTexture, screenPosition));
}

void main(void) {
    // viewCamera中的坐标
    vec4 viewPos = viewCameraMatrixWorldInverse * vModelPos;
    // viewCamera的投影
    vec4 clipPos = viewCameraProjectionMatrix * viewPos;
    vec3 shadowCoord = clipPos.xyz / clipPos.w * 0.5 + 0.5;
    // 获取viewCamera的深度图
    float depth = getDepth(tDepth, shadowCoord.xy);
    // 将可视结果放到本次texture供下次使用
    if(visible(clipPos)) {
        if(clipPos.z - 0.5 <= depth) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}