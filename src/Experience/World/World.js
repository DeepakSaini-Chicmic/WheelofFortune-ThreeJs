import Experience from "../Experience";

import Environment from "./Environment";
import { Movement } from "./Movement";
import WheelOfFortune from "./WheelOfFortune";
import * as THREE from "three";
export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.resources = this.experience.resources;

    this.resources.on("resourcesLoaded", () => {
      this.background = this.experience.resources.items["background"];
      this.background.encoding = THREE.sRGBEncoding;
      this.scene.background = this.background;
      this.wheelOfFortune = new WheelOfFortune();
      this.movement = new Movement();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.movement) {
      this.movement.update();
    }
  }
}
