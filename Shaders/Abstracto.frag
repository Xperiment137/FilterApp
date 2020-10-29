precision mediump float;
uniform vec2 resolution;
uniform float time;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;

// #define BOX_SIZE 7.0
#define BOX_SIZE (8.0)

#define COLOR_RED vec3(0, 1, 1)
#define COLOR_GREEN vec3(0, 1, 0)
#define COLOR_BLUE vec3(0, 0, .2)
#define WATER vec3(4, 45, 107)/255.0 * 0.25

#define PI 3.141592

float sdf(vec3 p)
{
    p = mod(p + BOX_SIZE / 2.0, BOX_SIZE) - BOX_SIZE / 2.0;
    float size = 0.04;
    // p *= 1.05; // 1より大きい値を乗算するとちらつく
    return length(p - vec3(0,0,0)) - size;
}

float remap(float x, float a, float b, float c, float d)
{
    return (x - a) / (b - a) * (d - c) + c;
}

float linearFog(float z)
{
    float start = 50.0;
    float end = 100.0;

    return clamp(-(end - z) / (start - z), 0.0, 1.0);
}

mat2 matrixR2(float theta)
{
    return mat2(cos(theta), -sin(theta), sin(theta), cos(theta));    
}

vec4 mult_qq(vec4 a, vec4 b){
    return vec4(
        a.x * b.x - a.y * b.y - a.z * b.z - a.w * b.w,
        a.x * b.y + a.y * b.x + a.z * b.w - a.w * b.z,
        a.x * b.z - a.y * b.w + a.z * b.x + a.w * b.y,
        a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x
    );
}


vec4 mult_vq(vec3 v, vec4 q)
{
    return mult_qq(vec4(v,1),q);
}

vec3 rotate(vec3 p, vec3 a, float rad)
{
    
    // vec3 a = normalize(vec3(-0.5,1,0.3)); // 回転軸
    // float rad = time; // 軸周りの回転の量
    vec4 q1 = vec4(a.x * sin(rad), a.y * sin(rad), a.z * sin(rad), cos(rad));
    vec4 q2 = vec4(-q1.xyz, q1.w);

    return mult_qq(q1, mult_vq(p, q2)).xyz;
}


void main()
{
    vec4 fg = texture2D(uSampler, vTextureCoord);
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / (max(resolution.x, resolution.y));
    p *= 2.7;

    float t1 = time * PI * 4.0;
    float t2 = time * PI / 36.0;

    vec3 cVel = normalize(vec3(1,1,1));
    vec3 cDir = normalize(vec3(1, 1, 1)); // カメラ向き
    vec3 cUp = normalize(cross(cDir, vec3(1, 0, 0))); // カメラ上方向ベクトル

    vec3 cPos = vec3(0, -1.8, 0) + cVel * t1; // カメラ位置

    cUp = rotate(cUp, cVel, t2);
    vec3 cSide = normalize(cross(cUp, cDir)); 
    vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir);

    float t = 0.0;
    float isHit = 0.0;
    for (int i = 0; i < 24; i++)
    {
        vec3 rp = cPos + rd  * t;
        float d = sdf(rp);
        if (d < 0.001)
        {
            isHit = 1.0;
            break;
        }

        t += d;
    }
    t = 0.05 * t;

    vec3 c = mix(vec3(4, 45, 107)/255.0 * 0.25, vec3(1.0, 1.0, 0.5 + sin(time * PI / 2.0) * 0.5), exp(-t));
    c = mix(c, COLOR_RED, exp(-t));
    fg *=vec4(c, 1);
    gl_FragColor = fg;
}
