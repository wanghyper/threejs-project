varying vec2 vUv;
varying vec3 vFragPos;
varying vec3 vNormal;
varying vec4 vResult;


    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    vFragPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vResult =  modelMatrix * vec4(position, 1.0);
}