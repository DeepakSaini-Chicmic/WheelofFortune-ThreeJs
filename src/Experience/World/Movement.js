import * as THREE from "three";
import Experience from "../Experience";

export class Movement {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.experience = new Experience();
    this.camera = this.experience.camera;

    this.isIntersected = [];
    this.mouse = new THREE.Vector2(0, 0);
    this.setMouseEvents();
  }

  setMouseEvents() {
    window.addEventListener(
      "click",
      (e) => {
        this.onMouseClick(e);
      },
      false
    );
    window.addEventListener(
      "mousemove",
      (e) => {
        this.onMouseMove(e);
      },
      false
    );
  }

  onMouseClick = (event) => {
    // console.log(this.touchabeobjects);
    if (this.isIntersected.length) {
    //   console.log("Mesh clicked!", this.isIntersected[0]);
      if (this.isIntersected[0].object.name == "spin") {
        this.experience.world.wheelOfFortune.rotateWheel();
      }
    }
  };

  onMouseMove = (event) => {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -1 * (event.clientY / window.innerHeight) * 2 + 1;
  };
  update() {
    this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
    this.isIntersected = this.raycaster.intersectObjects([
      this.experience.world.wheelOfFortune.spinButton,
    ]);
    // console.log(this.experience.world.wheelOfFortune.spinButton);
  }
}
