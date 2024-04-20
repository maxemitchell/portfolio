import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import * as THREE from 'three'
import littleMan from './Little Man Remix (final version i swear).wav'
// import BeatDetector from './beat_detector'
import StemAnalyzer from './stem_analyzer'

class LittleManRemix extends React.Component {
    componentDidMount() { 
        // Basic THREE.js scene and render setup
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
        this.camera.position.set(0,0,300)
        this.camera.lookAt(0,0,0)
    
        // Adding some funky light sources to jazz up the scene
        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(0, 1, 0);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0x00ff00, 1, 100);
        pointLight.position.set(50, 50, 50);
        this.scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xff0000, 1);
        spotLight.position.set(-100, 100, 100);
        this.scene.add(spotLight);
        
        this.dimension = Math.min(window.innerHeight / 1.5, window.innerWidth / 1.5)
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.dimension, this.dimension)
        this.mount.appendChild(this.renderer.domElement)
        
        // THREE.js audio and sound setup
        const listener = new THREE.AudioListener()
        this.camera.add(listener)
        const sound = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load(littleMan, function(buffer) {
            sound.setBuffer( buffer )
            sound.setLoop(true)
            sound.setVolume(0.5)
        })

        this.sound = sound;
        // this.analyser = new THREE.AudioAnalyser(sound, 1024);
        // this.beatDetector = new BeatDetector(this.analyser, this.sound);
        this.stemAnalyzer = new StemAnalyzer();

        // Object setup
        this.spheres = new THREE.Group();
        this.stems = new THREE.Group();
        this.scene.add(this.stems);
        this.scene.add(this.spheres);

        this.speed = 1.0;
        this.clock = new THREE.Clock();
        
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.mount.addEventListener('click', this.onClick.bind(this), false);
        // document.addEventListener('keydown', this.onKeyPress.bind(this), false); // Added keydown event listener
        
        this.animate();
    }

    animate() {
        this.frameId = requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
        
        // const beatDetectionResult = this.beatDetector.detectBeats();
        // this.updateDebugSquaresVisibility(beatDetectionResult);

        const delta = this.clock.getDelta();
        const timestamp = this.sound.context.currentTime;

        if (this.stemAnalyzer.isNewBeat(timestamp, 'bass')) {
            this.addBass();
        }

        if (this.stemAnalyzer.isNewBeat(timestamp, 'kick')) {
            this.addKick();
        }

        if (this.stemAnalyzer.isNewBeat(timestamp, 'snare')) {
            this.addSnare();
        }
        
        if (this.stemAnalyzer.isNewBeat(timestamp, 'vocals')) {
            this.addVocals();
        }

        // this.addSphere(beatDetectionResult);
        this.moveObjects(delta);
    }

    moveObjects(delta) {
        this.stems.children.forEach(item => {
            item.translateZ(delta * this.speed * 100);
            // Dynamic scaling based on beat detection could be added here
        });

        // Remove items that are past the camera
        this.stems.children = this.stems.children.filter(item => {
            return item.position.z < 300;
        });
    }
    
    addBass() { 
        const bassGeometry = new THREE.TorusKnotGeometry(3, 1, 100, 16);
        const bassMaterial = new THREE.MeshPhongMaterial({ color: 0x2F855A, shininess: 100 });
        const bass = new THREE.Mesh(bassGeometry, bassMaterial);
        bass.position.set(
            Math.random() > 0.5 ? (Math.random() - 0.5) * 5 + 15 : (Math.random() - 0.5) * 5 - 15,
            -30 + (Math.random() - 0.5) * 10,
            0
        );
        this.stems.add(bass);
    }

    addKick() {
        const kickGeometry = new THREE.CylinderGeometry(2, 2, 10, 32);
        const kickMaterial = new THREE.MeshBasicMaterial({ color: 0x38B2AC });
        const kick = new THREE.Mesh(kickGeometry, kickMaterial);
        // Adjust kick position to be slightly off-center to complement the snare
        kick.position.set(
            -15 +(Math.random() - 0.5) * 10,
            30 + (Math.random() - 0.5) * 10,
            0
        );
        this.stems.add(kick);
    }

    addSnare() {
        // Snare hits feel sharp and crisp, so let's use a geometry that reflects that
        const snareGeometry = new THREE.OctahedronGeometry(1.5, 0);
        const snareMaterial = new THREE.MeshStandardMaterial({ color: 0x38B2AC, flatShading: true });
        const snare = new THREE.Mesh(snareGeometry, snareMaterial);
        // Position the snare to visually complement the kick, creating a balanced scene
        snare.position.set(
            15 + (Math.random() - 0.5) * 10, // Align X position with kick for visual harmony
            30 + (Math.random() - 0.5) * 10,
            0
        );
        this.stems.add(snare);
    }

    addVocals() {
        // Vocals are often the soul of the track, so let's represent them with something ethereal
        const vocalsGeometry = new THREE.TetrahedronGeometry(2, 0);
        const vocalsMaterial = new THREE.MeshStandardMaterial({ color: 0x48BB78, emissive: 0x2F855A, flatShading: true });
        const vocals = new THREE.Mesh(vocalsGeometry, vocalsMaterial);
        // Randomly position the vocals to float above the scene, like the echoing of a voice
        vocals.position.set(
            (Math.random() - 0.5) * 30, // Spread across the X-axis
            (Math.random() - 0.5) * 10, // Float above everything else
            0
        );
        this.stems.add(vocals);
    }


    addSphere(beatDetectionResult) {
        const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x2F855A });

        // Enhanced sphere creation based on beat detection with categorized positioning
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.z = 0; // Keep this constant for all spheres

        // Position spheres based on beat detection category
        if (beatDetectionResult.lowMidrangeBeat || beatDetectionResult.midrangeBeat) {
            // Lower area for bass-related beats
            sphere.position.y = -30 + (Math.random() - 0.5) * 5;
            sphere.position.x = Math.random() > 0.5 ? (Math.random() - 0.5) * 5 + 10 : (Math.random() - 0.5) * 5 - 10;
            this.spheres.add(sphere);
        } else if (beatDetectionResult.upperMidrangeBeat) {
            // Middle area for midrange beats
            sphere.position.y = (Math.random() - 0.5) * 5;
            sphere.position.x = Math.random() > 0.5 ? (Math.random() - 0.5) * 5 + 10 : (Math.random() - 0.5) * 5 - 10;
            this.spheres.add(sphere);
        } else if (beatDetectionResult.presenceBeat || beatDetectionResult.brillianceBeat) {
            // Upper area for higher frequency beats
            sphere.position.y = 30 + (Math.random() - 0.5) * 5;
            sphere.position.x = Math.random() > 0.5 ? (Math.random() - 0.5) * 5 + 10 : (Math.random() - 0.5) * 5 - 10;
            this.spheres.add(sphere);
        }
    }

    onWindowResize() {
        if (this.mount) {
            this.dimension = Math.min(window.innerHeight / 1.5, window.innerWidth / 1.5)
            this.renderer.setSize(this.dimension, this.dimension)
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        }
    }

    onClick() {
        if(this.sound.isPlaying) {
            this.sound.pause()
        }else{
            this.sound.play()
        }
    }

    onKeyPress(event) { // New method to handle key press
        if (event.key === 'd' || event.key === 'D') {
            console.log('Current Beat Detector State:', this.beatDetector);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId)
        if(this.sound && this.sound.isPlaying){
            this.sound.stop()
        }
        
        window.removeEventListener('resize', this.onWindowResize.bind(this))
        this.mount.removeEventListener('click', this.onClick.bind(this))
        document.removeEventListener('keydown', this.onKeyPress.bind(this)) // Remove keydown event listener
        this.mount.removeChild(this.renderer.domElement)
    }

    render() {
        return (
            <Layout>
                <SEO title="Code Art" />
                <div className="flex flex-wrap lg:flex-nowrap mt-8 w-full justify-center items-center">
                    {/* The actual canvas for three.js */}
                    <div
                        className="flex justify-center "
                        ref={ref => (this.mount = ref)}
                    />
                    <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
                        <Header variant="1">Little Man Remix</Header>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4">
                            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                                Inspired by 2001: A Space Odyssey's 'Beyond the Infinite' scene, I created this music visualizer using{' '}
                                <a
                                    href="https://threejs.org/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    three.js
                                </a>. The song featured is a remix my friend{' '}
                                <a
                                    href="https://www.instagram.com/kwillmusic/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeBlue hover:text-themeRed duration-500"
                                >
                                    Keiran Willig
                                </a>
                                . I also released a{' '}
                                <a
                                    href="https://www.youtube.com/watch?v=_yXQayoxJOg"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline text-themeRed hover:text-themeBlue duration-500"
                                >
                                    YouTube video{' '}
                                </a>
                                documenting my creation process.
                            </p>
                        </div>
                        <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
                            <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                                Please <b>click</b> on the visualization to start/stop the song.
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default LittleManRemix
