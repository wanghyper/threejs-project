varying vec2 vUv;
varying vec4 vFragPos;
    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos = gl_Position;
    vUv = uv;
}