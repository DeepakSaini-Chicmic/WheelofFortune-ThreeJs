import Experience from "../Experience";
import * as THREE from "three";
import { gsap } from "gsap";
import Renderer from "../Renderer";
import { GUI } from "lil-gui";
export default class WheelOfFortune {
  constructor() {
    this.gui = new GUI();
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
    this.mainGroup = new THREE.Group();
    this.experience.scene.add(this.mainGroup);
    this.nfts = [];
    this.particleGroup = new THREE.Group();
    this.mainGroup.add(this.particleGroup);
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
    this.scene = this.mainGroup;
    this.frameLights = [];
    this.spinMesh = null;
    this.colorsObject = {
      Color1: "#ffffff",
      Color2: "#6ff903",
      Color3: "#00b1f7",
      Color4: "#c11afb",
      Color5: "#f77b00",
      Color6: "#fde901",
    };
    this.colors = [
      this.colorsObject.Color1,
      this.colorsObject.Color2,
      this.colorsObject.Color3,
      this.colorsObject.Color4,
      this.colorsObject.Color5,
      this.colorsObject.Color6,
    ];

    //Frame
    this.createCircleFrame(this.wheel, 4, 78, new THREE.Vector3(), "frame");
    //Wheel

    this.wedgeGroup = new THREE.Group();
    this.showWedges();
    this.addStick();

    this.wedgeGroup.position.setY(-0.22);
    this.mainGroup.add(this.wedgeGroup);

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
      Math.sin((startAngle + endAngle) / 2) * (radius - 0.7);
    newSquare.position.y =
      Math.cos((startAngle + endAngle) / 2) * (radius - 0.7);
    // newSquare.rotation.z = 0.5;
    return newSquare;
  }

  addPointer() {
    this.pointerContainer = new THREE.Group();
    this.pointerContainer.position.set(0, 3.7, 0.25); // Set position in one call
    this.mainGroup.add(this.pointerContainer);

    const pointerGeometry = new THREE.PlaneGeometry(0.97, 1.5);
    const pointerMaterial = new THREE.MeshBasicMaterial({
      map: this.pointer,
      transparent: true,
    });
    this.pointerMesh = new THREE.Mesh(pointerGeometry, pointerMaterial);
    this.pointerMesh.position.setY(-0.3); // Set position in one call

    this.pointerContainer.add(this.pointerMesh); // Add the pointer mesh to the container
  }

  addButton = () => {
    const spinGeometry = new THREE.PlaneGeometry(1.6, 1);
    const spinMaterial = new THREE.MeshBasicMaterial({
      map: this.spinTextButton,
      transparent: true,
    });
    this.spinMesh = new THREE.Mesh(spinGeometry, spinMaterial);
    this.spinMesh.position.setZ(0.1);
    this.spinMesh.position.setY(-0.12);
    this.mainGroup.add(this.spinMesh);
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
    this.numOfWedges = 19;
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
    let squareGroup = new THREE.Group();
    this.wedgeGroup.add(squareGroup);
    squareGroup.add(sequare);
    squareGroup.rotation.z = 0.1;
    this.wedgeGroup.add(mesh);
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
    frameLights.position.x = Math.sin(startAngle) * (radius + 0.35);
    frameLights.position.y = Math.cos(startAngle) * (radius + 0.35) - 0.23;
    this.frameLights.push(frameLights);
    this.frameLightsGroup = new THREE.Group();
    this.mainGroup.add(this.frameLightsGroup);
    this.frameLightsGroup.add(frameLights);
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
    this.circle = new THREE.Mesh(geometry, material);
    this.circle.name = name;
    this.circle.scale.set(1.04, 1, 1);
    this.spinButton = this.circle;
    this.circle.position.set(position.x, position.y, position.z);
    this.mainGroup.add(this.circle);
  }

  createParticlesGeometryAndMaterial() {
    let particlesGeometry = new THREE.BufferGeometry();
    let particlesCount = 1000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
    });

    this.addParticles(particlesGeometry, particlesMaterial);
  }

  addParticles(particlesGeometry, particlesMaterial) {
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.z = 1;
    this.particleGroup.add(particles);
    this.particleGroup.scale.set(0, 0);
    this.particleGroup.position.y = 5;
    this.particleGroup.position.z = 0.6;
  }

  rotateWheel() {
    //Pointer tween
    // this.startLightsAnimation();
    gsap
      .to(this.pointerContainer.rotation, {
        duration: 1,
        z: 1,
        repeat:
          this.numOfWedges *
          (360 * (Math.PI / 180) * 4 +
            (this.wedgeAngles[this.colorsObject.Color4] * (Math.PI / 180) -
              90 * (Math.PI / 180))),
      })
      .then(
        gsap.to(this.pointerContainer.rotation, {
          delay: 0.2,
          duration: 0.2,
          z: 0,
          repeat: this.numOfWedges,
        })
      );
    this.zoomInAnimation();
    gsap
      .to(this.wedgeGroup.rotation, {
        duration: 5,
        z: -(
          360 * (Math.PI / 180) * 4 +
          (this.wedgeAngles[this.colorsObject.Color4] * (Math.PI / 180) -
            90 * (Math.PI / 180))
        ),
      })
      .then(() => {
        gsap.killTweensOf(this.pointerContainer.rotation);
        this.pointerContainer.rotation.set(0, 0, 0);
        this.nFTLayer();
      });
  }

  startLightsAnimation() {
    let i = 0;
    setInterval(() => {
      this.changeLights(this.frameLights[i]);
      this.changeLights(this.frameLights[i + 1]);
      this.changeLights(this.frameLights[i + 2]);
      setTimeout(() => {
        this.changeLights(this.frameLights[i]);
        this.changeLights(this.frameLights[i + 1]);
        this.changeLights(this.frameLights[i + 2]);
      }, 100);
      if (i > this.numOfWedges) {
        i = 0;
      } else i++;
    }, 250);
  }

  endingLightsAnimation() {
    let iterationCount = 1;

    // Maximum number of iterations
    const maxIterations = 3;
    let i = 0;
    setInterval(() => {
      setTimeout(() => {
        i = 4;
        this.changeLights(this.frameLights[i]);
        this.changeLights(this.frameLights[this.frameLights.length - i]);
        setTimeout(() => {
          i = 3;
          this.changeLights(this.frameLights[i]);
          this.changeLights(this.frameLights[this.frameLights.length - i]);
          setTimeout(() => {
            i = 2;
            this.changeLights(this.frameLights[i]);
            this.changeLights(this.frameLights[this.frameLights.length - i]);
            setTimeout(() => {
              i = 1;
              console.log(iterationCount);
              this.changeLights(this.frameLights[i]);
              this.changeLights(this.frameLights[this.frameLights.length - i]);
            }, 450);
          }, 300);
        }, 150);
      }, 50);
    }, 600);
  }
  zoomInAnimation() {
    gsap.to(this.mainGroup.scale, { duration: 0.3, x: 2, y: 2 });
    gsap.to(this.mainGroup.position, { duration: 0.3, y: -4.5 });
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
    nftLayer.position.y = 0;
    nftLayer.scale.set(0, 0, 0);
    this.mainGroup.add(nftLayer);
    this.nftLayerAnimation(nftLayer);
    this.createParticlesGeometryAndMaterial();
  }
  nftLayerAnimation(winner) {
    this.endingLightsAnimation();
    gsap.to(winner.position, { duration: 0.5, y: 2.5 });
    gsap.to(winner.scale, { duration: 0.5, x: 0.75, y: 0.75 }).then(() => {
      gsap
        .to(winner.scale, { delay: 2, duration: 0.5, x: 0, y: 0 })
        .then(() => {
          winner.geometry.dispose();
          winner.material.dispose();
          this.mainGroup.remove(winner);
        });
    });
    gsap
      .to(this.particleGroup.scale, {
        duration: 2.5,
        x: 10,
        y: 10,
      })
      .then(() => {
        this.particleGroup.children[0].geometry.dispose();
        this.particleGroup.children[0].material.dispose();
        this.particleGroup.remove(this.particleGroup.children[0]);
      });
  }
  changeLights(lights) {
    if (lights.material.map == this.diamond) {
      lights.material.map = this.diamondGlow;
      lights.scale.set(4, 4, 4);
    } else {
      lights.material.map = this.diamond;
      lights.scale.set(1, 1, 1);
    }
    lights.material.needsUpdate = true;
  }
}
