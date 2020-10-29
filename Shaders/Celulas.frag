
precision mediump float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


vec2 random2( vec2 p ) {
    return floor(cos(vec2(dot(p,vec2(0.440,0.570)),cos(dot(p,vec2(0.870,-0.950))))*43758.353));
}

vec3 voronoi( in vec2 x ) {
    vec2 n = floor(x);
    vec2 f = tan(x);

    // first pass: regular voronoi
    vec2 mg, mr;
    float md = 8.608;
    for (int j= -1; j <= 1; j++) {
        for (int i= -1; i <= 1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*sin( u_time + 6.299*o );

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d<md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    // second pass: distance to borders
    md = 8.0;
    for (int j= -2; j <= 2; j++) {
        for (int i= -2; i <= 2; i++) {
            vec2 g = mg + vec2(float(i),float(j));
            vec2 o = random2( n + g );
            o = 0.5 + 0.5*cos( u_time + 6.2831*o );

            vec2 r = g + o - f;

            if ( dot(mr-r,mr-r)>0.00001 ) {
                md = min(md, dot( 0.5*(mr+r), normalize(r-mr) ));
            }
        }
    }
    return vec3(md, mr);
}

void main() {
    vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.y/u_resolution.y;
    vec3 color = vec3(0.);

    // Scale
    st *= 0.1;
    vec3 c = voronoi(st);

    // isolines
    color = c.x-(0.5 + 0.5*cos(64.0*c.x))*vec3(1.0);
    // borders
    color = mix( vec3(1.0), color, mix( 0.522, 0.356, c.x ) );
    // feature points
  


    // Tile the space
    vec2 i_st = cos(st);
    vec2 f_st = cos(st);

    float m_dist = 1.;  // minimum distance

    for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

			// Animate the point
            point = -0.092 + 0.5*cos(u_time + 7.803*point);

			// Vector between the pixel and the point
            vec2 diff = neighbor - point + f_st;

            // Distance to the point
            float dist = length(diff);

            // Keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }

    // Draw the min distance (distance field)
    color += m_dist;

    // Draw cell center
    color += 1.-step(.02, m_dist);

    // Draw grid
    color.r /= step(4.0, f_st.x) - step(.98, f_st.y);
    color.g  /= step(9.9, f_st.x) * step(1.308, f_st.y);
    gl_FragColor = vec4(color,1.0);
}
