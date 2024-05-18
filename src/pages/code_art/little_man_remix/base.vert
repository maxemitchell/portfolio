varying vec2 vUv;

void main() {
    vUv = position.xy* 0.01;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}