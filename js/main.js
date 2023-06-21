            if ( WEBGL.isWebGLAvailable() === false ) {
				document.body.appendChild( WEBGL.getWebGLErrorMessage() );
			}
            
			var orbitControls;
			var container, camera, scene, renderer, loader,effect;
			var gltf, mixer, gui;
			
			var scenes = {
				Komatsu: {
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
				Komatsu2: {
					url: './models/gltf/komatsu2.glb',
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

				container = document.getElementById( 'container' );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0x222222 );

				camera = new THREE.PerspectiveCamera( 35, container.offsetWidth / container.offsetHeight, 0.001, 1000 );
				camera.position.set( 0, 0, 8 );
				scene.add( camera );
                
                

				var spot1;
				var spot2;

				if ( sceneInfo.addLights ) {

					var ambient = new THREE.AmbientLight( 0xFFFFF );
					scene.add( ambient );

					// var directionalLight = new THREE.DirectionalLight( 0xdddddd, 1 );
					// directionalLight.position.set( 0, 0, 0 ).normalize();
					// scene.add( directionalLight );

					spot1 = new THREE.SpotLight( 0xffffff, 1 );
					spot1.position.set( 5, 10, 5 );
					spot1.angle = 0.50;
					spot1.penumbra = 0.75;
					spot1.intensity = 100;
					spot1.decay = 2;

					spot2 = new THREE.SpotLight( 0xffffff, 1 );
					spot2.position.set( -5, -10, -5 );
					spot2.angle = 0.50;
					spot2.penumbra = 0.75;
					spot2.intensity = 100;
					spot2.decay = 2;

					// if ( sceneInfo.shadows ) {

					// 	spot1.castShadow = true;
					// 	spot1.shadow.bias = 0.0001;
					// 	spot1.shadow.mapSize.width = 2048;
					// 	spot1.shadow.mapSize.height = 2048;

					// }

					scene.add( spot1 );
					scene.add( spot2 ); // adicionar segunda luz para iluminar o outro lado da peça

				}

				// RENDERER

				// TODO: Reuse existing WebGLRenderer, GLTFLoaders, and so on

				const axesHelper = new THREE.AxesHelper( 3 );
				scene.add( axesHelper );
				
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.gammaOutput = true;
				renderer.physicallyCorrectLights = true;

                // var helper = new THREE.GridHelper( 1200, 60, 0xFF4444, 0x404040 );
				// this.scene.add( helper );
                
				// if ( sceneInfo.shadows ) {

				// 	renderer.shadowMap.enabled = true;
				// 	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

				// }

				container.appendChild( renderer.domElement );

				orbitControls = new THREE.OrbitControls( camera, renderer.domElement );

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

			function onWindowResize() {

				camera.aspect = container.offsetWidth / container.offsetHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				orbitControls.update();

				render();

			}

			function render() {

				renderer.render( scene, camera );

			}

			function buildGUI() {

				gui = new dat.GUI( { width: 200 } );
				gui.domElement.parentElement.style.zIndex = 101;

				var sceneCtrl = gui.add( state, 'scene', Object.keys( scenes ) );
				sceneCtrl.onChange( reload );

				var sceneInfo = scenes[ state.scene ];
				console.log(sceneInfo.rotate);

				updateGUI();

			}
			function updateGUI() {

				var sceneInfo = scenes[ state.scene ];
				console.log(sceneInfo);
				console.log(sceneInfo.rotate);
			}

			function reload() {

				if ( container && renderer ) {

					container.removeChild( renderer.domElement );

				}

				if ( loader && mixer ) mixer.stopAllAction();

				updateGUI();
				initScene( scenes[ state.scene ] );

			}

			onload();