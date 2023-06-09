attribute vec3 aNormalPosition;
attribute vec2 aTextureCoord;
varying vec2 vTextureCoord;
varying vec3 vFragPos;
varying vec3 vNormal;
varying vec4 vResult;
uniform mat4 camera_projection_matrix;
uniform mat4 camera_matrix_world_inverse;
    /*
    normal,position以及摄像机位置需要使用three.js内置参数
    */

void main(void) {

    vFragPos = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vTextureCoord = uv;
}