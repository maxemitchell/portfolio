import React from 'react'
import SEO from '../../../components/SEO'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

class MissJulia3D extends React.Component {
  componentDidMount() {
    // Constants
    this.MAX_ITERATIONS = 25
    this.MAX_ITERATIONS_ROOT = Math.sqrt(this.MAX_ITERATIONS)
    this.R = 3.0
    this.resolution = 128
    this.randomizeVariables()

    // Basic THREE.js scene and render setup
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.01, 4)
    this.camera.position.set(0, 0.6, 0.6)
    this.camera.up.set(0, 0, 1)
    this.camera.lookAt(0, 1.5, 0)

    this.controls = new OrbitControls(this.camera, this.mount)
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05

    this.dimension = Math.min(window.innerHeight / 1.5, window.innerWidth / 1.5)

    this.clock = new THREE.Clock()

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
    })
    this.renderer.setSize(this.dimension, this.dimension)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.mount.appendChild(this.renderer.domElement)

    // Post Process
    this.RenderTargetClass = null

    if (
      this.renderer.getPixelRatio() === 1 &&
      this.renderer.capabilities.isWebGL2
    ) {
      this.RenderTargetClass = THREE.WebGLMultisampleRenderTarget
    } else {
      this.RenderTargetClass = THREE.WebGLRenderTarget
    }

    this.renderTarget = new this.RenderTargetClass(800, 600, {
      minFilter: THREE.LinearFilter,
      maxFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    })
    // Composer
    this.effectComposer = new EffectComposer(this.renderer, this.renderTarget)
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.effectComposer.setSize(this.dimension, this.dimension)

    // Passes
    this.renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(this.renderPass)

    this.unrealBloomPass = new UnrealBloomPass()
    this.unrealBloomPass.enabled = true
    this.unrealBloomPass.strength = 1.3
    this.unrealBloomPass.radius = 0.15
    this.unrealBloomPass.threshold = 0.6
    this.effectComposer.addPass(this.unrealBloomPass)

    // Initial Plane setup
    this.planeGeometry = new THREE.PlaneGeometry(
      1,
      1,
      this.resolution - 1,
      this.resolution - 1
    )
    this.planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x292929,
      wireframe: this.wireframe,
      metalness: 0.95,
      roughness: 0.35,
    })
    this.plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
    this.scene.add(this.plane)
    this.planePositionAttribute = this.planeGeometry.getAttribute('position')

    // Lights
    this.ambientLight = new THREE.AmbientLight(0xffffff, 10.9)
    this.scene.add(this.ambientLight)

    this.xLight = new THREE.DirectionalLight(0xaf3fd4, 1.2)
    this.xLight.position.set(-2, 0, 0.5)
    this.scene.add(this.xLight)
    const xGeometry = new THREE.SphereGeometry(0.35, 16, 16)
    const xMaterial = new THREE.MeshBasicMaterial({
      color: 0xaf3fd4,
      side: THREE.DoubleSide,
    })
    const xSphere = new THREE.Mesh(xGeometry, xMaterial)
    xSphere.position.set(-2, 0, 0.5)
    xSphere.lookAt(0, 0, 0)
    this.scene.add(xSphere)

    this.yLight = new THREE.DirectionalLight(0x25e84c, 1.2)
    this.yLight.position.set(0, -2, 0.5)
    this.scene.add(this.yLight)
    const yGeometry = new THREE.SphereGeometry(0.35, 16, 16)
    const yMaterial = new THREE.MeshBasicMaterial({
      color: 0x25e84c,
      side: THREE.DoubleSide,
    })
    const ySphere = new THREE.Mesh(yGeometry, yMaterial)
    ySphere.position.set(0, -2, 0.5)
    ySphere.lookAt(0, 0, 0)
    this.scene.add(ySphere)

    this.xyLight = new THREE.DirectionalLight(0xd67d1e, 1.4)
    this.xyLight.position.set(2, 2, 0.25)
    this.scene.add(this.xyLight)
    const xyGeometry = new THREE.SphereGeometry(0.3, 16, 16)
    const xyMaterial = new THREE.MeshBasicMaterial({
      color: 0xd67d1e,
      side: THREE.DoubleSide,
    })
    const xySphere = new THREE.Mesh(xyGeometry, xyMaterial)
    xySphere.position.set(2, 2, 0.25)
    xySphere.lookAt(0, 0, 0)
    this.scene.add(xySphere)

    this.otherLight = new THREE.DirectionalLight(0x1a7d96, 0.4)
    this.otherLight.position.set(-2, -2, 2.25)
    this.scene.add(this.otherLight)
    const otherGeometry = new THREE.SphereGeometry(0.2, 16, 16)
    const otherMaterial = new THREE.MeshBasicMaterial({
      color: 0x1a7d96,
      side: THREE.DoubleSide,
    })
    const otherSphere = new THREE.Mesh(otherGeometry, otherMaterial)
    otherSphere.position.set(-2, -2, 2.25)
    otherSphere.lookAt(0, 0, 0)
    this.scene.add(otherSphere)

    window.addEventListener('resize', this.onWindowResize.bind(this), false)
    window.addEventListener('keydown', this.onKeyDown.bind(this), false)

    this.tick()
  }

  complex_mult(c1, c2) {
    return {
      real: c1.real * c2.real - c1.im * c2.im,
      im: c1.real * c2.im + c1.im * c2.real,
    }
  }

  // Implements f(z) = z^2 + C
  calculateJulia(z_r, z_i, noise_real, noise_im) {
    const R_squared = this.R * this.R
    let z = { real: z_r, im: z_i }

    // Implementing DEM version
    let dz = { real: 1, im: 0 }

    let iteration
    for (iteration = 0; iteration < this.MAX_ITERATIONS; iteration++) {
      if (this.type == 0) {
        // z^2
        dz = this.complex_mult(dz, { real: 2 * z.real, im: 2 * z.im })
        if (z.real * z.real + z.im * z.im > R_squared) {
          break
        }
        z = this.complex_mult(z, z)
        z.real = z.real + this.C_real + noise_real
        z.im = z.im + this.C_im + noise_im
      } else if (this.type == 1) {
        // z^3
        const z2 = this.complex_mult(z, z)
        dz = this.complex_mult(dz, { real: 3 * z2.real, im: 3 * z2.im })
        if (z.real * z.real + z.im * z.im > R_squared) {
          break
        }
        z = this.complex_mult(z, z2)
        z.real = z.real + this.C_real + noise_real
        z.im = z.im + this.C_im + noise_im
      } else {
        // z^4 - z^2
        const z2 = this.complex_mult(z, z)
        const z3 = this.complex_mult(z, z2)
        dz = this.complex_mult(dz, {
          real: 4 * z3.real - 2 * z.real,
          im: 4 * z3.im - 2 * z.im,
        })
        if (z.real * z.real + z.im * z.im > R_squared) {
          break
        }
        z = this.complex_mult(z, z3)
        z.real = z.real - z2.real + this.C_real + noise_real
        z.im = z.im - z2.im + this.C_im + noise_im
      }
    }
    // return distance
    return (
      -Math.sqrt(
        (z.real * z.real + z.im * z.im) / (dz.real * dz.real + dz.im * dz.im)
      ) *
      Math.log(z.real * z.real + z.im * z.im) *
      0.5
    )
  }

  tick() {
    const elapsedTime = this.clock.getElapsedTime()

    // CPU Implementation
    let z_real = -this.R / 2
    let z_delta = this.R / (this.resolution - 1)
    let noise_real =
      Math.cos(elapsedTime * this.noiseTimeScale) * this.noiseScale
    let noise_im = Math.cos(elapsedTime * this.noiseTimeScale) * this.noiseScale

    for (let x = 0; x < this.resolution; x++) {
      let z_im = -this.R / 2
      for (let y = 0; y < this.resolution; y++) {
        const distance = this.calculateJulia(z_real, z_im, noise_real, noise_im)
        this.planePositionAttribute.setZ(
          x * this.resolution + y,
          THREE.MathUtils.clamp(distance, -5, 0.3)
        )
        z_im += z_delta
      }
      z_real += z_delta
    }

    this.planePositionAttribute.needsUpdate = true
    this.planeGeometry.computeVertexNormals()

    // Render
    // this.renderer.render(this.scene, this.camera)
    this.effectComposer.render()

    // Call tick again on the next frame
    this.frameId = window.requestAnimationFrame(this.tick.bind(this))
  }

  onWindowResize() {
    if (this.mount) {
      this.dimension = Math.min(
        window.innerHeight / 1.5,
        window.innerWidth / 1.5
      )
      this.renderer.setSize(this.dimension, this.dimension)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      // Update effect composer
      this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      this.effectComposer.setSize(this.dimension, this.dimension)
    }
  }

  onKeyDown(event) {
    // If Space is pressed
    if (event.keyCode == 32) {
      this.randomizeVariables()
      this.planeMaterial.wireframe = this.wireframe
    }
  }

  randomizeVariables() {
    this.noiseScale = Math.random() * 0.19 + 0.01
    this.noiseTimeScale = Math.random() * 1.5 + 0.5
    this.C_real = Math.random() * 2 - 1
    this.C_im = Math.random() * 2 - 1
    this.type = Math.floor(Math.random() * 3)
    this.wireframe = Math.random() < 0.5
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.frameId)

    window.removeEventListener('resize', this.onWindowResize.bind(this))
    window.removeEventListener('keydown', this.onKeyDown.bind(this))
    this.mount.removeChild(this.renderer.domElement)
  }

  render() {
    return (
      <Layout>
        <SEO
          title="Miss Julia the Third"
          desc="A little 3D Julia Sets Visualization"
        />
        <div className="flex flex-wrap lg:flex-nowrap mt-8 w-full justify-center items-center">
          <div
            className="flex justify-center "
            ref={(ref) => (this.mount = ref)}
          />
          <div className="flex w-full flex-wrap max-w-sm lg:w-1/2 mb-4 lg:mx-6 lg:justify-start">
            <Header variant="1">Miss Julia the Third</Header>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8 mb-4">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                A little 3D Julia Sets Visualization
              </p>
            </div>
            <div className="flex w-full boxshadow-3d-right mt-4 lg:mt-8">
              <p className="w-full text-sm md:text-md lg:text-lg font-extralight font-manrope m-4">
                Please <b>press space</b> to randomize the C values.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

export default MissJulia3D
