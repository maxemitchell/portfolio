import { DoubleSide } from 'three';

const WhirlShader = {
    name: 'WhirlShader',

    uniforms: {
        'tDiffuse': { value: null },
        u_time: { type: "f", value: 0.0 },
        u_strength: { type: "f", value: 0.0 },
    },

    // From https://www.shadertoy.com/view/MsK3WW
    vertexShader: /* glsl */`
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,

    fragmentShader: /* glsl */`
        uniform float u_time;
        uniform float u_strength;
        uniform sampler2D tDiffuse;

        varying vec2 vUv;

        void main(){
            // Normalised pixel position
            vec2 uv = vUv;

            // Amount to offset a row by
            float rowOffsetMagnitude = sin(u_time*10.0) * 0.01;

            // Determine the row the pixel belongs too
            float row = floor(uv.y/0.001);
            // Offset Pixel according to its row
            uv.x +=  sin(row/100.0)*rowOffsetMagnitude;

            gl_FragColor = mix(texture(tDiffuse, vUv), texture(tDiffuse, uv), u_strength);
            // gl_FragColor = texture(tDiffuse, vUv);

    }`
};

export default WhirlShader;
