/* =========================================
   KNOX 3D
   Interactive Three.js Experience
========================================= */

const canvas = document.getElementById("threeCanvas");

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(0x030303, 0.035);


/* =========================================
   CAMERA
========================================= */

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 8);


/* =========================================
   RENDERER
========================================= */

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


/* =========================================
   LIGHTING
========================================= */

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.5
);

scene.add(ambientLight);

const pointLight = new THREE.PointLight(
  0xffffff,
  15,
  30
);

pointLight.position.set(0, 0, 3);

scene.add(pointLight);


/* =========================================
   CENTRAL 3D OBJECT
========================================= */

const coreGeometry =
  new THREE.IcosahedronGeometry(1.25, 2);

const coreMaterial =
  new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.15,
    wireframe: false
  });

const core =
  new THREE.Mesh(
    coreGeometry,
    coreMaterial
  );

scene.add(core);


/* =========================================
   WIREFRAME OUTER CORE
========================================= */

const wireGeometry =
  new THREE.IcosahedronGeometry(1.7, 2);

const wireMaterial =
  new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });

const wire =
  new THREE.Mesh(
    wireGeometry,
    wireMaterial
  );

scene.add(wire);


/* =========================================
   ROTATING RINGS
========================================= */

const rings = [];

for (let i = 0; i < 3; i++) {

  const geometry =
    new THREE.TorusGeometry(
      2 + i * 0.35,
      0.012,
      16,
      150
    );

  const material =
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35 - i * 0.08
    });

  const ring =
    new THREE.Mesh(
      geometry,
      material
    );

  ring.rotation.x =
    Math.random() * Math.PI;

  ring.rotation.y =
    Math.random() * Math.PI;

  ring.rotation.z =
    Math.random() * Math.PI;

  scene.add(ring);

  rings.push(ring);
}


/* =========================================
   PARTICLES
========================================= */

const particleCount = 2500;

const positions =
  new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {

  const radius =
    4 + Math.random() * 18;

  const theta =
    Math.random() * Math.PI * 2;

  const phi =
    Math.acos(
      2 * Math.random() - 1
    );

  positions[i * 3] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);

  positions[i * 3 + 1] =
    radius *
    Math.sin(phi) *
    Math.sin(theta);

  positions[i * 3 + 2] =
    radius *
    Math.cos(phi);
}

const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);

const particleMaterial =
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.025,
    transparent: true,
    opacity: 0.7
  });

const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);


/* =========================================
   MOUSE / TOUCH MOVEMENT
========================================= */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

window.addEventListener(
  "mousemove",
  (event) => {

    mouseX =
      (event.clientX /
        window.innerWidth) *
        2 - 1;

    mouseY =
      (event.clientY /
        window.innerHeight) *
        2 - 1;
  }
);


window.addEventListener(
  "touchmove",
  (event) => {

    if (!event.touches.length) return;

    mouseX =
      (event.touches[0].clientX /
        window.innerWidth) *
        2 - 1;

    mouseY =
      (event.touches[0].clientY /
        window.innerHeight) *
        2 - 1;
  },
  { passive: true }
);


/* =========================================
   ENTER BUTTON
========================================= */

const enterBtn =
  document.getElementById("enterBtn");

const exploreBtn =
  document.getElementById("exploreBtn");

function enterWorld() {

  camera.position.z = 4;

  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth"
  });
}

enterBtn.addEventListener(
  "click",
  enterWorld
);

exploreBtn.addEventListener(
  "click",
  enterWorld
);


/* =========================================
   INFO PANEL
========================================= */

const infoBtn =
  document.getElementById("infoBtn");

const infoPanel =
  document.getElementById("infoPanel");

const closeInfo =
  document.getElementById("closeInfo");

infoBtn.addEventListener(
  "click",
  () => {
    infoPanel.classList.add("show");
  }
);

closeInfo.addEventListener(
  "click",
  () => {
    infoPanel.classList.remove("show");
  }
);


/* =========================================
   ANIMATION
========================================= */

const clock =
  new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const time =
    clock.getElapsedTime();


  /* Core rotation */

  core.rotation.x =
    time * 0.18;

  core.rotation.y =
    time * 0.25;


  /* Outer wire */

  wire.rotation.x =
    -time * 0.12;

  wire.rotation.y =
    time * 0.16;


  /* Rings */

  rings.forEach(
    (ring, index) => {

      ring.rotation.x +=
        0.0015 * (index + 1);

      ring.rotation.y +=
        0.002 * (index + 1);

      ring.rotation.z +=
        0.0008 * (index + 1);
    }
  );


  /* Particles */

  particles.rotation.y =
    time * 0.015;

  particles.rotation.x =
    Math.sin(time * 0.1) * 0.05;


  /* Smooth mouse camera */

  targetX = mouseX * 0.8;
  targetY = mouseY * 0.5;

  camera.position.x +=
    (targetX - camera.position.x) *
    0.025;

  camera.position.y +=
    (-targetY - camera.position.y) *
    0.025;

  camera.lookAt(0, 0, 0);


  /* Floating core */

  core.position.y =
    Math.sin(time * 1.2) * 0.15;

  wire.position.y =
    core.position.y;


  renderer.render(
    scene,
    camera
  );
}

animate();


/* =========================================
   RESPONSIVE RESIZE
========================================= */

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);


/* =========================================
   LOADING SCREEN
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      const loader =
        document.getElementById("loader");

      loader.classList.add("hide");

    }, 2400);
  }
);
