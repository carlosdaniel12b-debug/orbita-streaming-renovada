/**
 * Órbita — Planeta 3D Fotorrealista con Anillos Saturnianos y Partículas Orbitales
 * Renderizado WebGL (Three.js) de alto rendimiento, 60fps continuo y responsive.
 */
(() => {
  'use strict';

  // Esperar a que Three.js y el DOM estén disponibles
  function initPlanet() {
    const container = document.getElementById('hero-planet-anchor');
    const canvas = document.getElementById('planet-scene');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    // Dimensiones iniciales del contenedor
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 500;

    // 1. Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.8);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Grupo principal para manipular rotación global y parallax
    const planetSystem = new THREE.Group();
    // Inclinación axial cinematográfica inspirada en Saturno (~27.5°)
    const axialTilt = -0.48; // ~ -27.5 grados
    planetSystem.rotation.z = axialTilt;
    planetSystem.rotation.x = 0.22;
    scene.add(planetSystem);

    // 2. Generación Procedural de Textura Superficial Ultrarrealista
    function createPlanetSurfaceTexture() {
      const texCanvas = document.createElement('canvas');
      texCanvas.width = 2048;
      texCanvas.height = 1024;
      const ctx = texCanvas.getContext('2d');

      // Fondo base: gradiente cósmico profundo de azules, violetas y cian
      const grad = ctx.createLinearGradient(0, 0, 0, texCanvas.height);
      grad.addColorStop(0.00, '#020612'); // Polo norte oscuro
      grad.addColorStop(0.08, '#0b1b3a');
      grad.addColorStop(0.18, '#1e3a8a'); // Azul eléctrico profundo
      grad.addColorStop(0.28, '#4338ca'); // Índigo / violeta
      grad.addColorStop(0.38, '#0284c7'); // Azul cian
      grad.addColorStop(0.48, '#0369a1');
      grad.addColorStop(0.50, '#0ea5e9'); // Banda ecuatorial brillante
      grad.addColorStop(0.54, '#06b6d4'); // Resplandor cian
      grad.addColorStop(0.62, '#1d4ed8');
      grad.addColorStop(0.72, '#5b21b6'); // Franja violeta profunda
      grad.addColorStop(0.82, '#1e293b');
      grad.addColorStop(0.92, '#0c1a30');
      grad.addColorStop(1.00, '#02050e'); // Polo sur
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, texCanvas.width, texCanvas.height);

      // Bandas atmosféricas, tormentas y turbulencia con armónicos
      for (let y = 0; y < texCanvas.height; y += 2) {
        const ny = y / texCanvas.height;
        // Frecuencias sinusoidales para crear estriaciones naturales de gas
        const bandNoise = 
          Math.sin(ny * 45.0) * 0.15 +
          Math.sin(ny * 95.0 + 1.2) * 0.08 +
          Math.sin(ny * 180.0 + 0.4) * 0.04;

        if (Math.abs(bandNoise) > 0.02) {
          const alpha = Math.min(Math.abs(bandNoise) * 1.8, 0.45);
          ctx.fillStyle = bandNoise > 0 
            ? `rgba(167, 234, 216, ${alpha})` // Destellos cian
            : `rgba(139, 92, 246, ${alpha})`;  // Destellos violetas
          ctx.fillRect(0, y, texCanvas.width, 2);
        }
      }

      // Tormentas y vórtices atmosféricos orgánicos
      const storms = [
        { x: 500, y: 520, rx: 110, ry: 45, col: 'rgba(167, 234, 216, 0.35)' },
        { x: 1350, y: 480, rx: 140, ry: 50, col: 'rgba(34, 211, 238, 0.28)' },
        { x: 900, y: 310, rx: 80, ry: 30, col: 'rgba(192, 132, 252, 0.30)' },
        { x: 300, y: 680, rx: 95, ry: 35, col: 'rgba(56, 189, 248, 0.25)' },
        { x: 1700, y: 620, rx: 120, ry: 40, col: 'rgba(147, 197, 253, 0.25)' }
      ];

      storms.forEach(st => {
        const sGrad = ctx.createRadialGradient(st.x, st.y, 4, st.x, st.y, st.rx);
        sGrad.addColorStop(0, st.col);
        sGrad.addColorStop(0.5, st.col.replace(/[\d\.]+\)$/, '0.12)'));
        sGrad.addColorStop(1, 'transparent');
        ctx.save();
        ctx.fillStyle = sGrad;
        ctx.beginPath();
        ctx.ellipse(st.x, st.y, st.rx, st.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Auroras polares brillantes
      const northAurora = ctx.createLinearGradient(0, 0, 0, 80);
      northAurora.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
      northAurora.addColorStop(0.5, 'rgba(167, 234, 216, 0.35)');
      northAurora.addColorStop(1, 'transparent');
      ctx.fillStyle = northAurora;
      ctx.fillRect(0, 0, texCanvas.width, 80);

      const southAurora = ctx.createLinearGradient(0, texCanvas.height, 0, texCanvas.height - 80);
      southAurora.addColorStop(0, 'rgba(168, 85, 247, 0.55)');
      southAurora.addColorStop(0.5, 'rgba(34, 211, 238, 0.3)');
      southAurora.addColorStop(1, 'transparent');
      ctx.fillStyle = southAurora;
      ctx.fillRect(0, texCanvas.height - 80, texCanvas.width, 80);

      const texture = new THREE.CanvasTexture(texCanvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    }

    // Textura de rugosidad / relieve para capturar sombras cinemáticas
    function createPlanetBumpTexture() {
      const bCanvas = document.createElement('canvas');
      bCanvas.width = 1024;
      bCanvas.height = 512;
      const ctx = bCanvas.getContext('2d');
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, bCanvas.width, bCanvas.height);

      for (let y = 0; y < bCanvas.height; y += 4) {
        const val = 128 + Math.sin(y * 0.4) * 45 + Math.sin(y * 0.85) * 20;
        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        ctx.fillRect(0, y, bCanvas.width, 4);
      }
      return new THREE.CanvasTexture(bCanvas);
    }

    // 3. Malla Esférica del Planeta
    const planetRadius = 2.0;
    const planetGeometry = new THREE.SphereGeometry(planetRadius, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: createPlanetSurfaceTexture(),
      bumpMap: createPlanetBumpTexture(),
      bumpScale: 0.035,
      roughness: 0.52,
      metalness: 0.12
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    planetSystem.add(planetMesh);

    // 4. Atmósfera Luminosa Exterior (Glow Fresnel Shader)
    const atmosphereGeometry = new THREE.SphereGeometry(planetRadius * 1.026, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float fresnel = 1.0 - max(dot(viewDir, vNormal), 0.0);
          fresnel = pow(fresnel, 2.8);

          // Color atmosférico: mezcla de cian eléctrico, azul cósmico y toque violeta
          vec3 cyanGlow = vec3(0.36, 0.88, 0.98);
          vec3 violetGlow = vec3(0.62, 0.45, 0.98);
          vec3 atmColor = mix(cyanGlow, violetGlow, fresnel * 0.5);

          gl_FragColor = vec4(atmColor, fresnel * 0.88);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planetSystem.add(atmosphereMesh);

    // 5. Anillos Orbitales Fotorrealistas (Inspirados en Saturno)
    const ringInnerRadius = 2.45;
    const ringOuterRadius = 4.45;
    const ringGeometry = new THREE.RingGeometry(ringInnerRadius, ringOuterRadius, 160);

    // Ajustar coordenadas UV para mapear radialmente
    const pos = ringGeometry.attributes.position;
    const uvs = ringGeometry.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const r = Math.sqrt(vx * vx + vy * vy);
      const u = (r - ringInnerRadius) / (ringOuterRadius - ringInnerRadius);
      const theta = Math.atan2(vy, vx);
      const v = (theta / (Math.PI * 2)) + 0.5;
      uvs.setXY(i, u, v);
    }
    ringGeometry.attributes.uv.needsUpdate = true;

    // Generar textura 1D/2D del sistema de anillos con división de Cassini
    function createSaturnRingsTexture() {
      const rCanvas = document.createElement('canvas');
      rCanvas.width = 1024;
      rCanvas.height = 64;
      const ctx = rCanvas.getContext('2d');

      const rGrad = ctx.createLinearGradient(0, 0, rCanvas.width, 0);
      // Anillo C (Crepe ring) interior translúcido
      rGrad.addColorStop(0.00, 'rgba(0, 0, 0, 0)');
      rGrad.addColorStop(0.05, 'rgba(99, 102, 241, 0.20)');
      rGrad.addColorStop(0.18, 'rgba(56, 189, 248, 0.45)');
      // Anillo B principal denso y brillante
      rGrad.addColorStop(0.22, 'rgba(167, 234, 216, 0.92)');
      rGrad.addColorStop(0.35, 'rgba(235, 255, 250, 0.98)');
      rGrad.addColorStop(0.48, 'rgba(125, 211, 252, 0.88)');
      rGrad.addColorStop(0.58, 'rgba(192, 132, 252, 0.75)');
      // División de Cassini (espacio oscuro realista)
      rGrad.addColorStop(0.60, 'rgba(2, 6, 18, 0.08)');
      rGrad.addColorStop(0.64, 'rgba(2, 6, 18, 0.05)');
      // Anillo A exterior con subdivisiones
      rGrad.addColorStop(0.66, 'rgba(56, 189, 248, 0.82)');
      rGrad.addColorStop(0.78, 'rgba(167, 234, 216, 0.88)');
      rGrad.addColorStop(0.86, 'rgba(147, 197, 253, 0.65)');
      // Borde externo difuminado en el espacio
      rGrad.addColorStop(0.94, 'rgba(99, 102, 241, 0.28)');
      rGrad.addColorStop(1.00, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = rGrad;
      ctx.fillRect(0, 0, rCanvas.width, rCanvas.height);

      // Micro-estrías de hielo para dar textura fotorrealista a los aros
      for (let x = 0; x < rCanvas.width; x += 3) {
        const u = x / rCanvas.width;
        if (u > 0.15 && u < 0.92 && !(u > 0.59 && u < 0.65)) {
          const fineStria = Math.sin(x * 0.9) * 0.15;
          ctx.fillStyle = fineStria > 0 
            ? 'rgba(255, 255, 255, 0.18)' 
            : 'rgba(0, 4, 12, 0.22)';
          ctx.fillRect(x, 0, 2, rCanvas.height);
        }
      }

      const ringTex = new THREE.CanvasTexture(rCanvas);
      ringTex.wrapS = THREE.ClampToEdgeWrapping;
      ringTex.wrapT = THREE.RepeatWrapping;
      return ringTex;
    }

    const ringMaterial = new THREE.MeshStandardMaterial({
      map: createSaturnRingsTexture(),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
      roughness: 0.35,
      metalness: 0.15,
      alphaTest: 0.02
    });

    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    ringMesh.rotation.x = Math.PI / 2; // Colocar en el plano ecuatorial
    ringMesh.castShadow = true;
    ringMesh.receiveShadow = true;
    planetSystem.add(ringMesh);

    // 6. Nube de Partículas de Hielo y Polvo Cósmico Orbitando
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleData = [];

    const palette = [
      new THREE.Color('#a7ead8'), // Cian menta
      new THREE.Color('#38bdf8'), // Azul eléctrico
      new THREE.Color('#c084fc'), // Violeta
      new THREE.Color('#ffffff')  // Blanco brillante
    ];

    for (let i = 0; i < particleCount; i++) {
      // Radios distribuidos a lo largo y alrededor de los anillos
      const r = ringInnerRadius + Math.random() * (ringOuterRadius - ringInnerRadius + 1.2);
      const angle = Math.random() * Math.PI * 2;
      const heightOffset = (Math.random() - 0.5) * 0.25;
      const speed = (0.003 + Math.random() * 0.005) * (3.0 / r); // Ley de Kepler aproximada

      particleData.push({ radius: r, angle: angle, height: heightOffset, speed: speed });

      particlePositions[i * 3 + 0] = Math.cos(angle) * r;
      particlePositions[i * 3 + 1] = heightOffset;
      particlePositions[i * 3 + 2] = Math.sin(angle) * r;

      const col = palette[Math.floor(Math.random() * palette.length)];
      particleColors[i * 3 + 0] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Textura circular suave para las partículas
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 32;
    pCanvas.height = 32;
    const pCtx = pCanvas.getContext('2d');
    const pGrad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    pGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    pGrad.addColorStop(0.4, 'rgba(167, 234, 216, 0.8)');
    pGrad.addColorStop(1, 'transparent');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      map: pTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMaterial);
    planetSystem.add(particles);

    // 7. Iluminación Cinemática de Alta Gama
    // Luz direccional principal (Sol distante desde arriba a la izquierda)
    const keyLight = new THREE.DirectionalLight(0xf5fbff, 2.4);
    keyLight.position.set(-8, 5, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.bias = -0.0006;
    scene.add(keyLight);

    // Luz de relleno violeta cósmica para el lado oscuro (Rim light dramático)
    const rimLight = new THREE.DirectionalLight(0x7c3aed, 1.2);
    rimLight.position.set(7, -3, -4);
    scene.add(rimLight);

    // Luz cian ambiental sutil para preservar detalle estelar
    const ambientLight = new THREE.AmbientLight(0x061426, 0.45);
    scene.add(ambientLight);

    // 8. Interacción de Parallax y Profundidad con el Cursor
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    function onPointerMove(e) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      targetMouseX = (clientX - halfW) / halfW;
      targetMouseY = (clientY - halfH) / halfH;
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });

    // 9. Adaptabilidad Responsive para PC y Móviles
    function onResize() {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 500;
      camera.aspect = width / height;

      // En pantallas móviles estrechas ajustamos la distancia para encuadre ideal
      if (width < 768) {
        camera.position.z = 10.4;
      } else if (width < 1100) {
        camera.position.z = 9.4;
      } else {
        camera.position.z = 8.8;
      }

      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    window.addEventListener('resize', onResize, { passive: true });
    onResize();

    // 10. Pausa inteligente cuando el Hero no está visible (Ahorro de batería y GPU)
    let isVisible = true;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    // 11. Bucle de Animación Continuo y Cinemático (60 FPS)
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Rotación continua y elegante del planeta
      planetMesh.rotation.y += 0.0016;

      // Rotación sutil y fluida de los anillos
      ringMesh.rotation.z += 0.0006;

      // Actualizar posición orbital de partículas de hielo
      const posAttr = particleGeo.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        p.angle += p.speed;
        posAttr.setX(i, Math.cos(p.angle) * p.radius);
        posAttr.setZ(i, Math.sin(p.angle) * p.radius);
        // Oscilación vertical suave
        posAttr.setY(i, p.height + Math.sin(elapsedTime * 1.5 + i) * 0.04);
      }
      posAttr.needsUpdate = true;

      // Suavizado e inercia del movimiento del cursor (Lerp)
      currentMouseX += (targetMouseX - currentMouseX) * 0.045;
      currentMouseY += (targetMouseY - currentMouseY) * 0.045;

      // Parallax sutil y elegante que no distrae del contenido
      planetSystem.rotation.z = axialTilt + currentMouseX * 0.12;
      planetSystem.rotation.x = 0.22 + currentMouseY * 0.14;
      camera.position.x = currentMouseX * 0.35;
      camera.position.y = -currentMouseY * 0.30;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    animate();
    document.documentElement.classList.add('webgl-ready');
  }

  // Inicializar tan pronto el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlanet);
  } else {
    initPlanet();
  }
})();
