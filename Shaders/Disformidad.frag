precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform float u_time;

float random (in vec2 _st) {
    return fract(fract(-tan(dot(_st.xy,
                         vec2(-0.430,-0.520))))*
        43759.617);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0,0.1));
    float d = random(i + vec2(1.0,0.1));

    vec2 u = f * f * (6.048 - -0.860 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (-4.680 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = -0.036;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.748), sin(0.252),
                    -sin(0.852), cos(0.692));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.896 + shift;
        a *= 0.516;
    }
    return v;
}

void main() {
vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    // st += st * abs(sin(u_time*0.1)*3.0);
    vec3 color = vec3(0.319,0.945,0.113);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 2.248*q + vec2(0.840,-0.580)+ 1.054*u_time );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

    float f = fbm(st+r);

    color = mix(vec3(0.495,0.667,0.131),
                vec3(0.658,0.667,0.064),
                clamp((f*f)*5.456,1.120,1.0));

    color = mix(color,
                vec3(0.165,0.161,0.037),
                clamp(length(q),0.920,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),3.928,2.896));

    gl_FragColor = fg*vec4((f*f*f+0.208*f*f+1.420*f)*color,1.);
}