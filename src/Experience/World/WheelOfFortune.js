import Experience from "../Experience";
import * as THREE from "three";
import { gsap } from "gsap";
import Renderer from "../Renderer";
export default class WheelOfFortune {
  constructor() {
    this.wedgeAngles = {};
    this.renderer = new Renderer();
    this.experience = new Experience();
    this.wheel = this.experience.resources.items["frame"];
    this.spinCircleButton = this.experience.resources.items["centerFrame"];
    this.rightStick = this.experience.resources.items["rightStick"];
    this.leftStick = this.experience.resources.items["leftStick"];
    this.spinTextButton = this.experience.resources.items["spinButton"];
    this.pointer = this.experience.resources.items["pointer"];
    this.diamond = this.experience.resources.items["diamond"];
    this.diamondGlow = this.experience.resources.items["diamondGlow"];
    this.square = this.experience.resources.items["square"];
    this.diamond.name = "Light off";
    this.diamondGlow.name = "Light on";
    this.nfts = [];
    let i = 0;
    Object.keys(this.experience.resources.items).forEach((element) => {
      if (element.slice(0, 4) == "SMB ") {
        this.nfts[i] = this.experience.resources.items[element];
        this.setWheelTexture(this.nfts[i]);
        i++;
      }
    });

    this.setWheelTexture(this.wheel);
    this.setWheelTexture(this.spinTextButton);
    this.setWheelTexture(this.spinCircleButton);
    this.setWheelTexture(this.leftStick);
    this.setWheelTexture(this.rightStick);
    this.setWheelTexture(this.pointer);
    this.setWheelTexture(this.diamond);
    this.setWheelTexture(this.diamondGlow);
    this.setWheelTexture(this.square);

    // this.setWheelTexture(this.spinButton);
    this.scene = this.experience.scene;
    this.frameLights = [];
    this.colors = [
      "red",
      "orange",
      "yellow",
      "brown",
      "green",
      "blue",
      "indigo",
      "violet",
      "purple",
      "pink",
      "gray",
      "white",
      "cyan",
      "magenta",
    ];

    //Frame
    this.createCircleFrame(this.wheel, 4, 78, new THREE.Vector3(), "frame");
    this.createFrameLights();
    //Wheel

    this.wedgeGroup = new THREE.Group();
    this.showWedges();
    this.addStick();

    this.wedgeGroup.position.setY(-0.22);
    this.scene.add(this.wedgeGroup);

    // spin button frame
    this.createCircleFrame(
      this.spinCircleButton,
      0.96,
      78,
      new THREE.Vector3(0, -0.22, 0.02),
      "spin"
    );

    this.addButton();
    this.addPointer();
    console.log(this.wedgeAngles);
  }

  createSquare(startAngle, endAngle, radius) {
    // console.log("ghello");
    let newSquare = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.2, 10, 10),
      new THREE.MeshBasicMaterial({ map: this.square, transparent: true })
    );
    newSquare.position.z = 0.6;
    newSquare.position.x =
      Math.sin((startAngle + endAngle) / 2) * (radius - 0.8);
    newSquare.position.y =
      Math.cos((startAngle + endAngle) / 2) * (radius - 0.8);
    // this.frameLights.position.y = -radius;
    return newSquare;
  }

  addPointer() {
    this.pointerContainer = new THREE.Group();
    this.pointerContainer.position.set(0, 3.7, 0.25); // Set position in one call
    this.scene.add(this.pointerContainer);

    const pointerGeometry = new THREE.PlaneGeometry(0.97, 1.5);
    const pointerMaterial = new THREE.MeshBasicMaterial({
      map: this.pointer,
      transparent: true,
    });
    this.pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);
    this.pointerMesh.position.setY(-0.3); // Set position in one call

    this.pointerContainer.add(this.pointerMesh); // Add the pointer mesh to the container
  }
  // nftsArrayPush = (nft) => {
  //   this.nfts.push(nft);
  // };

  addButton = () => {
    const spinGeometry = new THREE.PlaneGeometry(1.4, 1.2);
    const spinMaterial = new THREE.MeshBasicMaterial({
      map: this.spinTextButton,
      transparent: true,
    });
    const spinMesh = new THREE.Mesh(spinGeometry, spinMaterial);
    spinMesh.position.setZ(0.1);
    spinMesh.position.setY(-0.12);
    this.scene.add(spinMesh);
  };

  addStick(rotation) {
    const group = new THREE.Group();
    group.rotation.z = rotation;

    const planeGeometry = new THREE.PlaneGeometry(0.15, 3.5, 100, 100);

    const material = new THREE.MeshBasicMaterial({
      map: this.leftStick,
      transparent: true,
    });
    const material2 = new THREE.MeshBasicMaterial({
      map: this.rightStick,
      transparent: true,
    });

    const mesh = new THREE.Mesh(planeGeometry, material);
    const mesh2 = new THREE.Mesh(planeGeometry, material2);

    mesh.position.set(1.75, -0.04, 0.01);
    mesh.rotation.z = -Math.PI / 2;

    mesh2.position.set(1.75, 0.04, 0.01);
    mesh2.rotation.z = -Math.PI / 2;

    group.add(mesh, mesh2);
    this.wedgeGroup.add(group);
  }

  showWedges() {
    this.numOfWedges = 20;
    const wedgeAngle = 360 / this.numOfWedges;
    const colorsLength = this.colors.length;

    for (let i = 0; i < this.numOfWedges; i++) {
      const colorIndex = i % colorsLength;
      const color = this.colors[colorIndex];
      if (this.wedgeAngles[color] === undefined) {
        this.wedgeAngles[color] = (i + 0.5) * wedgeAngle;
      }

      this.createShape(3.3, i * wedgeAngle, (i + 1) * wedgeAngle, color);
    }
  }

  createShape(radiuss, startAnglee, endAnglee, color) {
    const shape = new THREE.Shape();

    const centerX = 0;
    const centerY = -0.12;

    const radius = radiuss;

    const startAngle = startAnglee * (Math.PI / 180);

    const endAngle = endAnglee * (Math.PI / 180);

    const curve = new THREE.EllipseCurve(
      centerX,
      centerY, // center of the ellipse
      radius,
      radius, // x and y radii of the ellipse
      startAngle,
      endAngle, // start and end angles of the sector
      false, // clockwise (false for counterclockwise)
      0 // rotation angle
    );

    const path = new THREE.Path(curve.getPoints(100));
    shape.moveTo(centerX, centerY);
    shape.lineTo(path.getPoints()[0].x, path.getPoints()[0].y);
    shape.curves.push(curve);
    const closure = new THREE.LineCurve(
      path.getPoints()[path.getPoints().length - 1], // Last point of the arc
      new THREE.Vector2(centerX, centerY) // Center of the circle
    );
    shape.curves.push(closure);
    const shapeGeometry = new THREE.ShapeGeometry(shape);
    const material = new THREE.MeshBasicMaterial({ color: color }); // Red color for example
    const mesh = new THREE.Mesh(shapeGeometry, material);
    mesh.position.setZ(0.01);
    mesh.position.setY(0.12);
    mesh.name = "colorWedge";
    this.addStick(startAngle);
    this.createFrameLights(startAngle, radius);
    let sequare = this.createSquare(startAngle, endAngle, radius);
    this.wedgeGroup.add(mesh, sequare);
  }
  setWheelTexture(texture) {
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.encoding = THREE.sRGBEncoding;
  }
  createFrameLights(startAngle, radius) {
    let frameLights = new THREE.Mesh(
      new THREE.PlaneGeometry(0.2, 0.2, 10, 10),
      new THREE.MeshBasicMaterial({ map: this.diamond, transparent: true })
    );
    frameLights.position.z = 0.01;
    frameLights.position.x = Math.sin(startAngle) * (radius + 0.22);
    frameLights.position.y = Math.cos(startAngle) * (radius + 0.375) - 0.22;
    this.frameLights.push(frameLights);
    this.experience.scene.add(frameLights);
  }
  createCircleFrame(
    texture,
    radius,
    segments,
    position = new THREE.Vector3(0, 0, 0),
    name
  ) {
    const geometry = new THREE.CircleGeometry(radius, segments);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.name = name;
    this.spinButton = circle;
    circle.position.set(position.x, position.y, position.z);
    this.scene.add(circle);
  }

  rotateWheel() {
    gsap
      .to(this.spinButton.scale, {
        duration: 0.1,
        x: 1.12,
        y: 1.12,
        z: 1.12,
      })
      .then(() => {
        // window.removeEventListener("click", this.rotateWheel);
        gsap.to(this.spinButton.scale, {
          delay: 0.02,
          duration: 0.1,
          x: 1,
          y: 1,
          z: 1,
        });
      });
    //Pointer tween
    gsap
      .to(this.pointerContainer.rotation, {
        duration: 0.7,
        z: 1,
        repeat: this.numOfWedges * Math.PI * 4,
      })
      .then(
        gsap.to(this.pointerContainer.rotation, {
          delay: 0.2,
          duration: 0.2,
          z: 0,
          repeat: this.numOfWedges * Math.PI,
        })
      );
    setInterval(() => {
      console.log(this.frameLights);
      this.changeLights(this.frameLights[4]);
    }, 200);
    gsap
      .to(this.wedgeGroup.rotation, {
        duration: 5,
        z: -(
          360 * (Math.PI / 180) * 4 +
          (this.wedgeAngles["red"] * (Math.PI / 180) - 90 * (Math.PI / 180))
        ),
      })
      .then(() => {
        gsap.killTweensOf(this.pointerContainer.rotation);
        this.pointerContainer.rotation.set(0, 0, 0);
        this.nFTLayer();
      });
  }
  nFTLayer() {
    const nftLayer = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 3, 10, 10),
      new THREE.MeshBasicMaterial({
        map: this.nfts[Math.floor(Math.random() * 19)],
        transparent: true,
      })
    );
    nftLayer.name = "nftLayer";
    nftLayer.position.z = 1;
    nftLayer.scale.set(0, 0, 0);
    this.experience.scene.add(nftLayer);
    this.nftLayerAnimation(nftLayer);
  }
  nftLayerAnimation(winner) {
    gsap.to(winner.scale, { duration: 0.5, x: 1, y: 1, z: 1 }).then(() => {
      gsap
        .to(winner.scale, { delay: 2, duration: 0.5, x: 0, y: 0, z: 0 })
        .then(() => {
          // console.log(this.experience.scene);
          winner.geometry.dispose();
          winner.material.dispose();
          this.scene.remove(winner);
        });
    });
  }
  changeLights(lights) {
    console.log(lights.material.map);
    if (lights.material.map == this.diamond) {
      lights.material.map = this.diamondGlow;
    } else {
      lights.material.map = this.diamond;
    }
    lights.material.needsUpdate = true;
  }
  // update = () => {
  //   requestAnimationFrame(this.update);
  //   // Update the texture map based on time or any other condition
  //   console.log(this.frameLights.material.map);
  //   const time = Date.now() * 0.001; // Example: time-based animation
  //   if (time % 2 > 1) {
  //     console.log(this.frameLights.material.map);
  //     this.frameLights.material.map = this.diamond;
  //   } else {
  //     console.log(this.frameLights.material.map);
  //     this.frameLights.material.map = this.diamondGlow;
  //   }
  //   this.frameLights.material.needsUpdate = true;
  // };
}
