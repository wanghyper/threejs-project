varying vec3 vFragPos;

void main(void) {

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos = gl_Position.xyz;
}