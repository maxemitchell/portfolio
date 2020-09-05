#ifdef GL_ES
precision mediump float;
#endif

#define SCALE 100.

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_amp;
uniform float u_fft[128];
uniform float u_beat;

float circle(in vec2 _st, in vec2 _pos, in float _radius){
    vec2 dist = _st-_pos;
	return 1.-smoothstep(_radius-(_radius*0.8),
                         _radius+(_radius*.2),
                         dot(dist,dist)*4.0);
}

float smoothen(in float k, in float d[128]){
    float sum = 0.0;
    for(int i = 0; i < 128; i++){
        sum += exp(-k*d[i]);
    }
    return -log(sum)/k;
}

vec2 random2(in vec2 p){
    return fract(sin(vec2(dot(p,vec2(219.532, 8.828)),dot(p,vec2(75.5,741.3))))*(1000.5453+(u_time*.5)*.4));
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(75.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 7

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    vec3 color = vec3(1.0);
    
    //fBm background
    vec2 q = vec2(0.);
    q.x = fbm( st*11.0 + 0.33*u_time);
    q.y = fbm( st*11.0 + vec2(1.0) + 0.31*u_time);

    vec2 r = vec2(0.);
    r.x = fbm( st*11.0 + 1.0*q + vec2(1.7,9.2)+ 0.45*u_time);
    r.y = fbm( st*7.0 + 1.0*q + vec2(8.3,2.8)+ 0.226*u_time);

    float f = fbm(st*9.0+r);

    // Colors for main bg and Voronoi
    vec3 c_pink = vec3(.98,.278,.678);
    vec3 c_lightblue = vec3(.827,.706,.969);

    color = mix(vec3(0.1882, 0.4549, 0.502),
                vec3(0.2588, 0.6588, 0.3804),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0.251, 0.7608, 0.4824),
                clamp(length(q.x),0.0,1.0));

    color = mix(color,
                vec3(0.0745, 0.5569, 0.5725),
                clamp(length(q.y - q.x),0.0,1.0));

    color = mix(color,
                c_lightblue,
                clamp(length(r.x),0.0,1.0));

    color = mix(color,
                c_pink,
                clamp(length(r.y - r.x),0.0,1.0));


    vec3 colorfBm = vec3((.37*f*f*f+.67*f*f+.56*f + .17)*color);
    color = colorfBm;
    
    // Scale
    st *= SCALE;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 5.;  // minimum distance
    vec2 m_point;        // minimum point

    for (int j=-1; j<=1; j++ ) {
        for (int i=-1; i<=1; i++ ) {
            vec2 neighbor = vec2(float(i),float(j));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5*sin(u_time*1.1 + 6.3*point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);

            if( dist < m_dist ) {
                m_dist = dist;
                m_point = point;
            }
        }
    }

    // Assign a color using the closest point position
    // color = mix(c_pink, c_lightblue, dot(m_point,vec2(0.5, 0.5)));
    vec3 colorDot1 = mix(c_pink, vec3(.231,.824,.608), u_beat);
    vec3 colorDot2 = mix(c_lightblue, vec3(.227,.553,.749), u_beat);
    color = mix(colorDot1, colorDot2, dot(m_point,vec2(0.5, 0.5)));
    st /= SCALE;

    // Create FFT particles
    float points[128];
    for(int i = 0; i < 128; i++){
        vec2 point = vec2((random2(vec2(float(i+1),-float(i+1)))));
        points[i] = distance(st,point)*38./(1.0+1.2*u_fft[i]);
    }
    // use distance map for Voronoi circles and borders
    float d = smoothen(2.5, points);
    float border = smoothstep(.65,.7,d) * smoothstep(.8, .75, d);
    d=1.0-smoothstep(.45,.55,d);

    // Add fBm background
    colorfBm = clamp(colorfBm - vec3(d), 0.0, 1.0);
    color = clamp(color * vec3(d), 0.0, 1.0);
    color -= vec3(border);
	color += colorfBm;

    color = sqrt(color*(color*1.77)); // Helps lighten the colors and makes it a bit more natural
    gl_FragColor = vec4(color,1.0);
}
