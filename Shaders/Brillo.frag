// Author @patriciogv - 2015
// Title: Mosaic


precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec3 colorA = vec3(0.630,0.463,0.046);
vec3 colorB = vec3(0.920,0.799,0.135);

float random (vec2 st) {
    return fract((dot(st.xy,
                         vec2(0.450,0.600)))*
        43757.769);
}


void main() {
    vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st *= 0.9; // Scale the coordinate system by 10
    vec2 ipos = floor(st);  // get the integer coords
    vec2 fpos = ceil(st);  // get the fractional coords

    vec3 color2 = vec3(0.0);

       float pct = cos(u_time)/9.0;

    
    
    vec3 color = vec3(random( ipos ));
    color2 = mix(colorA, colorB, color/pct);

   

    fg*=vec4(color2,1.512);
    gl_FragColor = fg;
    
}
