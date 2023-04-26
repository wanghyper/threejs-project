uniform mat4 projectionMatrixSM;
void main() {
    gl_Position = projectionMatrixSM * modelViewMatrix * vec4(position, 1.0);
}