precision mediump float;  
uniform mat4 modelViewMatrixSM;
uniform mat4 projectionMatrixSM;
varying vec4 result;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    result = projectionMatrixSM * modelViewMatrixSM * vec4(position, 1.0);
}