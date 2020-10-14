
precision mediump float;
uniform vec2 u_resolution;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
vec3 colorA = vec3(0.305,0.139,0.009);
vec3 colorB = vec3(0.820,0.446,0.112);

float random (vec2 st) {
    return fract((dot(st.xy,vec2(0.670,-0.090)))*43758.161);
}

    void main() {
    vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    float rnd = random( st );
    vec3 color2 = ((colorA*rnd)+(colorB*rnd));
    fg*=vec4(color2,1.368);
    gl_FragColor = fg;

}
