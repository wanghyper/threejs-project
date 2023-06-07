varying vec2 vTextureCoord;
varying vec3 vFragPos;
varying vec3 vNormal;
varying vec4 vModelPos;
uniform mat4 viewCameraProjectionMatrix;
uniform mat4 viewCameraMatrixWorldInverse;
    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    vFragPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vTextureCoord = uv;
    vModelPos = modelMatrix * vec4(position, 1.0);

}