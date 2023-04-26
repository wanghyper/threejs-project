
float readDepth(sampler2D depthSampler, vec2 coord) {
    float fragCoordZ = texture2D(depthSampler, coord).x;
    float viewZ = perspectiveDepthToViewZ(fragCoordZ, cameraNear, cameraFar);
    return viewZToOrthographicDepth(viewZ, cameraNear, cameraFar);
}
void main() {
    gl_FragColor = vec4(gl_FragCoord.z, 0.0, 0.0, 0.0); // 将片元的深度值写入r值
}