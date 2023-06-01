#ifdef GL_ES
precision mediump float;  
    #endif
uniform sampler2D uSampler;
uniform vec3 uKd;
uniform vec3 uKs;
uniform vec3 lightPosition;
uniform float uLightIntensity;
uniform int uTextureSample;

varying vec2 vTextureCoord;
varying vec3 vFragPos;
varying vec3 vNormal;

bool visible(in vec4 result) {
    result.x /= result.w;
    result.y /= result.w;
    result.z /= result.w;
    return result.x >= -1. && result.x <= 1. && result.y >= -1. && result.y <= 1. && result.z >= -1. && result.z <= 1.;
}

void main(void) {
    vec3 color;
    if(uTextureSample == 1) {
        color = pow(texture2D(uSampler, vTextureCoord).rgb, vec3(2.2));
    } else {
        color = uKd;
    }

    vec3 ambient = 0.05 * color;
    // 灯光起点到目标的向量
    vec3 lightDir = normalize(lightPosition - vFragPos);
    vec3 normal = normalize(vNormal);
    float diff = max(dot(lightDir, normal), 0.0);
    float light_atten_coff = uLightIntensity / length(lightPosition - vFragPos);
    vec3 diffuse = diff * light_atten_coff * color;

    vec3 viewDir = normalize(cameraPosition - vFragPos);
    float spec = 0.0;
    vec3 reflectDir = reflect(-lightDir, normal);
    spec = pow(max(dot(viewDir, reflectDir), 0.0), 35.0);
    vec3 specular = uKs * light_atten_coff * spec;

    // gl_FragColor = vec4(pow((ambient + diffuse + specular), vec3(1.0 / 2.2)), 1.0);
    gl_FragColor = vec4(pow((diffuse), vec3(1.0 / 2.2)), 1.0);    

    //   gl_FragColor = vec4( color, 1.0 );
    //   gl_FragColor = vec4(lightDir, 0.0, 0.0, 1.0);
    // gl_FragColor = vec4(vFragPos, 1.0);

}