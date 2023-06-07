varying vec2 vUv;


    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
}