varying vec3 vFragPos;
/**
* 保存深度值
*/
vec4 valueToRGBA(float value) {

    float alpha = mod(value, 256.0);
    float blue = mod((value - alpha) / 256.0, 256.0);
    float green = mod((value - blue * 256.0 - alpha) / 65536.0, 256.0);
    float red = (value - green * 65536.0 - blue * 256.0 - alpha) / 16777216.0;
    return vec4(red / 255.0, green / 255.0, blue / 255.0, alpha / 255.0);
}
void main() {
    gl_FragColor = valueToRGBA(vFragPos.z);// 将z值分开存储到rgba分量中
}
