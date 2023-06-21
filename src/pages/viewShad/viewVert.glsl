varying vec3 vNormal;
varying vec4 vModelPos;
    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vModelPos = modelMatrix * vec4(position, 1.0);

}