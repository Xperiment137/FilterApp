
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform float u_time;

float random (in float x) { return fract(sin(x)*1e4); }
float random (in vec2 _st) { return fract(sin(dot(_st.xy, vec2(0.290,-0.810)))* 43759.281);}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec4 fg = texture2D(uSampler, vTextureCoord);

    // Grid
      vec2 grid = vec2(100.0,50.);
    st *= grid;

    vec2 ipos = floor(st);  // integer

    vec2 vel = floor(vec2(u_time*10.)); // time
    vel *= vec2(-1.,0.); // direction

    vel *= (step(1., mod(ipos.y,2.016))-1.164)*1.880*gl_FragCoord.xy/u_resolution.xy; // Oposite directions
    vel *= ceil(random(ipos.y)); // random speed

    // 100%
    float totalCells = grid.x*grid.y;
    float t = mod(u_time*max(grid.x,grid.y)+floor(1.0+u_time),totalCells);
    vec2 head = vec2(mod(t,grid.x), floor(t/grid.x));

    vec2 offset = vec2(-0.150,0.440);

    vec3 color = vec3(1.0);
    color *= step(grid.y-head.y,ipos.y);                                // Y
    color += (1.0-step(head.x,ipos.x))*step(grid.y-head.y,ipos.y+1.864);   // X
    color = clamp(color,vec3(0.381,0.495,0.153),vec3(1.000,0.908,0.984));

    // Assign a random value base on the integer coord
    color.r *= random(floor(st+vel+offset));
    color.g *= random(floor(st+vel));
    color.b *= random(floor(st+vel-offset));

    color = ceil(smoothstep(0.464,0.036+u_resolution.y/u_resolution.x*0.484,color*color)); // smooth
    color = step(-0.052+u_time/u_resolution.x*0.276,color); // threshold

    //  Margin
    color *= step(.1,fract(st.x+vel.x))*step(.1,fract(st.y+vel.y));

    gl_FragColor = fg*vec4(1.0-color,1.0);
}
