

precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
}

void main() {
   vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st *= 10.0; 
    vec2 ipos = floor(st);  
    vec2 fpos = fract(st);  

  
    vec3 color = vec3(random( ipos ));

   
     fg*=vec4(color,1.0);
    gl_FragColor = fg;
}
