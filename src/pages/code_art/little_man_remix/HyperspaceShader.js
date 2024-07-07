import { DoubleSide } from 'three';

const HyperspaceShader = {
    name: 'HyperspaceShader',
    uniforms: {
        u_time: { type: "f", value: 0.0 },
        u_activate: { type: "f", value: 0.0 } // Uniform to control when the effect is triggered
    },
    side: DoubleSide,
    transparent: true,
    // From https://www.shadertoy.com/view/3l3GzN
    vertexShader: /* glsl */`
        varying vec2 vUv;

        void main() {
            vUv = position.xy * 0.01;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader: /* glsl */`
        uniform float u_time;
        uniform float u_activate; // Uniform to control when the effect is triggered

        varying vec2 vUv;

        /*
            Simplified and adapted from:
            https://www.shadertoy.com/view/MlKBWw
        */

        #define TAU 6.28318

        // The way this shader works is by looking at the screen as if it were a disk and then
        // this disk is split into a number of slices centered at the origin. Each slice renders
        // a single trail. So this setting controls the overall density of the effect:
        #define NUM_SLICES 50.0

        // Each trail is rendered within its slice; but to avoid generating regular patterns, we
        // randomly offset the trail from the center of the slice by this amount:
        const float MAX_SLICE_OFFSET = 0.9;

        // This is the length of the effect in seconds:
        const float T_MAX = 2.0;
        // T_JUMP is in normalized [0..1] time: this is the time when the trails zoom out of view
        // because we've jumped into hyperspace:
        const float T_JUMP = 0.90;
        // This is the speed during the final jump:
        const float jump_speed = 5.0;

        // I've noticed that the effect tends to have a bluish tint. In this shader, the blue color
        // is towards the start of the trail, and the white color towards the end:
        const vec3 blue_col = vec3(0.3, 0.3, 0.6);
        const vec3 white_col = vec3(0.8, 0.8, 0.95);


        float sdLine( in vec2 p, in vec2 a, in vec2 b, in float ring )
        {
            vec2 pa = p-a, ba = b-a;
            float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
            return length( pa - ba*h ) - ring;
        }

        float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }


        void main() {
            if (u_activate < 0.5) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); // Output black if effect is not activated
                return;
            }

            vec3 color = vec3(0.0);
            float time = mod(u_time, T_MAX);
            float t = time / T_MAX;

            vec2 p = 2.0 * vUv.xy;
            float p_len = length(p);

            float ta = TAU * mod(u_time, 8.0) / 8.0;
            float ay = 0.0, ax = 0.0, az = 0.0;

            // this flips the effect (moving backwards through time)
            // ay += 135.0;
            mat3 mY = mat3(
                cos(ay), 0.0,  sin(ay),
                0.0,     1.0,      0.0,
                -sin(ay), 0.0,  cos(ay)
            );

            mat3 mX = mat3(
                1.0,      0.0,     0.0,
                0.0,  cos(ax), sin(ax),
                0.0, -sin(ax), cos(ax)
            );
            mat3 m = mX * mY;

            vec3 v = vec3(p, 1.0);
            v = m * v;

            float trail_start, trail_end, trail_length = 1.0, trail_x;
            // Fade all the trails into view from black to a little above full-white:
            float fade = mix(1.4, 0.0, smoothstep(0.65, 0.95, t));

            // Each slice renders a single trail; but we can render multiple layers of
            // slices to add more density and randomness to the effect:
            for(float i = 0.0; i < 60.0; i++)
            {
                vec3 trail_color = vec3(0.0);
                float angle = atan(v.y, v.x) / 3.141592 / 2.0 + 0.13 * i;

                float slice = floor(angle * NUM_SLICES);
                float slice_fract = fract(angle * NUM_SLICES);
                // Don't center the trail in the slice: wiggle it a little bit:
                float slice_offset = MAX_SLICE_OFFSET *
                    rand(vec2(slice, 4.0 + i * 25.0)) - (MAX_SLICE_OFFSET / 2.0);
                // Without dist, all trails get stuck to the walls of the
                // tunnel. Allowing dist to be negative gives a more homogeneous
                // coverage of all the space, both in front and behind the
                // camera.
                float dist = 10.0 * rand(vec2(slice, 1.0 + i * 2.0)) - 5.0;
                float z = dist * v.z / length(v.xy);

                // When dist is negative we have to invert a number of things:
                float f = sign(dist);
                if (f == 0.0) f = 1.0;
                // This is the speed of the current slice
                float fspeed = f * (rand(vec2(slice, 1.0 + i * 0.1)) + i * 0.01);
                float fjump_speed = f * jump_speed;
                float ftrail_length = f * trail_length;

                trail_end = 10.0 * rand(vec2(slice, i + 10.0)) - 5.0;
                trail_end -= t * fspeed;

                // Adding to the trail pushes it "back": Z+ is into the screen
                // away from the camera... unless f is negative, then we invert
                // the rules
                trail_start = trail_end + ftrail_length;
                if (f >= 0.0) {
                    // Shrink the trails into their ends:
                    trail_start = max(trail_end,
                                    trail_start - (t * fspeed) -
                                        mix(0.0, fjump_speed,
                                                        smoothstep(0.5, 1.0, t))
                                    );
                    //float trail_x = smoothstep(trail_start, trail_end, p_len);
                } else {
                    // Shrink the trails into their ends:
                    trail_start = min(trail_end,
                                    trail_start - (t * fspeed) -
                                        mix(0.0, fjump_speed,
                                                        smoothstep(0.5, 1.0, t))
                                    );
                }
                trail_x = smoothstep(trail_start, trail_end, z);
                trail_color = mix(blue_col, white_col, trail_x);

                // This line computes the distance from the current pixel, in "slice-coordinates"
                // to the ideal trail centered at the slice center. The last argument makes the lines
                // a bit thicker when they reach the edges as time progresses.
                float h = sdLine(
                    vec2(slice_fract + slice_offset, z),
                    vec2(0.5, trail_start),
                    vec2(0.5, trail_end),
                    mix(0.0, 0.015, z));

                // This threshold adds a "glow" to the line. This glow grows with time:
                float threshold = mix(0.12, 0.0, smoothstep(0.5, 0.8, t));
                h = (h < 0.01) ? 1.0 : 0.75 * smoothstep(threshold, 0.0, abs(h));

                trail_color *= fade * h;
             
                // Accumulate this trail with the previous ones
                color = max(color, trail_color);
            }
            // Whiteout
            color += mix(1.0, 0.0, smoothstep(0.0, 0.2, t));
            float alpha = 1.0;
            if (color.x < 0.1 && color.y < 0.1 && color.z < 0.1) {
                alpha = 0.0;
            } else {
                alpha = 0.9;
            }

            gl_FragColor = vec4(color, alpha);
        }`
};

export default HyperspaceShader;
