if ( WEBGL.isWebGLAvailable() === false ) {
document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}

var orbitControls;
var container, camera, scene, renderer, loader,effect;
var gltf, mixer, gui;

var scenes = {
	KomatsuColor: {
		url: './models/gltf/komatsu.glb',
		cameraPos: new THREE.Vector3( 1, 2, 5),
		objectRotation: new THREE.Euler(0,0,0 ),
		objectPosition: new THREE.Euler(0,0,0),
		objectScale: new THREE.Vector3( 1, 1, 1 ),
		addLights: true,
		shadows: true,
		addGround: true,
		rotate: false,
	},
};

var state = {
	scene: Object.keys( scenes )[ 0 ],
};

function onload() {

	window.addEventListener( 'resize', onWindowResize, false );

	buildGUI();
	initScene( scenes[ state.scene ] );
	animate();

}

function initScene( sceneInfo ) {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    // todo - support pixelRatio in this demo
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 100 );
    camera.position.set( 0, 0, 8 );

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    scene.add( new THREE.AmbientLight( 0xaaaaaa, 0.2 ) );

    const light = new THREE.DirectionalLight( 0xddffdd, 0.6 );
    light.position.set( 1, 1, 1 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    const d = 10;

    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;

    scene.add( light );

    loader = new THREE.GLTFLoader();

				THREE.DRACOLoader.setDecoderPath( 'js/libs/draco/gltf/' );
				loader.setDRACOLoader( new THREE.DRACOLoader() );

				var url = sceneInfo.url;

				var loadStartTime = performance.now();

				loader.load( url, function ( gltf ) {
					
					
					const timer = performance.now();

					var object = gltf.scene;

					console.info( 'Load time: ' + ( performance.now() - loadStartTime ).toFixed( 2 ) + ' ms.' );
					// console.info(performance.now() / 10 + '%');

					if ( sceneInfo.cameraPos  ) {

						camera.position.copy( sceneInfo.cameraPos );

					}

					if ( sceneInfo.center ) {

						orbitControls.target.copy( sceneInfo.center );

					}

					if ( sceneInfo.objectPosition ) {

						object.position.copy( sceneInfo.objectPosition );

						if ( spot1 ) {

							spot1.target.position.copy( sceneInfo.objectPosition );

						}

					}

					if ( sceneInfo.objectRotation ) {

						object.rotation.copy( sceneInfo.objectRotation );

					}

                    
                    if ( sceneInfo.objectPosition ) {

						object.position.copy( sceneInfo.objectPosition );

					}

                    
					if ( sceneInfo.objectScale ) {

						object.scale.copy( sceneInfo.objectScale );

					}

	

					object.traverse( function ( node ) {

						if ( node.isMesh || node.isLight ) node.castShadow = true;

					} );

					

					scene.add( object );
					onWindowResize();

				}, undefined, function ( error ) {

					console.error( error );

				} );

			}

			function animate() {

				requestAnimationFrame( animate );

				const timer = performance.now();

				if ( params.rotate ) {

					group.rotation.y = timer * 0.0001;

				}

				controls.update();

				composer.render();

				

			}
