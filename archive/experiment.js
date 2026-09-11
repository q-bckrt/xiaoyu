/**
 * 啸宇 · Xiaoyu | Chrono-Kinetic Armillary Core Engine & 3D Interactivity
 * Archetype: The Mindful Craftsman / High-Precision Modernist
 */

(function () {
    'use strict';

    // Check for Three.js
    if (typeof THREE === 'undefined') {
        console.warn('Three.js is not loaded. Ensure three.min.js script is included.');
        return;
    }

    /* ==========================================================================
       01 · THE CHRONO-KINETIC ARMILLARY 3D SCENE
       ========================================================================== */
    const container = document.getElementById('armillary-container');
    const canvas = document.getElementById('armillary-canvas');
    if (!container || !canvas) return;

    let scene, camera, renderer;
    let armillaryGroup, ringOuter, ringMiddle, ringInner, ringAxis;
    let centralCore, coreWireframe, balanceSpringLines, orbitalParticles;
    let dirLight, ambientLight, rimLight;

    // Simulation Physics State
    const state = {
        mode: 'horology', // 'horology' | 'wuwei' | 'telemetry'
        rotSpeedBase: 0.005,
        targetRotX: 0.35,
        targetRotY: 0.55,
        currentRotX: 0.35,
        currentRotY: 0.55,
        dragRotX: 0,
        dragRotY: 0,
        dragVelX: 0,
        dragVelY: 0,
        isDragging: false,
        lastMouseX: 0,
        lastMouseY: 0,
        mouseHoverX: 0,
        mouseHoverY: 0,
        zoom: 4.8,
        targetZoom: 4.8,
        theme: document.documentElement.getAttribute('data-theme') || 'light',
        soundEnabled: false,
        fps: 60,
        frameCount: 0,
        lastFpsUpdate: performance.now(),
        timeDeltaMs: 16.6
    };

    // Color Palettes by Theme
    function getThemePalette() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return {
            isDark: isDark,
            bg: isDark ? 0x121417 : 0xF8F7F4,
            ringMetallic: isDark ? 0xC8D1DC : 0x2A2E35,
            ringSecondary: isDark ? 0x6B7584 : 0x768294,
            sageAccent: isDark ? 0x8DB477 : 0x768E65,
            cognacAccent: isDark ? 0xC68E56 : 0x9A6735,
            coreBody: isDark ? 0x1A1E24 : 0xE8E6E0,
            ambientLight: isDark ? 0x2A2E35 : 0xECE9E2,
            keyLight: isDark ? 0xF8F7F4 : 0xFFFFFF,
            rimLight: isDark ? 0x8DB477 : 0x9A6735
        };
    }

    // Initialize WebGL Scene
    function initArmillary() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.z = state.zoom;

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        // Lighting
        const palette = getThemePalette();
        ambientLight = new THREE.AmbientLight(palette.ambientLight, 1.4);
        scene.add(ambientLight);

        dirLight = new THREE.DirectionalLight(palette.keyLight, 1.8);
        dirLight.position.set(4, 6, 5);
        scene.add(dirLight);

        rimLight = new THREE.DirectionalLight(palette.rimLight, 1.2);
        rimLight.position.set(-4, -4, -3);
        scene.add(rimLight);

        // Root Armillary Group
        armillaryGroup = new THREE.Group();
        scene.add(armillaryGroup);

        buildArmillaryGeometry(palette);
        setupInteractionListeners();
    }

    // Procedural Geometry Builder
    function buildArmillaryGeometry(palette) {
        // Material Definitions
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: palette.ringMetallic,
            metalness: 0.85,
            roughness: 0.22,
            wireframe: false
        });

        const tickMaterial = new THREE.LineBasicMaterial({
            color: palette.sageAccent,
            linewidth: 1,
            transparent: true,
            opacity: 0.75
        });

        const cognacTickMaterial = new THREE.LineBasicMaterial({
            color: palette.cognacAccent,
            linewidth: 1,
            transparent: true,
            opacity: 0.85
        });

        /* --- 1. Outer Equatorial Ring (Radius 1.85) --- */
        ringOuter = new THREE.Group();
        const outerTorusGeom = new THREE.TorusGeometry(1.85, 0.014, 16, 100);
        const outerMesh = new THREE.Mesh(outerTorusGeom, ringMaterial);
        ringOuter.add(outerMesh);

        // Precision Tick Marks (60 seconds / degrees)
        const outerTicksGeom = new THREE.BufferGeometry();
        const outerTickPoints = [];
        for (let i = 0; i < 60; i++) {
            const angle = (i / 60) * Math.PI * 2;
            const isMajor = i % 5 === 0;
            const r1 = 1.85;
            const r2 = isMajor ? 1.94 : 1.90;
            outerTickPoints.push(
                Math.cos(angle) * r1, Math.sin(angle) * r1, 0,
                Math.cos(angle) * r2, Math.sin(angle) * r2, 0
            );
        }
        outerTicksGeom.setAttribute('position', new THREE.Float32BufferAttribute(outerTickPoints, 3));
        const outerTicksLine = new THREE.LineSegments(outerTicksGeom, cognacTickMaterial);
        ringOuter.add(outerTicksLine);
        armillaryGroup.add(ringOuter);

        /* --- 2. Middle Meridian Gimbal (Radius 1.55) --- */
        ringMiddle = new THREE.Group();
        const middleTorusGeom = new THREE.TorusGeometry(1.55, 0.012, 16, 80);
        const middleMesh = new THREE.Mesh(middleTorusGeom, ringMaterial);
        ringMiddle.add(middleMesh);

        // Coordinate Meridian Degree Marks
        const middleTicksGeom = new THREE.BufferGeometry();
        const middleTickPoints = [];
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const isCardinal = i % 9 === 0;
            const r1 = 1.55;
            const r2 = isCardinal ? 1.63 : 1.59;
            middleTickPoints.push(
                Math.cos(angle) * r1, 0, Math.sin(angle) * r1,
                Math.cos(angle) * r2, 0, Math.sin(angle) * r2
            );
        }
        middleTicksGeom.setAttribute('position', new THREE.Float32BufferAttribute(middleTickPoints, 3));
        const middleTicksLine = new THREE.LineSegments(middleTicksGeom, tickMaterial);
        ringMiddle.add(middleTicksLine);
        armillaryGroup.add(ringMiddle);

        /* --- 3. Inner Declination Ring (Radius 1.25) --- */
        ringInner = new THREE.Group();
        const innerTorusGeom = new THREE.TorusGeometry(1.25, 0.010, 16, 64);
        const innerMesh = new THREE.Mesh(innerTorusGeom, ringMaterial);
        ringInner.add(innerMesh);

        // Concentric Beveled Caliber Ring
        const innerSubTorusGeom = new THREE.TorusGeometry(1.18, 0.005, 12, 64);
        const innerSubMesh = new THREE.Mesh(innerSubTorusGeom, ringMaterial);
        ringInner.add(innerSubMesh);
        armillaryGroup.add(ringInner);

        /* --- 4. Central Taoist Faceted Monolith Core --- */
        const coreGeom = new THREE.IcosahedronGeometry(0.55, 0); // Faceted crystal polyhedron
        const coreMat = new THREE.MeshPhysicalMaterial({
            color: palette.coreBody,
            metalness: 0.65,
            roughness: 0.18,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
            flatShading: true
        });
        centralCore = new THREE.Mesh(coreGeom, coreMat);

        // 1px Hairline Wireframe Outline
        const coreWireGeom = new THREE.WireframeGeometry(coreGeom);
        const coreWireMat = new THREE.LineBasicMaterial({
            color: palette.sageAccent,
            linewidth: 1,
            transparent: true,
            opacity: 0.65
        });
        coreWireframe = new THREE.LineSegments(coreWireGeom, coreWireMat);
        centralCore.add(coreWireframe);
        armillaryGroup.add(centralCore);

        /* --- 5. Horological Balance Hairspring Arc --- */
        const springPoints = [];
        const turns = 4;
        const totalPoints = 140;
        for (let i = 0; i < totalPoints; i++) {
            const theta = (i / totalPoints) * Math.PI * 2 * turns;
            const r = 0.1 + (i / totalPoints) * 0.45;
            springPoints.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
        }
        const springGeom = new THREE.BufferGeometry().setFromPoints(springPoints);
        const springMat = new THREE.LineBasicMaterial({
            color: palette.cognacAccent,
            transparent: true,
            opacity: 0.85
        });
        balanceSpringLines = new THREE.Line(springGeom, springMat);
        centralCore.add(balanceSpringLines);

        /* --- 6. Solarpunk Geodesic Orbital Particle Cloud --- */
        const particleCount = 72;
        const particleGeom = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        const colorSage = new THREE.Color(palette.sageAccent);
        const colorCognac = new THREE.Color(palette.cognacAccent);

        for (let i = 0; i < particleCount; i++) {
            const radius = 1.35 + Math.random() * 0.55;
            const theta = Math.random() * Math.PI * 2;
            const phi = (Math.random() - 0.5) * Math.PI * 0.6;

            particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
            particlePositions[i * 3 + 1] = radius * Math.sin(theta) * Math.cos(phi);
            particlePositions[i * 3 + 2] = radius * Math.sin(phi);

            const c = i % 2 === 0 ? colorSage : colorCognac;
            particleColors[i * 3] = c.r;
            particleColors[i * 3 + 1] = c.g;
            particleColors[i * 3 + 2] = c.b;
        }

        particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        const particleMat = new THREE.PointsMaterial({
            size: 0.038,
            vertexColors: true,
            transparent: true,
            opacity: 0.85
        });

        orbitalParticles = new THREE.Points(particleGeom, particleMat);
        armillaryGroup.add(orbitalParticles);
    }

    // Dynamic Theme Shading Updates
    function updateThreeTheme() {
        const palette = getThemePalette();
        if (!scene) return;

        ambientLight.color.setHex(palette.ambientLight);
        dirLight.color.setHex(palette.keyLight);
        rimLight.color.setHex(palette.rimLight);

        // Update Materials
        if (ringOuter) {
            ringOuter.children[0].material.color.setHex(palette.ringMetallic);
            ringMiddle.children[0].material.color.setHex(palette.ringMetallic);
            ringInner.children[0].material.color.setHex(palette.ringMetallic);
            ringInner.children[1].material.color.setHex(palette.ringMetallic);

            centralCore.material.color.setHex(palette.coreBody);
            coreWireframe.material.color.setHex(palette.sageAccent);
            balanceSpringLines.material.color.setHex(palette.cognacAccent);

            ringOuter.children[1].material.color.setHex(palette.cognacAccent);
            ringMiddle.children[1].material.color.setHex(palette.sageAccent);
        }
    }

    // User Mouse & Touch Interaction Setup
    function setupInteractionListeners() {
        // Canvas Drag Interaction
        canvas.addEventListener('mousedown', (e) => {
            state.isDragging = true;
            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
        });

        window.addEventListener('mousemove', (e) => {
            // Track normalized hover position for magnetic tilt
            const rect = canvas.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
                state.mouseHoverX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.4;
                state.mouseHoverY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.4;
            } else {
                state.mouseHoverX *= 0.95;
                state.mouseHoverY *= 0.95;
            }

            if (!state.isDragging) return;
            const deltaX = e.clientX - state.lastMouseX;
            const deltaY = e.clientY - state.lastMouseY;

            state.dragVelY = deltaX * 0.006;
            state.dragVelX = deltaY * 0.006;

            state.dragRotY += state.dragVelY;
            state.dragRotX += state.dragVelX;

            state.lastMouseX = e.clientX;
            state.lastMouseY = e.clientY;
        });

        window.addEventListener('mouseup', () => {
            state.isDragging = false;
        });

        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                state.isDragging = true;
                state.lastMouseX = e.touches[0].clientX;
                state.lastMouseY = e.touches[0].clientY;
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!state.isDragging || e.touches.length !== 1) return;
            const deltaX = e.touches[0].clientX - state.lastMouseX;
            const deltaY = e.touches[0].clientY - state.lastMouseY;

            state.dragVelY = deltaX * 0.008;
            state.dragVelX = deltaY * 0.008;

            state.dragRotY += state.dragVelY;
            state.dragRotX += state.dragVelX;

            state.lastMouseX = e.touches[0].clientX;
            state.lastMouseY = e.touches[0].clientY;
        }, { passive: true });

        window.addEventListener('touchend', () => {
            state.isDragging = false;
        });

        // Scroll Wheel Zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            state.targetZoom += e.deltaY * 0.002;
            state.targetZoom = Math.max(3.4, Math.min(6.5, state.targetZoom));
        }, { passive: false });

        // Double Click to Reset
        canvas.addEventListener('dblclick', () => {
            state.dragRotX = 0;
            state.dragRotY = 0;
            state.dragVelX = 0;
            state.dragVelY = 0;
            state.targetZoom = 4.8;
            playChronoTick(880, 0.04);
        });

        // Window Resize
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        if (!camera || !renderer || !canvas) return;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // Animation & Physics Render Loop
    let lastTime = performance.now();

    function animate(currentTime) {
        requestAnimationFrame(animate);

        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        // FPS & Latency Measurement
        state.frameCount++;
        if (currentTime - state.lastFpsUpdate >= 1000) {
            state.fps = Math.round((state.frameCount * 1000) / (currentTime - state.lastFpsUpdate));
            state.timeDeltaMs = (1000 / state.fps).toFixed(1);
            state.frameCount = 0;
            state.lastFpsUpdate = currentTime;
            updateHudReadouts();
        }

        // Apply Inertial Drag Damping
        if (!state.isDragging) {
            state.dragRotY += state.dragVelY;
            state.dragRotX += state.dragVelX;
            state.dragVelX *= 0.93;
            state.dragVelY *= 0.93;
        }

        // Camera Zoom Smooth Interpolation
        state.zoom += (state.targetZoom - state.zoom) * 0.1;
        camera.position.z = state.zoom;

        // Root Group Rotation (Magnetic hover + inertial drag)
        armillaryGroup.rotation.x = state.targetRotX + state.dragRotX + state.mouseHoverY;
        armillaryGroup.rotation.y = state.targetRotY + state.dragRotY + state.mouseHoverX;

        // Mode-Specific Kinematics
        const t = currentTime * 0.001;

        if (state.mode === 'horology') {
            // Mechanical Rigor: Swiss gear ratios
            ringOuter.rotation.z += 0.008;
            ringMiddle.rotation.x -= 0.012;
            ringInner.rotation.y += 0.018;

            // Balance wheel oscillation (4Hz watch beat)
            const balanceAngle = Math.sin(t * 8 * Math.PI) * 0.45;
            balanceSpringLines.rotation.z = balanceAngle;
            centralCore.rotation.y += 0.006;
            centralCore.rotation.x = Math.sin(t * 1.5) * 0.08;

            orbitalParticles.rotation.y += 0.004;

        } else if (state.mode === 'wuwei') {
            // Zen Flow: Fluid harmonic breathing
            const harmonic = Math.sin(t * 1.2) * 0.3;
            ringOuter.rotation.z = Math.sin(t * 0.8) * 0.6;
            ringOuter.rotation.x = Math.cos(t * 0.6) * 0.3;

            ringMiddle.rotation.y = Math.cos(t * 0.7) * 0.7;
            ringMiddle.rotation.z = Math.sin(t * 0.5) * 0.4;

            ringInner.rotation.x = Math.sin(t * 0.9) * 0.8;
            ringInner.rotation.y = Math.cos(t * 0.4) * 0.5;

            centralCore.rotation.y += 0.014;
            centralCore.rotation.z += 0.008;
            centralCore.position.y = Math.sin(t * 1.6) * 0.06;

            orbitalParticles.rotation.y += 0.009;
            orbitalParticles.rotation.x = Math.sin(t * 0.5) * 0.2;

        } else if (state.mode === 'telemetry') {
            // High-Tech Telemetry: High velocity alignment
            ringOuter.rotation.z += 0.024;
            ringMiddle.rotation.x -= 0.032;
            ringInner.rotation.y += 0.045;

            centralCore.rotation.y += 0.025;
            centralCore.rotation.x += 0.015;

            orbitalParticles.rotation.y += 0.028;
            orbitalParticles.rotation.z += 0.012;
        }

        renderer.render(scene, camera);
    }

    // HUD Live Metrics Updater
    function updateHudReadouts() {
        const fpsEl = document.getElementById('hud-fps-val');
        const eulerEl = document.getElementById('hud-euler-val');
        const velEl = document.getElementById('hud-vel-val');

        if (fpsEl) fpsEl.textContent = `${state.fps} FPS · ${state.timeDeltaMs}ms`;
        if (eulerEl && armillaryGroup) {
            const rx = (THREE.MathUtils.radToDeg(armillaryGroup.rotation.x) % 360).toFixed(0);
            const ry = (THREE.MathUtils.radToDeg(armillaryGroup.rotation.y) % 360).toFixed(0);
            eulerEl.textContent = `[φ:${rx}° ψ:${ry}°]`;
        }
        if (velEl) {
            const vel = (Math.abs(state.dragVelX) + Math.abs(state.dragVelY) + 0.05).toFixed(2);
            velEl.textContent = `${vel} rad/s`;
        }
    }

    /* ==========================================================================
       02 · MODE SELECTOR & THEME CONTROLS
       ========================================================================== */
    function setupModeButtons() {
        const buttons = document.querySelectorAll('.hud-mode-btn');
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state.mode = btn.getAttribute('data-mode');

                playChronoTick(640, 0.03);

                // Update active mode text in codex table
                const codexMode = document.getElementById('telemetry-mode-display');
                if (codexMode) codexMode.textContent = state.mode.toUpperCase();
            });
        });
    }

    /* ==========================================================================
       03 · WEB AUDIO API HAPTICS (OPT-IN MECHANICAL TICK)
       ========================================================================== */
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playChronoTick(freq = 1200, duration = 0.015) {
        if (!state.soundEnabled || !audioCtx) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + duration);

            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio policy fallback
        }
    }

    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            initAudio();
            state.soundEnabled = !state.soundEnabled;
            soundBtn.classList.toggle('active', state.soundEnabled);
            const label = soundBtn.querySelector('.tool-label');
            if (label) label.textContent = state.soundEnabled ? 'HAPTICS · ON' : 'HAPTICS · OFF';
            if (state.soundEnabled) playChronoTick(1400, 0.02);
        });
    }

    /* ==========================================================================
       04 · INTERACTIVE 3D PERSPECTIVE TILT CARDS
       ========================================================================== */
    function setup3DTiltCards() {
        const cards = document.querySelectorAll('.tilt-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Max tilt 7 degrees
                const rotateX = ((y - centerY) / centerY) * -6.5;
                const rotateY = ((x - centerX) / centerX) * 6.5;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;

                // Update specular sheen position
                const glintX = ((x / rect.width) * 100).toFixed(1);
                const glintY = ((y / rect.height) * 100).toFixed(1);
                card.style.setProperty('--glint-x', `${glintX}%`);
                card.style.setProperty('--glint-y', `${glintY}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            });

            card.addEventListener('mouseenter', () => {
                playChronoTick(920, 0.01);
            });
        });
    }

    /* ==========================================================================
       05 · REAL-TIME TELEMETRY OSCILLOSCOPE
       ========================================================================== */
    function setupOscilloscope() {
        const oscCanvas = document.getElementById('oscilloscope-canvas');
        if (!oscCanvas) return;

        const ctx = oscCanvas.getContext('2d');
        let phase = 0;

        function resizeOsc() {
            oscCanvas.width = oscCanvas.clientWidth * (window.devicePixelRatio || 1);
            oscCanvas.height = oscCanvas.clientHeight * (window.devicePixelRatio || 1);
        }
        resizeOsc();
        window.addEventListener('resize', resizeOsc);

        function drawOsc() {
            requestAnimationFrame(drawOsc);
            const w = oscCanvas.width;
            const h = oscCanvas.height;
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

            ctx.clearRect(0, 0, w, h);

            // Subtle Grid Line
            ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            ctx.stroke();

            // Waveform (Simulated Swiss Escapement Beat Pulse)
            ctx.strokeStyle = isDark ? '#8DB477' : '#768E65';
            ctx.lineWidth = 1.6;
            ctx.beginPath();

            const speed = state.mode === 'telemetry' ? 0.08 : state.mode === 'wuwei' ? 0.03 : 0.05;
            phase += speed;

            for (let x = 0; x < w; x++) {
                const normX = x / w;
                // Composite wave: fundamental + watch tick pulse
                const pulseX = (normX * 8 + phase) % 1;
                const pulse = Math.exp(-Math.pow((pulseX - 0.5) * 12, 2)) * 0.45;
                const wave = Math.sin(normX * 16 + phase) * 0.18 + pulse;

                const y = h / 2 + wave * (h * 0.75);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        drawOsc();
    }

    /* ==========================================================================
       06 · KINETIC MECHANICAL RETICLE (CUSTOM CURSOR)
       ========================================================================== */
    function setupMechanicalReticle() {
        const reticle = document.getElementById('reticle-cursor');
        const coords = document.getElementById('reticle-coords');
        if (!reticle || !coords) return;

        let mouseX = -100, mouseY = -100;
        let reticleX = -100, reticleY = -100;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            reticle.classList.add('visible');
            coords.classList.add('visible');
            coords.textContent = `[X:${mouseX.toString().padStart(4, '0')} Y:${mouseY.toString().padStart(4, '0')}]`;
        });

        window.addEventListener('mouseleave', () => {
            reticle.classList.remove('visible');
            coords.classList.remove('visible');
        });

        // Hover scale on interactive triggers
        const interactives = document.querySelectorAll('a, button, .tilt-card, #armillary-canvas');
        interactives.forEach((el) => {
            el.addEventListener('mouseenter', () => reticle.classList.add('hovering'));
            el.addEventListener('mouseleave', () => reticle.classList.remove('hovering'));
        });

        // Smooth Lerp Loop
        function renderReticle() {
            reticleX += (mouseX - reticleX) * 0.28;
            reticleY += (mouseY - reticleY) * 0.28;

            reticle.style.left = `${reticleX}px`;
            reticle.style.top = `${reticleY}px`;

            coords.style.left = `${mouseX}px`;
            coords.style.top = `${mouseY}px`;

            requestAnimationFrame(renderReticle);
        }
        renderReticle();
    }

    /* ==========================================================================
       06 · THEME TOGGLE OBSERVER & ZERO-FLASH LOGIC
       ========================================================================== */
    function setupThemeSwitching() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const themeIcon = themeToggle.querySelector('.theme-toggle-icon');
        const themeLabel = themeToggle.querySelector('.theme-toggle-label');

        function updateToggleUI(theme) {
            const isDark = theme === 'dark';
            if (themeIcon) themeIcon.textContent = isDark ? '☀' : '☾';
            if (themeLabel) themeLabel.textContent = isDark ? 'LIGHT' : 'DARK';
            updateThreeTheme();
        }

        const active = document.documentElement.getAttribute('data-theme') || 'light';
        updateToggleUI(active);

        themeToggle.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('xiaoyu_theme', next);
            updateToggleUI(next);
            playChronoTick(1100, 0.025);
        });

        // Mutation observer to synchronize 3D WebGL materials
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    updateThreeTheme();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
    }

    /* ==========================================================================
       INITIALIZATION
       ========================================================================== */
    window.addEventListener('DOMContentLoaded', () => {
        initArmillary();
        setupModeButtons();
        setup3DTiltCards();
        setupOscilloscope();
        setupThemeSwitching();
        animate(performance.now());
    });

})();
