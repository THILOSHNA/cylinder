import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

//
// canvas
//
const canvas = document.querySelector(".webgl");

let play_button = document.getElementById("play");

let text = document.getElementById("text");

//
// essential variables
//

let animation_0;
let animation_1;
let animation_2;
let animation_3;

//
// scene
//
const scene = new THREE.Scene();
//
// camera parameters
//
let fov = 60;
let aspectRatio = window.innerWidth / window.innerHeight;
let far = 1000;
let near = 0.01;

//
// renderer
//
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//
// camera
//
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.z = 1;

//
// orbitcontrols
//
const controls = new OrbitControls(camera, canvas);

//
// volume function
//

var audio = document.getElementById("myAudio");

var breaking_Audio = document.getElementById("breakAudio");

console.log(audio);
if (audio) {
  audio.volume = 0.1;
  var maxVolume = 1;
  var currentVolume = 0;
  play_button.addEventListener("click", () => {
    play_button.style.display = "none";
    text.style.display = "block";
    audio.play();

    setTimeout(() => {
      text.style.display = "none";
    }, 3000);
  });
}

//
// loader
//
const loader = new GLTFLoader();
let cylinder;
// let mixers = [];
let animationMixer;
loader.load(
  "scene (23).glb",
  function (gltf) {
    cylinder = gltf.scene;
    cylinder.rotation.y = Math.PI + 0.5;
    cylinder.position.x = 0.05;
    let children = cylinder.children[0].children[1].children;

    scene.add(cylinder);
    console.log(children);

    // Retrieve animations from the loaded GLTF object
    const animations = gltf.animations;
    console.log(animations);

    animationMixer = new THREE.AnimationMixer(cylinder);

    //  break 1 //
    animation_0 = animationMixer.clipAction(animations[0]);
    animation_0.setLoop(THREE.LoopOnce);
    animation_0.clampWhenFinished = true;

    //  break 2 //
    animation_1 = animationMixer.clipAction(animations[1]);
    animation_1.setLoop(THREE.LoopOnce);
    animation_1.clampWhenFinished = true;

    //  break 3//
    animation_2 = animationMixer.clipAction(animations[2]);
    animation_2.clampWhenFinished = true;
    animation_2.setLoop(THREE.LoopOnce);

    //  break 4 //
    animation_3 = animationMixer.clipAction(animations[3]);
    animation_3.setLoop(THREE.LoopOnce);
    animation_3.clampWhenFinished = true;
  },

  undefined,
  function (error) {
    console.error(error);
  }
);

//
//raycast
//
const rayCaster = new THREE.Raycaster();
function onSelect(event) {
  rayCaster.setFromCamera(
    {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    },
    camera
  );
  const intersects = rayCaster.intersectObject(cylinder, true);
  if (intersects.length > 0) {
    const selectedObject_Name = intersects[0].object.name;
    console.log(selectedObject_Name);

    if (
      selectedObject_Name === "11" ||
      selectedObject_Name === "12" ||
      selectedObject_Name === "13"
    ) {
      increaseVolume();
      animation_0.play();
      breaking_Audio.play();
    } else if (
      selectedObject_Name === "21" ||
      selectedObject_Name === "22" ||
      selectedObject_Name === "23" ||
      selectedObject_Name === "24"
    ) {
      increaseVolume();
      animation_1.play();

      breaking_Audio.play();
    } else if (
      selectedObject_Name === "31" ||
      selectedObject_Name === "32" ||
      selectedObject_Name === "33" ||
      selectedObject_Name === "34"
    ) {
      increaseVolume();
      animation_2.play();
      breaking_Audio.play();
    } else if (
      selectedObject_Name === "41" ||
      selectedObject_Name === "42" ||
      selectedObject_Name === "43" ||
      selectedObject_Name === "44"
    ) {
      increaseVolume();
      animation_3.play();
      breaking_Audio.play();
    }
  }
}
window.addEventListener("dblclick", onSelect, false);

function increaseVolume() {
  if (currentVolume < maxVolume) {
    currentVolume = Math.min(maxVolume, currentVolume + 0.2);
    audio.volume = currentVolume;
    console.log(currentVolume);
  }
}

//
// Ambient Light
//
const ambientLight = new THREE.AmbientLight(0xaf8260, 5);
scene.add(ambientLight);
//
//directionLight
//
const directionLight = new THREE.DirectionalLight(0xffffff, 5);
scene.add(directionLight);

//
// window resize
//

window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//
// animation funtion
//
const clock = new THREE.Clock();
function animate() {
  if (animationMixer) {
    animationMixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
