import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import * as THREE from 'three'
import littleMan from './little_man_remix.m4a'
import StemAnalyzer from '../../../helpers/stem_analyzer'
import WarpShader from '../../../shaders/WarpShader'
import WhirlShader from '../../../shaders/WhirlShader'
import GlitchShader from '../../../shaders/GlitchShader'
import HyperspaceShader from '../../../shaders/HyperspaceShader'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import LyricAnalyzer from '../../../helpers/lyric_analyzer'
import cocogooseFont from './CocogooseProTrial Darkmode_Regular.json'

class LittleManRemix extends React.Component {
  componentDidMount() {
    this.setupScene()
    this.addLights()
    this.audioSetup()
    this.setupLyrics()

    this.meshes = new THREE.Group()
    this.rays = new THREE.Group()
    this.kicks = new THREE.Group()
    this.snares = new THREE.Group()
    this.scene.add(this.meshes)
    this.scene.add(this.rays)
    this.scene.add(this.kicks)
    this.scene.add(this.snares)

    this.intro_speed_up = 0.0

    this.addMesh()

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    this.mount.addEventListener('click', this.onClick.bind(this), false)

    this.animate()
  }

  setupScene() {
    // Basic THREE.js scene and render setup
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000)
    this.camera.position.set(0, 0, 300)
    this.camera.lookAt(0, 0, 0)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.dimension = Math.min(window.innerHeight / 1.3, window.innerWidth / 1.3)
    this.renderer.setSize(this.dimension, this.dimension)
    this.renderer.toneMapping = THREE.ReinhardToneMapping
    this.mount.appendChild(this.renderer.domElement)

    this.speed = 1.0
    this.clock = new THREE.Clock(false)
    this.elapsedTime = 0

    const renderScene = new RenderPass(this.scene, this.camera)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.dimension, this.dimension),
      1.5,
      0.4,
      0.85
    )
    bloomPass.threshold = 0.37
    bloomPass.strength = 0.18
    bloomPass.radius = 0.05

    this.glitchPass = new ShaderPass(GlitchShader)
    this.whirlPass = new ShaderPass(WhirlShader)

    const outputPass = new OutputPass()

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(renderScene)
    this.composer.addPass(bloomPass)
    this.composer.addPass(this.whirlPass)
    this.composer.addPass(this.glitchPass)
    this.composer.addPass(outputPass)
  }

  addLights() {
    // Let's light this scene up like it's a TikTok dance challenge!
    const ambientLight = new THREE.AmbientLight(0xb9fffc) // A chill aqua vibe
    this.scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00ff00, 1000.2, 300) // Emerald green for that pop of color
    pointLight.position.set(0, 0, 290)
    this.scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0xff0000, 1000.2, 300)
    pointLight2.position.set(0, 10, 290)
    this.scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0x0000ff, 1000.2, 300)
    pointLight3.position.set(0, -10, 290)
    this.scene.add(pointLight3)
  }

  addMesh() {
    const hyperspaceGeometry = new THREE.PlaneGeometry(600, 600)
    this.hyperspaceMaterial = new THREE.ShaderMaterial(HyperspaceShader)
    const hyperspaceMesh = new THREE.Mesh(
      hyperspaceGeometry,
      this.hyperspaceMaterial
    )
    hyperspaceMesh.position.set(0, 0, 0)
    this.meshes.add(hyperspaceMesh)

    const warpGeometry = new THREE.PlaneGeometry(600, 600)
    this.warpMaterial = new THREE.ShaderMaterial(WarpShader)
    const warpMesh = new THREE.Mesh(warpGeometry, this.warpMaterial)
    warpMesh.position.set(0, 0, 0)
    this.meshes.add(warpMesh)
  }

  audioSetup() {
    // THREE.js audio and sound setup
    const listener = new THREE.AudioListener()
    this.camera.add(listener)
    const sound = new THREE.Audio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load(littleMan, function (buffer) {
      sound.setBuffer(buffer)
      sound.setLoop(false)
      sound.setVolume(0.5)
    })

    this.sound = sound
    this.analyser = new THREE.AudioAnalyser(sound, 256)
    this.stemAnalyzer = new StemAnalyzer()

    this.lyricAnalyzer = new LyricAnalyzer()
  }

  animate() {
    this.frameId = requestAnimationFrame(this.animate.bind(this))
    this.composer.render()
    const delta = this.clock.getDelta()
    let timestamp = this.clock.getElapsedTime()

    this.glitchPass.uniforms.u_time.value += delta
    this.whirlPass.uniforms.u_time.value += delta

    // Update shader time uniforms
    this.meshes.children.forEach((mesh) => {
      mesh.material.uniforms.u_time.value += delta

      if (mesh.material.uniforms.u_speed_up) {
        this.intro_speed_up += this.intro_acceleration || 0.0
        mesh.material.uniforms.u_speed_up.value += this.intro_speed_up
      }

      if (mesh.material.uniforms.u_activate) {
        mesh.material.uniforms.u_activate.value *= 0.99
      }
    })

    const currentLyric = this.lyricAnalyzer.getNewWord(timestamp)

    if (currentLyric) {
      this.updateLyric(currentLyric.toUpperCase())
    }

    ;[
      'kick',
      'snare',
      'ethereal_noise',
      'hyperspace',
      'intro',
      'main_bell',
      'glitch',
      'minor_glitch',
      'whirl',
    ].forEach((beat) => {
      if (this.stemAnalyzer.isNewBeat(timestamp, beat)) {
        this[`add${beat.charAt(0).toUpperCase() + beat.slice(1)}`]()
      }
    })

    this.moveObjects(delta)
  }

  setupLyrics() {
    const loader = new FontLoader()
    this.font = loader.parse(cocogooseFont)
    this.lyrics = new THREE.Group()
    this.scene.add(this.lyrics)
  }

  updateLyric(lyric) {
    if (!this.font) return

    const geometry = new TextGeometry(lyric, {
      font: this.font,
      size: 64,
      depth: 5,
    })

    geometry.computeBoundingBox()
    const xMid =
      -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    geometry.translate(xMid, 0, 0)
    const color =
      lyric.toLowerCase() === 'gold'
        ? 0xffd700
        : lyric.toLowerCase() === 'green'
        ? 0x00ff00
        : lyric.toLowerCase() === 'blues'
        ? 0x0000ff
        : 0xffffff
    const rainbowMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 1.0,
    })
    const lyricMesh = new THREE.Mesh(geometry, rainbowMaterial)

    let zPosition
    do {
      zPosition = 290 + (Math.random() - 0.5) * 10
    } while (
      (this.lastLyricZ !== undefined &&
        Math.abs(zPosition - this.lastLyricZ) <= 2.5) ||
      (this.secondLastLyricZ !== undefined &&
        Math.abs(zPosition - this.secondLastLyricZ) <= 2.5)
    )

    lyricMesh.position.set((Math.random() - 0.65) * 7, -2, zPosition)

    lyricMesh.scale.set(0.015, 0.015, 0.015)
    lyricMesh.rotation.set(-Math.PI / 3, 0, 0) // Rotate the mesh 45 degrees on X and Y axes
    this.lyrics.add(lyricMesh)

    this.secondLastLyricZ = this.lastLyricZ
    this.lastLyricZ = zPosition
  }

  moveObjects(delta) {
    ;['lyrics'].forEach((group) => {
      this[group].children.forEach((item) => {
        item.translateX(delta * (Math.random() - 0.5) * 1) // Randomly move the lyric horizontally
        item.translateY(delta * (Math.random() - 0.5) * 1) // Randomly move the lyric horizontally
        item.translateZ(delta * (Math.random() - 0.5) * 1)
        item.material.opacity -= delta * 1 // Slowly decrease opacity
        item.material.opacity = Math.max(item.material.opacity, 0) // Ensure opacity doesn't go below 0
      })
    })

    // Filter out fully transparent lyrics
    this.lyrics.children = this.lyrics.children.filter(
      (item) => item.material.opacity > 0
    )
    ;['kicks', 'snares'].forEach((group) => {
      this[group].children.forEach((item) => {
        item.translateZ(delta * this.speed * 200)
      })
    })
    ;['kicks', 'snares'].forEach((groupName) => {
      this[groupName].children = this[groupName].children.filter(
        (item) => item.position.z < 300
      )
    })

    this.rays.children.forEach((ray) => {
      ray.translateZ(delta * this.speed * 200)
    })

    this.rays.children = this.rays.children.filter(
      (ray) => ray.position.z < 600
    )
  }

  addKick() {
    const kickGeometry = new THREE.BoxGeometry(10, 4, 0.1)
    const kickMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500, // OrangeRed for a fiery kick
      emissive: 0xffd700, // Gold glow to enhance the kick's visual impact
    })
    const kick = new THREE.Mesh(kickGeometry, kickMaterial)
    kick.position.set((Math.random() - 0.5) * 5, -3.0, 180)
    kick.rotation.set(Math.PI / 2, 0, 0)

    // Create a group to handle the snare's rotation and translation separately
    const kickGroup = new THREE.Group()
    kickGroup.add(kick)

    this.kicks.add(kickGroup)
  }

  addSnare() {
    const snareGeometry = new THREE.BoxGeometry(4, 30, 0.1)
    const snareMaterial = new THREE.MeshStandardMaterial({
      color: 0x4fd1c5, // A different, yet vibrant color to distinguish from the kick
      emissive: 0x38b2ac, // A cool glow to add some snare-specific flair
    })
    const snare = new THREE.Mesh(snareGeometry, snareMaterial)
    snare.position.set((Math.random() - 0.5) * 5, 3.0, 180)
    snare.rotation.set(Math.PI / 2, 0, 0)

    // Create a group to handle the snare's rotation and translation separately
    const snareGroup = new THREE.Group()
    snareGroup.add(snare)

    this.snares.add(snareGroup)
  }

  addEthereal_noise() {
    const etherealNoiseGeometry = new THREE.BoxGeometry(10, 300, 0.1)
    const etherealNoiseMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e90ff, // DodgerBlue for a cool space ray effect
      emissive: 0x00bfff, // DeepSkyBlue glow to enhance the space ray effect
    })
    const etherealNoise = new THREE.Mesh(
      etherealNoiseGeometry,
      etherealNoiseMaterial
    )
    const etherealNoise2 = new THREE.Mesh(
      etherealNoiseGeometry,
      etherealNoiseMaterial
    )

    // Alternating x positions between -10, 0, and 10
    if (!this.etherealNoiseCounter) {
      this.etherealNoiseCounter = 0
    }
    const xPositions = [-15, 0, 15]
    const xPos = xPositions[this.etherealNoiseCounter % xPositions.length]
    this.etherealNoiseCounter++

    etherealNoise.position.set(xPos, -3.3, 0)
    etherealNoise2.position.set(xPos, 3.3, 0)
    etherealNoise.rotation.set(Math.PI / 2, 0, 0)
    etherealNoise2.rotation.set(Math.PI / 2, 0, 0)
    const etherealNoiseGroup = new THREE.Group()
    etherealNoiseGroup.add(etherealNoise)
    etherealNoiseGroup.add(etherealNoise2)
    this.rays.add(etherealNoiseGroup)
  }

  addIntro() {
    this.intro_acceleration = 0.0007
    this.intro_speed_up = 0.0
    this.warpMaterial.uniforms.u_active.value = 1.0

    if (this.intro_started) {
      this.warpMaterial.uniforms.u_warp.value = 0.0
      this.intro_acceleration = 0.0
    }

    this.intro_started = true
  }

  addHyperspace() {
    this.hyperspaceMaterial.uniforms.u_activate.value = 1.0
  }

  addGlitch() {
    if (this.glitchPass.uniforms.u_strength.value < 0.1) {
      this.glitchPass.uniforms.u_strength.value = 1.0
    } else {
      this.glitchPass.uniforms.u_strength.value = 0.0
    }
  }

  addWhirl() {
    if (this.whirlPass.uniforms.u_strength.value < 0.1) {
      this.whirlPass.uniforms.u_strength.value = 1.0
    } else {
      this.whirlPass.uniforms.u_strength.value = 0.0
    }
  }

  addMinor_glitch() {
    if (this.glitchPass.uniforms.u_strength.value < 0.1) {
      this.glitchPass.uniforms.u_strength.value = 0.2
    } else {
      this.glitchPass.uniforms.u_strength.value = 0.0
    }
  }

  addMain_bell() {
    const bellGeometry = new THREE.BoxGeometry(3, 300, 0.1)
    const bellMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6347, // Tomato color for a fiery space ray effect
      emissive: 0xff4500, // OrangeRed glow to enhance the fiery space ray effect
    })
    const bellNoise = new THREE.Mesh(bellGeometry, bellMaterial)

    bellNoise.position.set(
      (Math.random() - 0.5) * 30,
      3.3 * (Math.random() > 0.5 ? 1 : -1),
      0
    )
    bellNoise.rotation.set(Math.PI / 2, 0, 0)
    const bellNoiseGroup = new THREE.Group()
    bellNoiseGroup.add(bellNoise)
    this.rays.add(bellNoiseGroup)
  }

  onWindowResize() {
    if (this.mount) {
      this.dimension = Math.min(
        window.innerHeight / 1.3,
        window.innerWidth / 1.3
      )
      this.renderer.setSize(this.dimension, this.dimension)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio))
    }
  }

  onClick() {
    if (this.sound.isPlaying) {
      this.sound.pause()
      this.elapsedTime = this.clock.elapsedTime
      this.clock.stop()
    } else {
      this.clock.start()
      this.clock.elapsedTime = this.elapsedTime
      this.sound.play()
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)
    if (this.sound && this.sound.isPlaying) {
      this.sound.stop()
    }

    window.removeEventListener('resize', this.onWindowResize.bind(this))
    this.mount.removeEventListener('click', this.onClick.bind(this))
    this.mount.removeChild(this.renderer.domElement)
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Little Man (Kir Remix)"
          desc="A music visualizer inspired by 2001: A Space Odyssey's 'Beyond the Infinite' scene."
        />
        <div className="flex flex-wrap lg:flex-nowrap mt-8 w-full justify-center items-center">
          <div
            className="flex justify-center"
            ref={(ref) => (this.mount = ref)}
          />
          <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
            <Header variant="1">Little Man (KiR Remix)</Header>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                Inspired by 2001: A Space Odyssey's 'Beyond the Infinite' scene,
                I created this music visualizer using{' '}
                <a
                  href="https://threejs.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeRed hover:text-themeBlue duration-500"
                >
                  three.js
                </a>
                . The song featured is a remix of Little Man's Little Dragon by
                my friend{' '}
                <a
                  href="https://instagram.com/kirsongs/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeBlue hover:text-themeRed duration-500"
                >
                  KiR{' '}
                </a>
                <a
                  href="https://soundcloud.com/kirsongs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline text-themeRed hover:text-themeBlue duration-500"
                >
                  (his soundcloud)
                </a>
                .
              </p>
            </div>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                Please <b>click</b> on the visualization (to the left) to
                start/stop the song.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default LittleManRemix
