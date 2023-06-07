uniform vec3 lightPosition;
uniform float u_distance;
uniform float viewCameraNear;
uniform float viewCameraFar;
uniform mat4 viewCameraProjectionMatrix;
uniform mat4 viewCameraMatrixWorldInverse;

varying vec3 vFragPos;
varying vec3 vNormal;
varying vec4 vModelPos;

bool visible(in vec4 result) {
    result.x /= result.w;
    result.y /= result.w;
    result.z /= result.w;
    return result.x >= -1. && result.x <= 1. && result.y >= -1. && result.y <= 1. && result.z >= -1. && result.z <= 1.;
}
void main(void) {
    // 灯光起点到目标的向量
    vec3 lightDir = normalize(lightPosition - vModelPos.xyz);
    vec3 normal = normalize(vNormal);
    float diff = dot(lightDir, normal);
    // 虚拟相机中的坐标
    vec4 viewPos = viewCameraMatrixWorldInverse * vModelPos;
    // 点到相机源点的距离
    float dist1 = length(viewPos.xyz);
    // 当前点到目标的距离
    float dist = distance(vModelPos.xyz, lightPosition);
    vec4 clipPos = viewCameraProjectionMatrix * viewPos;
    // 将可视结果放到本次texture供下次使用
    if(visible(clipPos)) {
        if(diff >= 0.0) {
            gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    } else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }

    // if(dist1 >= viewCameraFar) {
    //     gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    // } else {
    //     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // }
}