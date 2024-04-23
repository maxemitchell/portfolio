import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import * as THREE from 'three'
import littleMan from './Little Man Remix (final version i swear).wav'
import StemAnalyzer from './stem_analyzer'
import vertShader from './base.vert'
import sideMeshFrag from './side_mesh.frag'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import LyricAnalyzer from './lyric_analyzer'
import spaceAgeFont from './space_age_font.json'

class LittleManRemix extends React.Component {
    componentDidMount() { 
        this.setupScene();
        this.addLights();
        this.audioSetup();
        this.setupLyrics();

        this.meshes = new THREE.Group();
        this.stems = new THREE.Group();
        this.scene.add(this.meshes);
        this.scene.add(this.stems);

        this.lastNormalizedAverageVolume = 0;

        this.addMesh();
        
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.mount.addEventListener('click', this.onClick.bind(this), false);
        
        this.animate();
    }

    setupScene() {
        // Basic THREE.js scene and render setup
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000)
        this.camera.position.set(0, 0, 300)
        this.camera.lookAt(0, 0, 0)

        this.dimension = Math.min(window.innerHeight / 1.5, window.innerWidth / 1.5)

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.dimension, this.dimension)
        this.renderer.toneMapping = THREE.ReinhardToneMapping
        this.mount.appendChild(this.renderer.domElement)

        this.speed = 1.0;
        this.clock = new THREE.Clock(false);
        this.elapsedTime = 0;

        const renderScene = new RenderPass(this.scene, this.camera);

        const bloomPass = new UnrealBloomPass(new THREE.Vector2(this.dimension, this.dimension), 1.5, 0.4, 0.85);
        bloomPass.threshold = 0.2;
        bloomPass.strength = 0.5;
        bloomPass.radius = 0.05;

        const outputPass = new OutputPass();

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
        this.composer.addPass(outputPass);
    }

    addLights() {
        // Let's light this scene up like it's a TikTok dance challenge!
        const ambientLight = new THREE.AmbientLight(0xb9fffc); // A chill aqua vibe
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00ff00, 1000.2, 300); // Emerald green for that pop of color
        pointLight.position.set(0, 0, 290);
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xff0000, 1000.2, 300);
        pointLight2.position.set(0, 10, 290);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0x0000ff, 1000.2, 300);
        pointLight3.position.set(0, -10, 290);
        this.scene.add(pointLight3);
    }

    addMesh() {
        const geometry = new THREE.PlaneGeometry(200, 300);

        // Function to create a material with a unique seed
        const createMaterialWithSeed = (seed) => new THREE.ShaderMaterial({
            uniforms: {
                u_time: { type: "f", value: 0.0 },
                u_frequency: { type: "f", value: 0.0 },
                u_color0: { type: "vec3", value: new THREE.Color(0x1A202C) }, // Cosmic Latte
                u_color1: { type: "vec3", value: new THREE.Color(0x10B981) }, // Vibrant Emerald
                u_color2: { type: "vec3", value: new THREE.Color(0x7F00FF) }, // Phantom Purple
                u_color3: { type: "vec3", value: new THREE.Color(0x000000) }, // Cosmic Yellow
                u_color4: { type: "vec3", value: new THREE.Color(0x000000) }, // Alien Aqua
                u_seed: { type: "f", value: seed }, // Unique seed for each mesh
            },
            vertexShader: vertShader,
            fragmentShader: sideMeshFrag,
            side: THREE.DoubleSide,
            transparent: true
        });

        // First mesh with a unique seed
        const planeMaterial1 = createMaterialWithSeed(Math.random()* 100);
        const plane1 = new THREE.Mesh(geometry, planeMaterial1);
        plane1.position.set(20, 0, 150);
        plane1.rotation.set(3 * Math.PI / 2, Math.PI / 2, 0);
        this.meshes.add(plane1);

        // Second mesh with a different unique seed
        const planeMaterial2 = createMaterialWithSeed(Math.random()*100);
        const plane2 = new THREE.Mesh(geometry, planeMaterial2);
        plane2.position.set(-20, 0, 150);
        plane2.rotation.set(3 * Math.PI / 2, Math.PI / 2, 0);
        this.meshes.add(plane2);
    }

    audioSetup() {
        // THREE.js audio and sound setup
        const listener = new THREE.AudioListener()
        this.camera.add(listener)
        const sound = new THREE.Audio(listener)
        const audioLoader = new THREE.AudioLoader()
        audioLoader.load(littleMan, function (buffer) {
            sound.setBuffer(buffer)
            sound.setLoop(true)
            sound.setVolume(0.5)
        })

        this.sound = sound;
        this.analyser = new THREE.AudioAnalyser(sound, 256);
        this.stemAnalyzer = new StemAnalyzer();

        this.lyricAnalyzer = new LyricAnalyzer();
    }

    animate() {
        this.frameId = requestAnimationFrame(this.animate.bind(this));
        this.composer.render();
        const delta = this.clock.getDelta();
        const timestamp = this.clock.getElapsedTime();

        // Update shader time uniforms
        this.meshes.children.forEach((mesh) => {
            if (mesh.material.uniforms) {
                // Get the volume from the frequency data
                const frequencyData = this.analyser.getFrequencyData();
                mesh.material.uniforms.u_time.value += delta;
    
                const averageVolume = frequencyData.reduce((acc, val) => acc + val, 0) / frequencyData.length;
                let normalizedAverageVolume = averageVolume / 255.0;
                this.lastNormalizedAverageVolume = (normalizedAverageVolume + 9 * this.lastNormalizedAverageVolume) / 10;
                mesh.material.uniforms.u_frequency.value = this.lastNormalizedAverageVolume;
            }
        });

        // Display current lyric based on the timestamp
        const currentLyric = this.lyricAnalyzer.getNewWord(timestamp);

        if (currentLyric) {
            this.updateLyric(currentLyric);
        }

        if (this.stemAnalyzer.isNewBeat(timestamp, 'bass')) {
            this.addBass();
        }

        if (this.stemAnalyzer.isNewBeat(timestamp, 'kick')) {
            this.addKick();
        }

        if (this.stemAnalyzer.isNewBeat(timestamp, 'snare')) {
            this.addSnare();
        }

        this.moveObjects(delta);
    }

    setupLyrics() {
        const loader = new FontLoader();
        this.font = loader.parse(spaceAgeFont);
        this.lyrics = new THREE.Group();
        this.scene.add(this.lyrics);
    }

    updateLyric(lyric) {
        if (!this.font) return;

        const geometry = new TextGeometry(lyric, {
            font: this.font,
            size: 32,
            depth: 2,
        });

        geometry.computeBoundingBox();
        const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
        geometry.translate(xMid, 0, 0);

        const rainbowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
        });
        const lyricMesh = new THREE.Mesh(geometry, rainbowMaterial);
        lyricMesh.position.set(0, (Math.random() - 0.5) * 20, 200);
        lyricMesh.scale.set(0.1, 0.1, 0.1);
        lyricMesh.lookAt(lyricMesh.position.x, lyricMesh.position.y, 300);

        this.lyrics.add(lyricMesh);
    }

    moveObjects(delta) {
        this.stems.children.forEach(item => {
            item.translateZ(delta * this.speed * 100);
        });

        this.lyrics.children.forEach(item => {
            item.translateZ(delta * this.speed * 100);
        });

        this.stems.children = this.stems.children.filter(item => {
            return item.position.z < 300;
        });
    }
    
    addBass() { 
        const streakGeometry = new THREE.BoxGeometry(1, 1, 10);
        const streakMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`), 
            emissive: new THREE.Color(`hsl(${Math.random() * 360}, 100%, 50%)`),
            specular: new THREE.Color(0x333333),
            shininess: 100,
            transparent: true, 
            opacity: 0.8 
        });

        const streak = new THREE.Mesh(streakGeometry, streakMaterial);

        streak.position.set(
            (Math.random() - 0.5) * 20,
            -50 + (Math.random() - 0.5) * 10,
            100
        );

        this.stems.add(streak);
    }

    addKick() {
        const kickGeometry = new THREE.SphereGeometry(2, 4, 4);
        const kickMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700, // Golden color to resemble the sun
            emissive: 0xFFA500, // Slightly orange glow to give it a fiery look
        });
        const kick = new THREE.Mesh(kickGeometry, kickMaterial);
        kick.position.set(
            (Math.random() - 0.5) * 20,
            100 + (Math.random() - 0.5) * 10,
            0
        );

        this.stems.add(kick);
    }

    addSnare() {
        // Snare hits are sharp, so let's give it a geometry that pops but keep the vibe similar to the kick
        const snareGeometry = new THREE.SphereGeometry(2, 4, 4);
        const snareMaterial = new THREE.MeshStandardMaterial({
            color: 0x4FD1C5, // A different, yet vibrant color to distinguish from the kick
            emissive: 0x38B2AC, // A cool glow to add some snare-specific flair
        });
        const snare = new THREE.Mesh(snareGeometry, snareMaterial);
        // Position the snare to visually complement the kick, creating a balanced scene
        snare.position.set(
            (Math.random() - 0.5) * 20, // Align X position with kick for visual harmony
            100 + (Math.random() - 0.5) * 10,
            0
        );
        this.stems.add(snare);
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
            this.elapsedTime = this.clock.elapsedTime
            this.clock.stop()
        }else{
            this.clock.start()
            this.clock.elapsedTime = this.elapsedTime
            this.sound.play()
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.frameId)
        if(this.sound && this.sound.isPlaying){
            this.sound.stop()
        }
        
        window.removeEventListener('resize', this.onWindowResize.bind(this))
        this.mount.removeEventListener('click', this.onClick.bind(this))
        this.mount.removeChild(this.renderer.domElement)
    }

    render() {
        return (
            <Layout>
                <SEO title="Code Art" />
                <div className="flex flex-wrap lg:flex-nowrap mt-8 w-full justify-center items-center">
                    {/* The actual canvas for three.js */}
                    <div
                        className="flex justify-center w-full"
                        ref={ref => (this.mount = ref)}
                    />
                    {/* <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
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
                    </div> */}
                </div>
            </Layout>
        )
    }
}

export default LittleManRemix
