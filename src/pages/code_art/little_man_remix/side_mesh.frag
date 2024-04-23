uniform float u_time;
uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;
uniform float u_seed; // Added seed for randomness
uniform float u_frequency;

varying vec2 vUv; // Using varying from @base.vert

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(75.9898 + u_seed,78.233 + u_seed)))*
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
    vec2 shift = vec2(100.0 + u_seed);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5 + u_seed), sin(0.5 + u_seed),
                    -sin(0.5 + u_seed), cos(0.50 + u_seed));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 st = vUv;

    vec3 color = vec3(1.0);
    
    //fBm background
    vec2 q = vec2(0.);
    q.x = fbm( st*11.0 + 0.33*u_time);
    q.y = fbm( st*11.0 + vec2(1.0) + 0.31*u_time);

    vec2 r = vec2(0.);
    r.x = fbm( st*11.0 + 1.0*q + vec2(1.7,9.2)+ 0.45*u_time);
    r.y = fbm( st*7.0 + 1.0*q + vec2(8.3,2.8)+ 0.226*u_time);

    float f = fbm(st*9.0+r);

    vec2 q2 = vec2(0.);
    q2.x = fbm( st*7.0 + 0.24*u_time);
    q2.y = fbm( st*7.0 + vec2(1.0) + 0.24*u_time);

    vec2 r2 = vec2(0.);
    r2.x = fbm( st*12.0 + 1.3*q2 + vec2(1.4,3.2)+ 0.42*u_time);
    r2.y = fbm( st*8.0 + 1.2*q2 + vec2(2.4,1.8)+ 0.123*u_time);

    float f2 = fbm(st*5.4+r2);

    color = mix(u_color0,u_color1,
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,u_color2,
                clamp(length(q.x),0.0,1.0));

    color = mix(color,u_color3,
                clamp(length(q.y - q.x),0.0,1.0));

    color = mix(color,u_color4,
                clamp(length(r.x),0.0,1.0));

    color = mix(color,u_color5,
                clamp(length(r.y - r.x),0.0,1.0));

    vec3 colorfBm = vec3((.37*f*f*f+.67*f*f+.56*f + .17)*color);

    vec3 color2 = vec3(1.0);
    color2 = mix(u_color3,u_color1,
                clamp((f2*f2*f2)*3.0,0.0,1.0));
    color2 = mix(color2,u_color1,
                clamp(length(q2.x),0.0,1.0));
    color2 = mix(color2,u_color4,
                clamp(length(q2.y - q2.x),0.0,1.0));
    color2 = mix(color2,u_color0,
                clamp(length(r2.x),0.0,1.0));
    color2 = mix(color2,u_color1,
                clamp(length(r2.y - r2.x),0.0,1.0));

    vec3 colorPoints = vec3((.732*f2*f2*f2+.71*f2*f2+.53*f2 + .4)*color2);

    color = mix(colorfBm, colorPoints, u_frequency);

    color = sqrt(color*(color*1.63)); // Helps lighten the colors and makes it a bit more natural
    float transparency = 1.0 - (color.r * .2 + color.g * 0.2 + color.b * 0.2); // Calculate transparency based on closeness to black
    gl_FragColor = vec4(color, transparency);
}


