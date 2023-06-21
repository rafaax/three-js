import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ViewHelper } from 'three/addons/helpers/ViewHelper.js';

let mesh, renderer, scene, camera, controls, helper, clock;

init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.autoClear = false;
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set( 20, 20, 20 );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    
    // clock
    clock = new THREE.Clock();
    
    // ambient
    scene.add( new THREE.AmbientLight( 0x222222 ) );
    
    // light
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 20,20, 0 );
    scene.add( light );
    
    // axes
    scene.add( new THREE.AxesHelper( 20 ) );

    // geometry
    const geometry = new THREE.SphereGeometry( 5, 12, 8 );
    
    // material
    const material = new THREE.MeshPhongMaterial( {
        color: 0x00ffff, 
        flatShading: true,
        transparent: true,
        opacity: 0.7,
    } );
    
    // mesh
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    
    
    // helper
    helper = new ViewHelper( camera, renderer.domElement );
    helper.controls = controls;
    helper.controls.center = controls.target;
    
    const div = document.createElement( 'div' );
    div.id = 'viewHelper';
    div.style.position = 'absolute';
    div.style.right = 0;
    div.style.bottom = 0;
    div.style.height = '128px';
    div.style.width = '128px';
    
    document.body.appendChild( div );
    
    div.addEventListener( 'pointerup', (event) => helper.handleClick( event ) );

}

function animate() {

    requestAnimationFrame( animate );
    
    const delta = clock.getDelta();
    
    if ( helper.animating ) helper.update( delta );
    
    renderer.clear();
    
    renderer.render( scene, camera );
    
   	helper.render( renderer );

}