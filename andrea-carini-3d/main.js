/**
 * Andrea Carini - 3D Interactive Portfolio Scene
 * Three.js implementation with glass-morphism cards, animations, and particles
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'postprocessing';
import { RenderPass } from 'postprocessing';
import { EffectPass, BloomEffect } from 'postprocessing';

// ============================================
// PHASE 2: CORE SCENE SETUP
// ============================================

class AndreaCariniScene {
  constructor() {
    // Scene elements
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.bloomEffect = null;
    
    // Cards
    this.mainCard = null;
    this.projectCards = [];
    this.cardGroup = null;
    
    // Particles
    this.ambientParticles = null;
    this.burstParticles = [];
    
    // State
    this.currentState = 'IDLE';
    this.autoOrbitEnabled = true;
    this.orbitAngle = 0;
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    
    // Sizes
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2)
    };
    
    // Colors
    this.colors = {
      background: 0x0a0908,
      gold: 0xc8a06e,
      warmLight: 0xc8a06e
    };
    
    this.init();
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  init() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createBloomComposer();
    this.createLights();
    this.createAmbientParticles();
    this.createCards();
    this.setupEventListeners();
    this.animate();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colors.background);
    this.scene.fog = new THREE.Fog(this.colors.background, 20, 100);
    
    // Add group for all cards
    this.cardGroup = new THREE.Group();
    this.scene.add(this.cardGroup);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      1000
    );
    
    // Initial camera position with 15° tilt
    this.camera.position.set(15, 2, 15);
    this.camera.lookAt(0, 0, 0);
    
    // Add slight tilt
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = THREE.MathUtils.degToRad(15);
    this.camera.rotation.x = THREE.MathUtils.degToRad(-5);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('scene-container');
    container.appendChild(this.renderer.domElement);
  }

  createBloomComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    
    this.bloomEffect = new BloomEffect({
      intensity: 0.4,
      resolutionScale: 0.5,
      kernelSize: THREE.BloomKernelSize.MEDIUM,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.2
    });
    
    this.composer.addPass(new EffectPass(this.camera, this.bloomEffect));
  }

  // ============================================
  // PHASE 3: LIGHTING & ENVIRONMENT
  // ============================================

  createLights() {
    // Ambient light (low intensity, warm tone)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);
    
    // Directional light from top-left (warm gold tint)
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(-20, 30, -10);
    this.directionalLight.castShadow = true;
    this.directionalLight.color.setHex(this.colors.warmLight);
    
    // Configure shadow
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 100;
    this.directionalLight.shadow.camera.left = -50;
    this.directionalLight.shadow.camera.right = 50;
    this.directionalLight.shadow.camera.top = 50;
    this.directionalLight.shadow.camera.bottom = -50;
    
    this.scene.add(this.directionalLight);
    
    // Add a helper for debugging (commented out in production)
    // const lightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
    // this.scene.add(lightHelper);
    
    // Hemisphere light for more natural illumination
    const hemisphereLight = new THREE.HemisphereLight(0xfff5eb, 0x080820, 0.3);
    this.scene.add(hemisphereLight);
  }

  // ============================================
  // PHASE 7: PARTICLE SYSTEMS
  // ============================================

  createAmbientParticles() {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
      
      // Size
      sizes[i] = 0.02 + Math.random() * 0.03;
      
      // Velocity (slow random drifting)
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    
    const material = new THREE.PointsMaterial({
      color: this.colors.gold,
      size: 0.03,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  createBurstParticles(position) {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const lifetimes = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // All start at the same position
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      // Random outward velocity
      const angle = Math.random() * Math.PI * 2;
      const elevation = (Math.random() - 0.5) * Math.PI;
      const speed = 2 + Math.random() * 2;
      
      velocities[i * 3] = Math.cos(angle) * Math.cos(elevation) * speed;
      velocities[i * 3 + 1] = Math.sin(elevation) * speed;
      velocities[i * 3 + 2] = Math.sin(angle) * Math.cos(elevation) * speed;
      
      // Lifetime
      lifetimes[i] = 2.0;
      
      // Size
      sizes[i] = 0.05 + Math.random() * 0.05;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.PointsMaterial({
      color: this.colors.gold,
      size: 0.05,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(geometry, material);
    this.burstParticles.push({
      mesh: particles,
      geometry: geometry,
      material: material,
      time: 0
    });
    this.scene.add(particles);
  }

  updateBurstParticles() {
    this.burstParticles = this.burstParticles.filter(({ mesh, geometry, time }) => {
      const lifetimes = geometry.attributes.lifetime;
      let anyAlive = false;
      
      const positions = geometry.attributes.position.array;
      const velocities = geometry.attributes.velocity.array;
      
      for (let i = 0; i < lifetimes.count; i++) {
        lifetimes.array[i] -= 0.016; // ~60fps
        
        if (lifetimes.array[i] > 0) {
          anyAlive = true;
          // Update position
          positions[i * 3] += velocities[i * 3] * 0.016;
          positions[i * 3 + 1] += velocities[i * 3 + 1] * 0.016;
          positions[i * 3 + 2] += velocities[i * 3 + 2] * 0.016;
          
          // Fade out
          const opacity = lifetimes.array[i];
          mesh.material.opacity = opacity * 0.5 + 0.5;
        }
      }
      
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.lifetime.needsUpdate = true;
      
      return anyAlive;
    });
  }

  // ============================================
  // PHASE 4 & 5: CARDS (Main + Projects)
  // ============================================

  createCards() {
    this.createMainCard();
    this.createProjectCards();
  }

  createMainCard() {
    // Geometry: portrait 3:4 ratio, thin depth
    const width = 3;
    const height = 4;
    const depth = 0.1;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    // Glass-morphism material
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.1,
      envMapIntensity: 0.5,
      side: THREE.DoubleSide
    });
    
    this.mainCard = new THREE.Mesh(geometry, material);
    this.mainCard.position.set(0, 0, 0);
    this.mainCard.name = 'mainCard';
    this.cardGroup.add(this.mainCard);
    
    // Gold edge glow - using emissive material on edges
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: this.colors.gold,
      linewidth: 2,
      transparent: true,
      opacity: 0.8
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    edges.position.copy(this.mainCard.position);
    this.mainCard.add(edges);
    this.mainCard.userData.edges = edges;
    
    // Add photo texture to front face
    this.loadProfileTexture();
  }

  loadProfileTexture() {
    const textureLoader = new THREE.TextureLoader();
    
    // Try to load actual texture, fallback to solid color
    const texturePath = '/assets/textures/foto-profilo.jpg';
    
    textureLoader.load(
      texturePath,
      (texture) => {
        // Create a material with the texture for the front face
        const materials = [];
        for (let i = 0; i < 6; i++) {
          if (i === 4) { // Front face (index 4 in BoxGeometry)
            materials.push(new THREE.MeshPhysicalMaterial({
              map: texture,
              transparent: true,
              opacity: 0.9,
              metalness: 0.1,
              roughness: 0.2,
              side: THREE.DoubleSide
            }));
          } else {
            materials.push(new THREE.MeshPhysicalMaterial({
              color: 0xffffff,
              transparent: true,
              opacity: 0.7,
              metalness: 0.1,
              roughness: 0.1,
              transmission: 0.9,
              ior: 1.5,
              thickness: 0.1
            }));
          }
        }
        this.mainCard.material = materials;
      },
      undefined,
      (err) => {
        console.log('Using fallback texture for main card');
        // Keep the default glass material
      }
    );
  }

  createProjectCards() {
    const projectData = [
      { name: 'Punto Cialde', logo: 'punto-cialde-logo.jpg', position: [-3, 0, -2], backface: { title: 'Punto Cialde', desc: 'Project description', date: '2023' } },
      { name: 'Il Ghiaccio Gourmet', logo: 'il-ghiaccio-gourmet-logo.jpg', position: [0, 0, -3], backface: { title: 'Il Ghiaccio Gourmet', desc: 'Project description', date: '2024' } },
      { name: 'Ingrozone', logo: 'ingrozone-logo.jpg', position: [3, 0, -2], backface: { title: 'Ingrozone', desc: 'Project description', date: '2024' } }
    ];
    
    projectData.forEach((project, index) => {
      const card = this.createProjectCard(project);
      card.position.copy(project.position);
      card.name = `projectCard_${index}`;
      this.projectCards.push(card);
      this.cardGroup.add(card);
    });
  }

  createProjectCard(project) {
    const group = new THREE.Group();
    
    // Card geometry (slightly smaller than main)
    const width = 2.4;
    const height = 3.2;
    const depth = 0.08;
    
    const geometry = new THREE.BoxGeometry(width, height, depth);
    
    // Materials for each face
    const materials = [];
    
    // Load logo texture for front
    const textureLoader = new THREE.TextureLoader();
    const texturePath = `/assets/textures/${project.logo}`;
    
    const frontMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.8,
      ior: 1.5,
      thickness: 0.1
    });
    
    textureLoader.load(
      texturePath,
      (texture) => {
        frontMaterial.map = texture;
        frontMaterial.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.log(`Using fallback for ${project.logo}`);
        // Add project name as text? Or keep solid color
      }
    );
    
    // Backface material with project details
    const backMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a0908,
      transparent: false,
      metalness: 0.3,
      roughness: 0.3
    });
    
    // Assign materials to faces
    for (let i = 0; i < 6; i++) {
      // Front (4) and back (5) faces
      if (i === 4) materials.push(frontMaterial);
      else if (i === 5) materials.push(backMaterial);
      else materials.push(new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9
      }));
    }
    
    const cardMesh = new THREE.Mesh(geometry, materials);
    cardMesh.name = 'cardMesh';
    group.add(cardMesh);
    
    // Gold edge glow for project card
    const edgeGeometry = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: this.colors.gold,
      linewidth: 1.5,
      transparent: true,
      opacity: 0.6
    });
    const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    group.add(edges);
    
    // Store project data
    group.userData = {
      project: project,
      edges: edges,
      frontMaterial: frontMaterial,
      backMaterial: backMaterial,
      flipped: false
    };
    
    return group;
  }

  // ============================================
  // PHASE 6: ANIMATION STATE MACHINE
  // ============================================

  setupEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (event) => this.onMouseMove(event));
    
    // Add click/touch for debugging
    window.addEventListener('click', (event) => this.onClick(event));
  }

  onMouseMove(event) {
    // Normalize mouse coordinates
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    
    // Raycasting for hover detection
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Check intersection with cards only
    const cardObjects = [this.mainCard, ...this.projectCards];
    const intersects = this.raycaster.intersectObjects(cardObjects);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      
      // Check if it's the main card or a project card
      if (object === this.mainCard || object.parent === this.mainCard) {
        this.setState('HOVER_MAIN');
      } else {
        // Find which project card
        const projectCard = this.projectCards.find(card => 
          card === object || card.children.includes(object)
        );
        if (projectCard) {
          this.setState('HOVER_PROJECT', projectCard);
        }
      }
    } else {
      this.setState('IDLE');
    }
  }

  onClick(event) {
    // For debugging: toggle states
    // console.log('Clicked');
  }

  setState(newState, target = null) {
    if (this.currentState === newState && newState !== 'IDLE') return;
    
    // Exit current state
    this.exitState(this.currentState);
    
    // Enter new state
    this.currentState = newState;
    this.enterState(newState, target);
  }

  exitState(state) {
    switch (state) {
      case 'HOVER_MAIN':
        // Reset main card scale
        gsap.to(this.mainCard.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Reset glow intensity
        if (this.mainCard.userData.edges) {
          gsap.to(this.mainCard.userData.edges.material, {
            opacity: 0.8,
            duration: 0.3
          });
        }
        
        this.autoOrbitEnabled = true;
        break;
        
      case 'HOVER_PROJECT':
        // Flip card back
        this.projectCards.forEach(card => {
          if (card.userData.flipped) {
            gsap.to(card.rotation, {
              y: 0,
              duration: 0.5,
              ease: 'power2.inOut'
            });
            card.userData.flipped = false;
          }
        });
        this.autoOrbitEnabled = true;
        break;
    }
  }

  enterState(state, target) {
    switch (state) {
      case 'HOVER_MAIN':
        // Scale main card
        gsap.to(this.mainCard.scale, {
          x: 1.05, y: 1.05, z: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Intensify glow
        if (this.mainCard.userData.edges) {
          gsap.to(this.mainCard.userData.edges.material, {
            opacity: 1.0,
            duration: 0.3
          });
        }
        
        // Create particle burst
        const cardPosition = new THREE.Vector3();
        this.mainCard.getWorldPosition(cardPosition);
        this.createBurstParticles(cardPosition);
        
        this.autoOrbitEnabled = false;
        break;
        
      case 'HOVER_PROJECT':
        // Flip the target project card
        if (target && !target.userData.flipped) {
          gsap.to(target.rotation, {
            y: Math.PI,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
              target.userData.flipped = true;
            }
          });
        }
        this.autoOrbitEnabled = false;
        break;
    }
  }

  // ============================================
  // PHASE 9: CAMERA AUTO-ORBIT
  // ============================================

  updateCamera() {
    if (this.autoOrbitEnabled) {
      this.orbitAngle += 0.2 * (Math.PI / 180); // 0.2°/second in radians
      
      const radius = 15;
      this.camera.position.x = Math.cos(this.orbitAngle) * radius;
      this.camera.position.z = Math.sin(this.orbitAngle) * radius;
      this.camera.position.y = 2 + Math.sin(this.orbitAngle * 0.5) * 0.5; // Slight vertical oscillation
      
      // Maintain the 15° tilt
      this.camera.lookAt(0, 0, 0);
      
      // Apply tilt
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = THREE.MathUtils.degToRad(15);
      this.camera.rotation.x = THREE.MathUtils.degToRad(-5);
    }
  }

  // ============================================
  // IDLE ANIMATIONS
  // ============================================

  updateIdleAnimations() {
    const time = this.clock.getElapsedTime();
    
    // Bob animation for all cards
    if (this.mainCard) {
      this.mainCard.position.y = Math.sin(time * 0.5) * 0.1;
    }
    
    this.projectCards.forEach((card, index) => {
      // Offset phases for each card
      const phase = index * (Math.PI / 2);
      card.position.y = Math.sin(time * 0.5 + phase) * 0.1;
    });
  }

  // ============================================
  // AMBIENT PARTICLE ANIMATION
  // ============================================

  updateAmbientParticles() {
    const geometry = this.ambientParticles.geometry;
    const positions = geometry.attributes.position;
    const velocities = geometry.attributes.velocity;
    const time = this.clock.getElapsedTime();
    
    for (let i = 0; i < positions.count; i++) {
      // Slow sine wave movement
      positions.array[i * 3] += Math.sin(time * 0.001 + i) * 0.001;
      positions.array[i * 3 + 1] += Math.cos(time * 0.001 + i) * 0.001;
      positions.array[i * 3 + 2] += Math.sin(time * 0.001 + i * 2) * 0.001;
    }
    
    positions.needsUpdate = true;
  }

  // ============================================
  // RESIZE HANDLER
  // ============================================

  onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.sizes.pixelRatio = Math.min(window.devicePixelRatio, 2);
    
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
    
    this.composer?.setSize(this.sizes.width, this.sizes.height);
  }

  // ============================================
  // ANIMATION LOOP
  // ============================================

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Update camera
    this.updateCamera();
    
    // Update animations
    if (this.currentState === 'IDLE') {
      this.updateIdleAnimations();
    }
    
    // Update particles
    this.updateAmbientParticles();
    this.updateBurstParticles();
    
    // Render
    if (this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

// Initialize the scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new AndreaCariniScene();
});
