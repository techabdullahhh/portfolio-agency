// 3D Floating Text using Three.js
let textScene, textCamera, textRenderer;
let textMesh = null;
let textObjects = [];

// Initialize 3D Text Scene
function init3DText() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas || !scene) return;

    // Create 3D Text
    createFloating3DText();
    
    // Create additional floating 3D elements
    createFloatingElements();
}

// Create Floating 3D Text (Name and Important Text)
function createFloating3DText() {
    if (!scene) return;
    
    // Create floating 3D name text
    createText3D('YOUR', new THREE.Vector3(-150, 200, -400), {
        size: 60,
        height: 10,
        color: 0xffffff
    });
    
    createText3D('NAME', new THREE.Vector3(150, 200, -400), {
        size: 60,
        height: 10,
        color: 0xf093fb
    });
    
    // Create portfolio text
    createText3D('PORTFOLIO', new THREE.Vector3(0, 0, -500), {
        size: 50,
        height: 8,
        color: 0x4facfe
    });
    
    // Create additional floating text elements
    createText3D('2024', new THREE.Vector3(300, -150, -350), {
        size: 35,
        height: 6,
        color: 0x00f2fe
    });
    
    createText3D('CREATIVE', new THREE.Vector3(-300, -150, -350), {
        size: 35,
        height: 6,
        color: 0xf093fb
    });
}

// Create 3D Text Mesh
function createText3D(text, position, options = {}) {
    const { size = 40, height = 10, color = 0xffffff } = options;
    
    // Create text shape using canvas texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    context.fillStyle = '#ffffff';
    context.font = 'bold 80px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create plane with text texture
    const geometry = new THREE.PlaneGeometry(size * text.length * 0.6, size);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    
    // Add glowing effect
    const glowGeometry = new THREE.PlaneGeometry(size * text.length * 0.65, size * 1.1);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.copy(position);
    glowMesh.position.z -= 1;
    
    scene.add(mesh);
    scene.add(glowMesh);
    
    textObjects.push({
        mesh: mesh,
        glow: glowMesh,
        originalPosition: position.clone(),
        speed: Math.random() * 0.02 + 0.01
    });
}

// Create Floating 3D Geometric Elements
function createFloatingElements() {
    // Floating spheres with text
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.SphereGeometry(30, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL((i * 0.2) % 1, 0.8, 0.6),
            emissive: new THREE.Color().setHSL((i * 0.2) % 1, 0.8, 0.4),
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(
            (Math.random() - 0.5) * 800,
            (Math.random() - 0.5) * 600,
            -400 + Math.random() * 200
        );
        
        scene.add(sphere);
        textObjects.push({
            mesh: sphere,
            originalPosition: sphere.position.clone(),
            speed: Math.random() * 0.03 + 0.02,
            rotationSpeed: Math.random() * 0.02 + 0.01
        });
    }
    
    // Floating torus with gradient
    const torusGeometry = new THREE.TorusGeometry(60, 20, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xf093fb,
        emissive: 0xf093fb,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(400, 200, -350);
    scene.add(torus);
    textObjects.push({
        mesh: torus,
        originalPosition: torus.position.clone(),
        speed: 0.025,
        rotationSpeed: 0.02
    });
    
    // Floating octahedron
    const octaGeometry = new THREE.OctahedronGeometry(50, 0);
    const octaMaterial = new THREE.MeshStandardMaterial({
        color: 0x4facfe,
        emissive: 0x4facfe,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.8
    });
    const octa = new THREE.Mesh(octaGeometry, octaMaterial);
    octa.position.set(-400, -200, -350);
    scene.add(octa);
    textObjects.push({
        mesh: octa,
        originalPosition: octa.position.clone(),
        speed: 0.02,
        rotationSpeed: 0.015
    });
}

// Animate Floating 3D Text and Elements
function animateFloatingText() {
    if (!textObjects.length) return;
    
    const time = Date.now() * 0.001;
    
    textObjects.forEach((obj, index) => {
        // Floating motion
        obj.mesh.position.y = obj.originalPosition.y + Math.sin(time * obj.speed + index) * 50;
        obj.mesh.position.x = obj.originalPosition.x + Math.cos(time * obj.speed * 0.7 + index) * 30;
        
        // Rotation
        if (obj.rotationSpeed) {
            obj.mesh.rotation.x += obj.rotationSpeed;
            obj.mesh.rotation.y += obj.rotationSpeed * 0.7;
        }
        
        // Pulsing scale
        const scale = 1 + Math.sin(time * 2 + index) * 0.1;
        obj.mesh.scale.set(scale, scale, scale);
        
        // Update glow if exists
        if (obj.glow) {
            obj.glow.position.y = obj.mesh.position.y;
            obj.glow.position.x = obj.mesh.position.x;
            obj.glow.rotation.z = time * 0.5;
        }
    });
}

// Update the main animate function to include text animation
const originalAnimate = window.animate;
if (typeof originalAnimate === 'function') {
    window.animate = function() {
        originalAnimate();
        animateFloatingText();
    };
}

// Initialize when scene is ready
setTimeout(() => {
    if (scene) {
        init3DText();
    }
}, 1000);

