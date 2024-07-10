import { DoubleSide } from 'three'

const WarpShader = {
  name: 'WarpShader',

  uniforms: {
    u_time: { type: 'f', value: 0.0 },
    u_warp: { type: 'f', value: 1.0 },
    u_speed_up: { type: 'f', value: 0.0 },
    u_active: { type: 'f', value: 0.0 },
  },
  side: DoubleSide,
  transparent: true,

  // From https://www.shadertoy.com/view/M3cGDX
  vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
            vUv = position.xy * 0.001;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

  fragmentShader: /* glsl */ `
        varying vec2 vUv;

        uniform float u_warp;
        uniform float u_time;
        uniform float u_speed_up;
        uniform float u_active;

        #ifdef GL_ES
        precision mediump float;
        #endif

        /* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
        vec3 random3(vec3 c) {
            float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
            vec3 r;
            r.z = fract(512.0*j);
            j *= .125;
            r.x = fract(512.0*j);
            j *= .125;
            r.y = fract(512.0*j);
            return r-0.5;
        }

        const float F3 =  0.3333333;
        const float G3 =  0.1666667;
        float snoise(vec3 p) {

            vec3 s = floor(p + dot(p, vec3(F3)));
            vec3 x = p - s + dot(s, vec3(G3));

            vec3 e = step(vec3(0.0), x - x.yzx);
            vec3 i1 = e*(1.0 - e.zxy);
            vec3 i2 = 1.0 - e.zxy*(1.0 - e);

            vec3 x1 = x - i1 + G3;
            vec3 x2 = x - i2 + 2.0*G3;
            vec3 x3 = x - 1.0 + 3.0*G3;

            vec4 w, d;

            w.x = dot(x, x);
            w.y = dot(x1, x1);
            w.z = dot(x2, x2);
            w.w = dot(x3, x3);

            w = max(0.6 - w, 0.0);

            d.x = dot(random3(s), x);
            d.y = dot(random3(s + i1), x1);
            d.z = dot(random3(s + i2), x2);
            d.w = dot(random3(s + 1.0), x3);

            w *= w;
            w *= w;
            d *= w;

            return dot(d, vec4(52.0));
        }



        vec3 hsv2rgb(vec3 c){
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        const float PI = acos(-1.0);
        float map(float v, float v_min, float v_max, float out1, float out2)
        {
            if ( v_max - v_min == 0. )
                return out2;

            return (clamp(v,v_min,v_max) - v_min) / (v_max - v_min) * (out2-out1)+out1;
        }

        float fmod(float t,float a){
        return fract(t/a)*a;
        }

        float angle_diff_grad(float angle1, float angle2)
        {
            float d = abs(angle1 - angle2);
            return d < 180. ? d : 360. - d;
        }

        vec4 tunnel_v2(vec2 uv, float black_hole_distance, float cut_factor) {

            float distance = 2. / length(uv);
            float angle = angle_diff_grad( map( atan(uv.y, uv.x), -PI,PI,0.,360.), 0. );

            if ( distance < black_hole_distance) {
            float normal_distance = map(distance,0.,black_hole_distance,1.,0.);
            float alpha =
                    pow(
                abs( snoise(vec3(angle, map(distance,0.,black_hole_distance,0.,5.) + (u_time + u_speed_up)*1.5, -(u_time + u_speed_up)/4. )))
                ,2.);

                if (alpha > cut_factor)
                {
                alpha = map(alpha, cut_factor, 1.,   0., normal_distance * 4.);
                float color = snoise(vec3(uv.x/1.,uv.y/1., normal_distance + (u_time + u_speed_up)/2.));
                vec3 finalColor = hsv2rgb( vec3( color, normal_distance, alpha ));
                //vec3 finalColor = vec3( noise3( vec3(uv.x*10., uv.y*10., distance) ));
                return vec4( finalColor, 1.0 );
                }
                }
                return vec4(0.,0.,0.,1.0);

        }

        vec4 tunnel_v3(vec2 uv) {
            float far = 2. / length(uv);
            float angle = angle_diff_grad( map( atan(uv.y, uv.x), -PI,PI,0.,360.), sin((u_time + u_speed_up)/2.)*4. );

            if ( far < 25.) {

            float alpha =
                    pow(
                    abs( snoise(vec3(angle, far + (u_time + u_speed_up)*2.,0.)))
                ,16.);

                float color = fmod( (u_time + u_speed_up) / 3.  + far / 25. ,5.);
                float dark  = map(far,0.,25.,1.,0.);
                vec3 finalColor = hsv2rgb( vec3( color, dark, map(alpha,0.,1.,0., 100. * dark ) ));

                return vec4( finalColor, 1.0 );

                }
                return vec4(0.,0.,0.,1.0);
        }

        void main()
        {
            vec2 uv = vUv;

            if (u_active == 0.) {
                gl_FragColor = vec4(0.,0.,0.,0.0);
                return;
            }

            vec4 color = u_warp > 0. ? tunnel_v2(uv, 20., 0.3) : tunnel_v3(uv);
            gl_FragColor = vec4(color.rgb, 0.6);
        }`,
}

export default WarpShader
