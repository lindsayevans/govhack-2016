import 'core-js';
import 'whatwg-fetch';
//import {AFRAME} from 'aframevr/aframe';

declare var AFRAME: any;
declare var THREE: any;

export function bootstrap() {
    // console.log('Hello from bootstrap.ts!');

    registerShaders();

    let group = 'Mammals';
    let search = 'possum';
    let lat = '-33.889422';
    let lon = '151.174622';
    let radius = 1;

    // let apiUrl = `http://biocache.ala.org.au/ws/explore/group/${group}?lat=${lat}&lon=${lon}`;
    let apiUrl = `http://biocache.ala.org.au/ws/occurrences/search?q=${search}&lat=${lat}&lon=${lon}&radius=${radius}`;
    // let apiUrl = `http://biocache.ala.org.au/ws/explore/groups?lat=${lat}&lon=${lon}`;

    // FIXME: This is failing with an empty request body - try with $.ajax instead
    // fetch(apiUrl, {
    //         mode: 'no-cors'
    //     })
    //     .then(response => {
    //         return response.json();
    //     })
    //     .then(buildCoins)
    //     .catch(response => {
    //         debugger
    //     });

    buildCoins();

    // document.querySelector('#bird-entity').addEventListener('click', function () {
    //     // this.setAttribute('scale', '20 20 20');
    //     this.setAttribute('rotation', '0 -90 0');
    //     this.setAttribute('position', '0 0 -5');
    // });



}

function buildCoins(data) {

    let $coinWrapper = document.querySelector('#coins');
    let coinsMarkup = '';

    // coinsMarkup += coinTemplate.replace(/\{id\}/gi, '1').replace(/\{colour}/gi, 'white').replace(/\{x-pos}/gi, '0').replace(/\{start}/gi, '0');
    // coinsMarkup += coinTemplate.replace(/\{id}/gi, '2').replace(/\{colour}/gi, 'red').replace(/\{x-pos}/gi, '-4').replace(/\{start}/gi, '500');
    // coinsMarkup += coinTemplate.replace(/\{id}/gi, '3').replace(/\{colour}/gi, 'purple').replace(/\{x-pos}/gi, '-8').replace(/\{start}/gi, '750');
    // coinsMarkup += coinTemplate.replace(/\{id}/gi, '4').replace(/\{colour}/gi, 'blue').replace(/\{x-pos}/gi, '-12').replace(/\{start}/gi, '900');

    let rarities = [
        'common',
        'uncommon',
        'rare',
        'epic',
        'legendary'
    ];

    rarities.forEach((item, i) => {
        let xPos = -(i * 4);
        let start = i * 150;
        coinsMarkup += coinTemplate.replace(/\{id\}/gi, i).replace(/\{colour}/gi, getColour(rarities[i])).replace(/\{x-pos}/gi, xPos).replace(/\{start}/gi, start);
    });

    $coinWrapper.innerHTML = coinsMarkup;

    let $coins = Array.from(document.querySelectorAll('.coin')) as Array<Element>;
    $coins.forEach($coin => {
        // console.log($coin);
        $coin.addEventListener('click', highlightCoin);
    });

}

function highlightCoin() {

    if (this.captured) {
        return false;
    }

    let $coin = this.querySelector('a-cylinder');
    let $animation = this.querySelector('.movement');
    let $flash = document.querySelector('#flash');
    let $game = document.querySelector('#game');
    let $coinWrapper = document.querySelector('#coins');
    this.emit('spin');
    $flash.emit('flash');

    $coin.setAttribute('color', 'green');
    // $animation.setAttribute('repeat', '3');

    if ($animation !== undefined) {
        $animation.remove();
    }

    // this.setAttribute('rotation', '0 -90 0');
    // this.setAttribute('scale', '1.5 1 1.5');

    // TOSO: Need to unpause after displaying details & adding to journal
    // $coinWrapper.pause();

    this.captured = true;
}


let coinTemplate = `
    <a-entity Xlook-at="#camera" class="coin" id="coin-{id}" position="{x-pos} 0 -10">
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
            to="{x-pos} 5 -10"
            direction="alternate"
            repeat="indefinite" easing="ease-in-out"></a-animation>
    </a-entity>`;

function getColour(type: string): string {

    // WoW colours:
    // - Grey (Poor)
    // - White (Common)
    // - Green (Uncommon)
    // - Blue (Rare)
    // - Purple (Epic)
    // - Orange (Legendary)

    let colours = {
        'poor': 'grey',
        'common': 'white',
        'uncommon': 'darkgreen',
        'rare': 'blue',
        'epic': 'purple',
        'legendary': 'orange',
    };

    return colours[type];

}

function registerShaders() {
    AFRAME.registerShader('line-dashed', {
        schema: {
            dashSize: { default: 3 },
            lineWidth: { default: 1 }
        },
        /**
         * `init` used to initialize material. Called once.
         */
        init: function (data) {
            this.material = new THREE.LineDashedMaterial(data);
        },
        /**
         * `update` used to update the material. Called on initialization and when data updates.
         */
        update: function (data) {
            this.material.dashsize = data.dashsize;
            this.material.linewidth = data.linewidth;
        }
    });
}
