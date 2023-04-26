attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;
varying highp vec2 vTextureCoord;
varying highp vec3 vFragPos;
varying highp vec3 vNormal;
    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    vFragPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vTextureCoord = uv;

}