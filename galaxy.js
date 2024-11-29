const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(100);

const galaxyParams = {
  count: 30000,
  size: 0.1,
  radius: 100,
  branches: 5,
  spin: 0.5,
  randomness: 0.3,
  randomnessPower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

let particlesGeometry, particlesMaterial, galaxy;

function generateGalaxy() {
  if (galaxy) {
    particlesGeometry.dispose();
    particlesMaterial.dispose();
    scene.remove(galaxy);
  }

  particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(galaxyParams.count * 3);
  const colors = new Float32Array(galaxyParams.count * 3);

  const colorInside = new THREE.Color(galaxyParams.insideColor);
  const colorOutside = new THREE.Color(galaxyParams.outsideColor);

  for (let i = 0; i < galaxyParams.count; i++) {
    const i3 = i * 3;

    const radius = Math.random() * galaxyParams.radius;
    const spinAngle = radius * galaxyParams.spin;
    const branchAngle =
      ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / galaxyParams.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  particlesMaterial = new THREE.PointsMaterial({
    size: galaxyParams.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  galaxy = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(galaxy);

  galaxy.rotation.x = Math.PI / 30;
  galaxy.rotation.y = Math.PI / 6;
}

generateGalaxy();

function animate() {
  requestAnimationFrame(animate);

  galaxy.rotation.y += 0.001;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
