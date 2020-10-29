precision highp float;


uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;



void main( void ) {
	
	vec3 color = vec3(abs(sin(u_time)), 0.1, abs(fract(u_time * 2.0)));

	vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / min(u_resolution.x, u_resolution.y);
	vec2 m = mod(p, 0.2) - 0.1;
	
	float l1 = 0.03 / length(m);	

	vec2 q  =  p + vec2(cos(u_time * 0.5), sin(u_time * 0.5));
	vec2 r  =  p - vec2(cos(u_time * 0.5), sin(u_time* 0.5));
	
	float l2 = 0.1 / length(q);
	float l3 = 0.1 / length(r);
	
	
	vec3 destColor = vec3(l1) * color + l2 + l3 ;
	
	gl_FragColor = vec4(vec3(destColor), 1.0 );
}
