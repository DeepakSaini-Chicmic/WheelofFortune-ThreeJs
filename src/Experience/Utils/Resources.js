import * as THREE from "three";
import EventEmitter from "./EventEmitter";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;

    //Loaded items object
    this.items = {};

    //remaining items count
    this.toLoad = this.sources.length;

    //Loaded items count
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    for (let source of this.sources) {
      // console.log(source);
      switch (source.type) {
        case "gltfModel":
          this.loaders.gltfLoader.load(source.path, (file) => {
            console.log("fox", file);
            this.sourceLoaded(source, file);
          });
          break;

        case "texture":
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;

        case "cubeTexture":
          this.loaders.cubeLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded == this.toLoad) {
      this.trigger("resourcesLoaded");
    }
  }
}
