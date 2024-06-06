import { DoubleSide } from 'three';

const StarsShader = {
    name: 'StarsShader',
    uniforms: {
        u_seed: { type: "f", value: Math.random() },
        u_time: { type: "f", value: 0.0 }
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
        // Star Nest by Pablo Roman Andrioli
        // License: MIT

        #define iterations 18
        #define formuparam 0.5255

        #define volsteps 21
        #define stepsize 0.09

        #define zoom   0.400
        #define tile   0.99
        #define speed  0.001

        #define brightness 0.001
        #define darkmatter 0.500
        #define distfading 0.730
        #define saturation 0.560

        uniform float u_seed; // Added seed for randomness
        uniform float u_time;
        varying vec2 vUv; // Using varying from @base.vert

        void main()
        {
            //get coords and direction
            vec2 uv=vUv;
            vec3 dir=vec3(uv*zoom,1.);
            float time=u_time*speed+.25;

            vec3 from=vec3(u_seed,1.5*u_seed,0.25+0.5*u_seed);
            from+=vec3(0.0,0.0,1.0*time);

            //volumetric rendering
            float s=0.1,fade=1.;
            vec3 v=vec3(0.);
            for (int r=0; r<volsteps; r++) {
                vec3 p=from+s*dir*.5;
                p = abs(vec3(tile)-mod(p,vec3(tile*2.))); // tiling fold
                float pa,a=pa=0.;
                for (int i=0; i<iterations; i++) {
                    p=abs(p)/dot(p,p)-formuparam; // the magic formula
                    a+=abs(length(p)-pa); // absolute sum of average change
                    pa=length(p);
                }
                float dm=max(0.,darkmatter-a*a*.001); //dark matter
                a*=a*a; // add contrast
                if (r>6) fade*=1.-dm; // dark matter, don't render near
                // v+=vec3(dm,dm*.5,0.);
                // v+=fade;
                v+=vec3(s,s*s,s*s*s*s)*a*brightness*fade; // coloring based on distance
                fade*=distfading; // distance fading
                s+=stepsize;
            }
            v=mix(vec3(length(v)),v,saturation); //color adjust
            gl_FragColor = vec4(v*0.01,1.);

        }`

};

export default StarsShader;
