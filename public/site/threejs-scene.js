// Three.js 3D Scene - Bright Futuristic Background for XYZ Agency
let scene, camera, renderer;
let scrollY = 0;
let objects3D = [];
let mouseX = 0;
let mouseY = 0;

// Initialize Three.js Scene
function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas) return;

    // Scene - Bright and futuristic
    scene = new THREE.Scene();
    scene.background = null; // Transparent for bright background

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
    );
    camera.position.z = 500;
    camera.position.y = 0;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Bright, futuristic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 1, 1000);
    pointLight1.position.set(300, 300, 300);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.8, 1000);
    pointLight2.position.set(-300, -300, 300);
    scene.add(pointLight2);
    
    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(0, 200, 100);
    scene.add(directionalLight);

    // Create futuristic 3D objects
    create3DObjects();

    // Handle resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse movement
    document.addEventListener('mousemove', onMouseMove);

    // Start animation
    animate();
}

// Create futuristic 3D objects
function create3DObjects() {
    // Main floating geometric shapes - bright and glowing
    const colors = [0x3b82f6, 0x06b6d4, 0x8b5cf6];
    
    // Large torus - subtle and bright
    const geometry1 = new THREE.TorusGeometry(100, 30, 16, 100);
    const material1 = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.3,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.2
    });
    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.set(400, 100, -300);
    mesh1.rotation.x = Math.PI / 4;
    scene.add(mesh1);
    objects3D.push(mesh1);

    // Octahedron - clean geometric shape
    const geometry2 = new THREE.OctahedronGeometry(70, 0);
    const material2 = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.25,
        metalness: 0.85,
        roughness: 0.15,
        transparent: true,
        opacity: 0.18
    });
    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.set(-400, 150, -250);
    scene.add(mesh2);
    objects3D.push(mesh2);

    // Sphere - smooth and bright
    const geometry3 = new THREE.SphereGeometry(80, 32, 32);
    const material3 = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x8b5cf6,
        emissiveIntensity: 0.2,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.15
    });
    const mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.position.set(0, -150, -200);
    scene.add(mesh3);
    objects3D.push(mesh3);
    
    // Icosahedron - geometric precision
    const geometry4 = new THREE.IcosahedronGeometry(60, 0);
    const material4 = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x06b6d4,
        emissiveIntensity: 0.22,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.16
    });
    const mesh4 = new THREE.Mesh(geometry4, material4);
    mesh4.position.set(-250, 200, -350);
    scene.add(mesh4);
    objects3D.push(mesh4);

    // Subtle floating particles - minimal and bright
    for (let i = 0; i < 15; i++) {
        const size = Math.random() * 6 + 3;
        const shapeType = Math.floor(Math.random() * 2);
        let geometry;
        
        if (shapeType === 0) {
            geometry = new THREE.TetrahedronGeometry(size);
        } else {
            geometry = new THREE.OctahedronGeometry(size);
        }
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
            metalness: 0.8,
            roughness: 0.2,
            transparent: true,
            opacity: Math.random() * 0.12 + 0.05
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 1500,
            (Math.random() - 0.5) * 800 - 100
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        scene.add(mesh);
        objects3D.push(mesh);
    }

    // Large wireframe sphere for depth - very subtle
    const wireframeGeometry = new THREE.SphereGeometry(200, 32, 32);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.08
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    wireframeMesh.position.set(0, 0, -600);
    scene.add(wireframeMesh);
    objects3D.push(wireframeMesh);
}

// Scroll-based animation - smooth and subtle
function updateScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    
    // Gentle camera movement
    camera.position.y = -scrollY * 0.2;
    camera.rotation.x = scrollY * 0.0002;
    camera.rotation.y = scrollY * 0.00015;

    // Subtle object movement
    objects3D.forEach((obj, index) => {
        if (index < 4) {
            obj.rotation.y = scrollY * 0.002 + index * Math.PI / 3;
            obj.rotation.x = scrollY * 0.0015 + index * Math.PI / 4;
            obj.position.y = Math.sin(scrollY * 0.006 + index) * 20;
            obj.position.z = -200 - scrollY * 0.15 + index * 50;
        } else if (index === objects3D.length - 1) {
            obj.rotation.y = scrollY * 0.0005;
            obj.rotation.x = scrollY * 0.0003;
        } else {
            obj.rotation.y += 0.003 + scrollY * 0.00003;
            obj.rotation.x += 0.002 + scrollY * 0.00002;
        }
    });
}

// Mouse movement tracking - subtle interaction
function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Gentle camera movement with mouse
    camera.position.x += (mouseX * 15 - camera.position.x) * 0.015;
    camera.position.y += (mouseY * 15 - camera.position.y) * 0.015;
}

// Animation loop - smooth and refined
function animate() {
    requestAnimationFrame(animate);

    // Update scroll effects
    updateScroll();

    // Gentle continuous motion
    const time = Date.now() * 0.0003;
    objects3D.forEach((obj, index) => {
        if (index < 4) {
            obj.rotation.y += 0.002;
            obj.rotation.x += 0.001;
            obj.position.y += Math.sin(time * 0.4 + index) * 0.15;
            obj.position.x += Math.cos(time * 0.3 + index) * 0.1;
        } else if (index === objects3D.length - 1) {
            obj.rotation.y += 0.0005;
            obj.rotation.x += 0.0003;
        } else {
            obj.rotation.y += 0.005;
            obj.rotation.x += 0.003;
            obj.position.y += Math.sin(time + index) * 0.08;
        }
    });

    // Render scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Smooth scroll listener
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeJS);
} else {
    initThreeJS();
}
