import { DoubleSide, Color } from 'three';

const MeshShader = (seed) => ({
    name: 'MeshShader',

    uniforms: {
        u_time: { type: "f", value: 0.0 },
        u_frequency0: { type: "f", value: 0.0 },
        u_frequency1: { type: "f", value: 0.0 },
        u_frequency2: { type: "f", value: 0.0 },
        u_frequency3: { type: "f", value: 0.0 },
        u_frequency4: { type: "f", value: 0.0 },
        u_color0: { type: "vec3", value: new Color(0x1F2B3A) }, // Steel Blue
        u_color1: { type: "vec3", value: new Color(0x40E0D0) }, // Turquoise
        u_color2: { type: "vec3", value: new Color(0xFFD700) }, // Golden Yellow
        u_color3: { type: "vec3", value: new Color(0x00FF7F) }, // Alien Green
        u_color4: { type: "vec3", value: new Color(0xFF6347) }, // Terra Cotta Orange
        u_color5: { type: "vec3", value: new Color(0x8A2BE2) }, // Pulsar Purple
        u_seed: { type: "f", value: seed }, // Unique seed for each mesh
    },
    side: DoubleSide,
    transparent: true,

    vertexShader: /* glsl */`
        varying vec2 vUv;

        void main() {
            vUv = position.xy * 0.01;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader: /* glsl */`
        uniform float u_time;
        uniform vec3 u_color0;
        uniform vec3 u_color1;
        uniform vec3 u_color2;
        uniform vec3 u_color3;
        uniform vec3 u_color4;
        uniform vec3 u_color5;
        uniform float u_seed; // Added seed for randomness
        uniform float u_frequency0;
        uniform float u_frequency1;
        uniform float u_frequency2;
        uniform float u_frequency3;
        uniform float u_frequency4;

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
            q.x = fbm( vec2(st.x*11.0, st.y*11.0 + 0.33*u_time));
            q.y = fbm( vec2(st.x*11.0 + 1.0, st.y*11.0 + 0.31*u_time));

            vec2 r = vec2(0.);
            r.x = fbm( vec2(st.x*11.0 + 1.0*q.x + 1.7, st.y*11.0 + 1.0*q.y + 9.2 + 0.45*u_time));
            r.y = fbm( vec2(st.x*7.0 + 1.0*q.x + 8.3, st.y*7.0 + 1.0*q.y + 2.8 + 0.226*u_time));

            float f = fbm(st*9.0+r);

            vec2 q2 = vec2(0.);
            q2.x = fbm( vec2(st.x*7.0, st.y*7.0 + 0.24*u_time));
            q2.y = fbm( vec2(st.x*7.0 + 1.0, st.y*7.0 + 0.24*u_time));

            vec2 r2 = vec2(0.);
            r2.x = fbm( vec2(st.x*12.0 + 1.3*q2.x + 1.4, st.y*12.0 + 1.3*q2.y + 3.2 + 0.42*u_time));
            r2.y = fbm( vec2(st.x*8.0 + 1.2*q2.x + 2.4, st.y*8.0 + 1.2*q2.y + 1.8 + 0.123*u_time));

            float f2 = fbm(st*5.4+r2);

            //highlights / brighter
            color = mix(u_color0, u_color1,
                        clamp((f*f)*7.0*u_frequency1, 0.0, 1.0));

            // Greener
            color = mix(color, u_color2,
                        clamp(length(q.x - 0.63*u_frequency0), 0.0, 1.0));

            // Makes things darker
            color = mix(color, u_color3,
                        clamp(length(q.y*(1.0 + 1.75*u_frequency3) - q.x), 0.0, 1.0));

            // Makes things brighter subtley
            color = mix(color, u_color4,
                        clamp(length(r.x*(1.0 - 2.13*u_frequency2)), 0.0, 1.0));

            // oranger
            color = mix(color, u_color5,
                        clamp(length(r.y*(1.0 + 1.2*u_frequency4) - r.x), 0.0, 1.0));

            vec3 colorfBm = vec3((.42*f*f*f + .65*f*f + .55*f + .05)*color);

            color = colorfBm;

            color = sqrt(color*(color*1.63)); // Helps lighten the colors and makes it a bit more natural
            float transparency = 1.0 - (color.r * .2 + color.g * 0.2 + color.b * 0.2); // Calculate transparency based on closeness to black
            gl_FragColor = vec4(color, transparency);
        }`

});

export default MeshShader;
