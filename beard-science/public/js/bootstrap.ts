// import {AFRAME} from 'aframevr/aframe';

export function bootstrap() {
    console.log('Hello from bootstrap.ts!');

    // AFRAME.registerShader('hello-world-shader', {
    //     schema: {
    //         color: { type: 'vec3', default: '0.5 0.5 0.5', is: 'uniform' }
    //     },
    //     vertexShader: [
    //         'void main() {',
    //         '  gl_Position = gl_ProjectionMatrix * gl_ModelViewMatrix * gl_Vertex;',
    //         '}'
    //     ].join('\n'),
    //     fragmentShader: [
    //         'uniform vec3 color;',
    //         'void main() {',
    //         '  gl_FragColor = vec4(color, 1.0);',
    //         '}'
    //     ].join('\n')
    // });

    // document.getElementById('bird').setAttribute('material', 'shader: hello-world-shader; color: 0.3 0.3 0.3');

}
