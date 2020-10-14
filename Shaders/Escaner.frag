
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform float u_time;
float random (in float x) { return fract(sin(x)*1e4); }
float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(12.9898,78.233)))* 43758.5453123);}

void main()
{
   vec4 fg = texture2D(uSampler, vTextureCoord);
   vec2 p = gl_FragCoord.xy/u_resolution.xy;

    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(u_time+p.xyx+vec3(0,2,4));
    col += sin(p.x * atan(u_time / 5.0) * 50.0) + sin(random(p.y) * cos(u_time / 15.0) *10.0);
    col += tan(p.x * sin(u_time / 5.0) * 50.0) + cos(random(p.y) * sin(u_time / 15.0) *10.0);

    col *= vec3(0.1)*mod(u_time,random(p.x));

    // Output to screen
    gl_FragColor = fg*vec4(col,1.0);
}