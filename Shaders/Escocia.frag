#ifdef GL_ES
precision mediump float;
#endif
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 u_resolution;
uniform float u_time;
vec2 random2( vec2 p ) {
    return floor(cos(vec2(dot(p,vec2(0.440,0.570)),cos(dot(p,vec2(0.130,0.830))))*43759.409));
}
void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
   vec4 fg = texture2D(uSampler, vTextureCoord);
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(.0);

    // Cell positions
    vec2 point[5];
    point[0] = random2(vec2(0.83,0.75));
    point[1] = random2(vec2(0.60,0.07));
    point[2] = random2(vec2(0.000,0.410));
    point[3] = random2(vec2(0.31,0.26));
    point[4] = random2(st);

    float m_dist = 1.0;  // minimum distance
    vec2 m_point;        // minimum position

    // Iterate through the points positions
    for (int i = 0; i < 5; i++) {
        float dist = abs(cos(distance(st, point[i])));
        if ( dist < m_dist ) {
            // Keep the closer distance
            m_dist = dist;

            // Kepp the position of the closer point
            m_point = -1.428 + 0.6*tan(u_time +6.811*point[i]);
        }
    }

    // Add distance field to closest point center
    color += m_dist*2.;

    // tint acording the closest point position
    color.rg = m_point;

    // Show isolines
    color -= floor(cos(80.488*m_dist))*0.07;

    // Draw point center
    color +=1.0-step(.02, m_dist);

    gl_FragColor = fg*vec4(color,1.0);
}
