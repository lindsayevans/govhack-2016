import 'core-js';
//import {AFRAME} from 'aframevr/aframe';

declare var AFRAME: any;

export function bootstrap() {
    // console.log('Hello from bootstrap.ts!');

    let $coinWrapper = document.querySelector('#coins');

    let coinsMarkup = '';

    coinsMarkup += coinTemplate.replace(/\{id\}/gi, '1').replace(/\{colour}/gi, 'white').replace(/\{x-pos}/gi, '0').replace(/\{start}/gi, '0');
    coinsMarkup += coinTemplate.replace(/\{id}/gi, '2').replace(/\{colour}/gi, 'red').replace(/\{x-pos}/gi, '-4').replace(/\{start}/gi, '500');
    coinsMarkup += coinTemplate.replace(/\{id}/gi, '3').replace(/\{colour}/gi, 'purple').replace(/\{x-pos}/gi, '-8').replace(/\{start}/gi, '750');
    coinsMarkup += coinTemplate.replace(/\{id}/gi, '4').replace(/\{colour}/gi, 'blue').replace(/\{x-pos}/gi, '-12').replace(/\{start}/gi, '900');

    $coinWrapper.innerHTML = coinsMarkup;

    let $coins = Array.from(document.querySelectorAll('.coin')) as Array<Element>;
    $coins.forEach($coin => {
        // console.log($coin);
        $coin.addEventListener('click', highlightCoin);
    });

    // document.querySelector('#bird-entity').addEventListener('click', function () {
    //     // this.setAttribute('scale', '20 20 20');
    //     this.setAttribute('rotation', '0 -90 0');
    //     this.setAttribute('position', '0 0 -5');
    // });

}

function highlightCoin() {

    let $coin = this.querySelector('a-cylinder');
    let $animation = this.querySelector('.movement');
    this.emit('spin');

    $coin.setAttribute('color', 'green');
    // $animation.setAttribute('repeat', '3');

    $animation.setAttribute('repeat', '');
    
    // this.setAttribute('rotation', '0 -90 0');
    // this.setAttribute('scale', '1.5 1 1.5');
}


let coinTemplate = `
    <a-entity class="coin" id="coin-{id}" position="{x-pos} 0 -10">
        <a-cylinder color="{colour}" height="0.1" radius="1.5" rotation="-90 0 0"></a-cylinder>
        <a-animation attribute="rotation"
            begin="spin"
            dur="1000"
            fill="forwards"
            to="180 0 0"
            repeat="0"></a-animation>
        <a-animation class="movement" attribute="position"
            begin="{start}"
            dur="1000"
            fill="forwards"
            to="{x-pos}0 10 -20"
            direction="alternate"
            repeat="indefinite" easing="ease-in-out"></a-animation>
    </a-entity>`;
