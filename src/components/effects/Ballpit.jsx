"use client";

import { useEffect, useRef } from "react";
import {
  Vector3 as Vec3,
  MeshBasicMaterial,
  InstancedMesh,
  Group,
  Timer,
  PlaneGeometry,
  Scene,
  Object3D,
  SRGBColorSpace,
  MathUtils,
  TextureLoader,
  DoubleSide,
  Vector2,
  WebGLRenderer,
  PerspectiveCamera,
  ACESFilmicToneMapping,
  Plane,
  Raycaster,
} from "three";

class ThreeScene {
  #options;
  #postprocessing;
  #intersectionObserver;
  #resizeObserver;
  #resizeTimeout;
  #frame;
  #timer = new Timer();
  #time = { elapsed: 0, delta: 0 };
  #isVisible = false;
  #isRunning = false;

  canvas;
  camera;
  cameraMinAspect;
  cameraMaxAspect;
  cameraFov;
  maxPixelRatio;
  minPixelRatio;
  scene;
  renderer;
  render = this.#renderScene;
  onBeforeRender = () => {};
  onAfterResize = () => {};
  isDisposed = false;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };

  constructor(options) {
    this.#options = { ...options };
    this.#setupCamera();
    this.#setupScene();
    this.#setupRenderer();
    this.resize();
    this.#setupEvents();
  }

  #setupCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #setupScene() {
    this.scene = new Scene();
  }

  #setupRenderer() {
    this.canvas = this.#options.canvas ?? document.getElementById(this.#options.id);
    if (!this.canvas) {
      throw new Error("Ballpit: missing canvas element.");
    }
    this.canvas.style.display = "block";
    const rendererOptions = { antialias: true, alpha: true, ...(this.#options.rendererOptions ?? {}) };
    const contextAttributes = { ...rendererOptions, powerPreference: "high-performance" };
    const context =
      this.canvas.getContext("webgl2", contextAttributes) || this.canvas.getContext("webgl", contextAttributes);

    if (!isWebGLContextUsable(context)) {
      throw new Error("Ballpit: WebGL context is not usable.");
    }

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      context,
      powerPreference: "high-performance",
      ...rendererOptions,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #setupEvents() {
    if (!(this.#options.size instanceof Object)) {
      window.addEventListener("resize", this.#handleResize);
      if (this.#options.size === "parent" && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#handleResize);
        this.#resizeObserver.observe(this.canvas.parentNode);
      }
    }

    this.#intersectionObserver = new IntersectionObserver(this.#handleIntersection, {
      root: null,
      rootMargin: "0px",
      threshold: 0,
    });
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#handleVisibility);
  }

  #clearEvents() {
    window.removeEventListener("resize", this.#handleResize);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.#handleVisibility);
  }

  #handleIntersection = (entries) => {
    this.#isVisible = entries[0].isIntersecting;
    this.#isVisible ? this.#start() : this.#stop();
  };

  #handleVisibility = () => {
    if (this.#isVisible) {
      document.hidden ? this.#stop() : this.#start();
    }
  };

  #handleResize = () => {
    if (this.#resizeTimeout) clearTimeout(this.#resizeTimeout);
    this.#resizeTimeout = window.setTimeout(() => this.resize(), 100);
  };

  resize() {
    let width;
    let height;

    if (this.#options.size instanceof Object) {
      width = this.#options.size.width;
      height = this.#options.size.height;
    } else if (this.#options.size === "parent" && this.canvas.parentNode) {
      width = this.canvas.parentNode.offsetWidth;
      height = this.canvas.parentNode.offsetHeight;
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }

    this.size.width = Math.max(1, width);
    this.size.height = Math.max(1, height);
    this.size.ratio = this.size.width / this.size.height;
    this.#updateCamera();
    this.#updateRendererSize();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #adjustFov(aspect) {
    const tan = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(tan));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fov = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    } else if (this.camera.isOrthographicCamera) {
      this.size.wHeight = this.camera.top - this.camera.bottom;
      this.size.wWidth = this.camera.right - this.camera.left;
    }
  }

  #updateRendererSize() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }

  set postprocessing(postprocessing) {
    this.#postprocessing = postprocessing;
    this.render = postprocessing.render.bind(postprocessing);
  }

  #start() {
    if (this.#isRunning) return;

    const animate = () => {
      this.#frame = requestAnimationFrame(animate);
      this.#timer.update();
      this.#time.delta = this.#timer.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
    };

    this.#isRunning = true;
    this.#timer.reset();
    animate();
  }

  #stop() {
    if (!this.#isRunning) return;
    cancelAnimationFrame(this.#frame);
    this.#isRunning = false;
  }

  #renderScene() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((item) => {
      if (item.isMesh && typeof item.material === "object" && item.material !== null) {
        Object.keys(item.material).forEach((key) => {
          const value = item.material[key];
          if (value !== null && typeof value === "object" && typeof value.dispose === "function") {
            value.dispose();
          }
        });
        item.material.dispose();
        item.geometry.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#clearEvents();
    this.#stop();
    this.#timer.dispose();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.isDisposed = true;
  }
}

const interactionRegistry = new Map();
const pointerPosition = new Vector2();
let isInteractionListening = false;

function createInteraction(options) {
  const interaction = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter() {},
    onMove() {},
    onClick() {},
    onLeave() {},
    ...options,
  };

  interactionRegistry.set(options.domElement, interaction);
  if (!isInteractionListening) {
    document.body.addEventListener("pointermove", handlePointerMove);
    document.body.addEventListener("pointerleave", handlePointerLeave);
    document.body.addEventListener("click", handleClick);
    document.body.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.body.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.body.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.body.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    isInteractionListening = true;
  }

  interaction.dispose = () => {
    interactionRegistry.delete(options.domElement);
    if (interactionRegistry.size === 0) {
      document.body.removeEventListener("pointermove", handlePointerMove);
      document.body.removeEventListener("pointerleave", handlePointerLeave);
      document.body.removeEventListener("click", handleClick);
      document.body.removeEventListener("touchstart", handleTouchStart);
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.removeEventListener("touchend", handleTouchEnd);
      document.body.removeEventListener("touchcancel", handleTouchEnd);
      isInteractionListening = false;
    }
  };

  return interaction;
}

function handlePointerMove(event) {
  pointerPosition.x = event.clientX;
  pointerPosition.y = event.clientY;
  processInteraction();
}

function processInteraction() {
  for (const [elem, interaction] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updateInteractionPosition(interaction, rect);
      if (!interaction.hover) {
        interaction.hover = true;
        interaction.onEnter(interaction);
      }
      interaction.onMove(interaction);
    } else if (interaction.hover && !interaction.touching) {
      interaction.hover = false;
      interaction.onLeave(interaction);
    }
  }
}

function handleClick(event) {
  pointerPosition.x = event.clientX;
  pointerPosition.y = event.clientY;
  for (const [elem, interaction] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    updateInteractionPosition(interaction, rect);
    if (isInside(rect)) interaction.onClick(interaction);
  }
}

function handlePointerLeave() {
  for (const interaction of interactionRegistry.values()) {
    if (interaction.hover) {
      interaction.hover = false;
      interaction.onLeave(interaction);
    }
  }
}

function handleTouchStart(event) {
  if (event.touches.length === 0) return;
  pointerPosition.x = event.touches[0].clientX;
  pointerPosition.y = event.touches[0].clientY;

  for (const [elem, interaction] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      interaction.touching = true;
      updateInteractionPosition(interaction, rect);
      if (!interaction.hover) {
        interaction.hover = true;
        interaction.onEnter(interaction);
      }
      interaction.onMove(interaction);
    }
  }
}

function handleTouchMove(event) {
  if (event.touches.length === 0) return;
  pointerPosition.x = event.touches[0].clientX;
  pointerPosition.y = event.touches[0].clientY;

  for (const [elem, interaction] of interactionRegistry) {
    const rect = elem.getBoundingClientRect();
    updateInteractionPosition(interaction, rect);
    if (isInside(rect)) {
      if (!interaction.hover) {
        interaction.hover = true;
        interaction.touching = true;
        interaction.onEnter(interaction);
      }
      interaction.onMove(interaction);
    } else if (interaction.hover && interaction.touching) {
      interaction.onMove(interaction);
    }
  }
}

function handleTouchEnd() {
  for (const interaction of interactionRegistry.values()) {
    if (interaction.touching) {
      interaction.touching = false;
      if (interaction.hover) {
        interaction.hover = false;
        interaction.onLeave(interaction);
      }
    }
  }
}

function updateInteractionPosition(interaction, rect) {
  const { position, nPosition } = interaction;
  position.x = pointerPosition.x - rect.left;
  position.y = pointerPosition.y - rect.top;
  nPosition.x = (position.x / rect.width) * 2 - 1;
  nPosition.y = (-position.y / rect.height) * 2 + 1;
}

function isInside(rect) {
  const { x, y } = pointerPosition;
  return x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height;
}

const { randFloat, randFloatSpread } = MathUtils;
const position = new Vec3();
const velocity = new Vec3();
const otherPosition = new Vec3();
const cursorPosition = new Vec3();
const otherVelocity = new Vec3();
const direction = new Vec3();
const correction = new Vec3();
const impulse = new Vec3();
const otherImpulse = new Vec3();
const tempObject = new Object3D();

class BallPhysics {
  constructor(config) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vec3();
    this.#setInitialPositions();
    this.setSizes();
  }

  #setInitialPositions() {
    const { config, positionData, velocityData } = this;
    const start = config.followCursor !== false && config.showCursorBall !== false ? 1 : 0;
    if (start === 1) this.center.toArray(positionData, 0);

    for (let i = start; i < config.count; i++) {
      const base = 3 * i;
      positionData[base] = randFloatSpread(2 * config.maxX);
      positionData[base + 1] = randFloatSpread(2 * config.maxY);
      positionData[base + 2] = randFloatSpread(2 * config.maxZ);
      velocityData[base] = randFloatSpread(config.maxVelocity * 0.8);
      velocityData[base + 1] = randFloatSpread(config.maxVelocity * 0.8);
      velocityData[base + 2] = randFloatSpread(config.maxVelocity * 0.4);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    const start = config.followCursor !== false && config.showCursorBall !== false ? 1 : 0;
    if (start === 1) sizeData[0] = config.size0;
    for (let i = start; i < config.count; i++) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(time) {
    const { config, center, positionData, sizeData, velocityData } = this;
    const hasCursorBall = config.followCursor !== false && config.showCursorBall !== false;
    const hasInvisibleCursorForce =
      config.followCursor !== false && config.showCursorBall === false && config.controlSphere0;
    const cursorRadius = config.cursorRadius ?? config.size0;
    let start = hasCursorBall ? 1 : 0;

    if (hasCursorBall && config.controlSphere0) {
      start = 1;
      cursorPosition.fromArray(positionData, 0);
      cursorPosition.lerp(center, 0.1).toArray(positionData, 0);
      velocity.set(0, 0, 0).toArray(velocityData, 0);
    }

    for (let idx = start; idx < config.count; idx++) {
      const base = 3 * idx;
      position.fromArray(positionData, base);
      velocity.fromArray(velocityData, base);
      velocity.y -= time.delta * config.gravity * sizeData[idx];
      velocity.multiplyScalar(config.friction);
      velocity.clampLength(0, config.maxVelocity);
      position.add(velocity);
      position.toArray(positionData, base);
      velocity.toArray(velocityData, base);
    }

    for (let idx = start; idx < config.count; idx++) {
      const base = 3 * idx;
      position.fromArray(positionData, base);
      velocity.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        otherPosition.fromArray(positionData, otherBase);
        otherVelocity.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[jdx];
        direction.copy(otherPosition).sub(position);
        const distance = direction.length();
        const radiusSum = radius + otherRadius;

        if (distance < radiusSum) {
          const overlap = radiusSum - distance;
          correction.copy(direction).normalize().multiplyScalar(0.5 * overlap);
          impulse.copy(correction).multiplyScalar(Math.max(velocity.length(), 1));
          otherImpulse.copy(correction).multiplyScalar(Math.max(otherVelocity.length(), 1));
          position.sub(correction);
          velocity.sub(impulse);
          position.toArray(positionData, base);
          velocity.toArray(velocityData, base);
          otherPosition.add(correction);
          otherVelocity.add(otherImpulse);
          otherPosition.toArray(positionData, otherBase);
          otherVelocity.toArray(velocityData, otherBase);
        }
      }

      if (hasCursorBall && config.controlSphere0) {
        direction.copy(cursorPosition).sub(position);
        const distance = direction.length();
        const radiusSum = radius + sizeData[0];
        if (distance < radiusSum) {
          const diff = radiusSum - distance;
          correction.copy(direction.normalize()).multiplyScalar(diff);
          impulse.copy(correction).multiplyScalar(Math.max(velocity.length(), 2) * config.cursorForce);
          position.sub(correction);
          velocity.sub(impulse);
        }
      }

      if (hasInvisibleCursorForce) {
        direction.copy(center).sub(position);
        const distance = direction.length();
        const radiusSum = radius + cursorRadius;
        if (distance > 0 && distance < radiusSum) {
          const diff = radiusSum - distance;
          correction.copy(direction.normalize()).multiplyScalar(diff);
          impulse.copy(correction).multiplyScalar(Math.max(velocity.length(), 1.6) * config.cursorForce);
          position.sub(correction);
          velocity.sub(impulse);
        }
      }

      if (Math.abs(position.x) + radius > config.maxX) {
        position.x = Math.sign(position.x) * (config.maxX - radius);
        velocity.x = -velocity.x * config.wallBounce;
      }

      if (config.gravity === 0) {
        if (Math.abs(position.y) + radius > config.maxY) {
          position.y = Math.sign(position.y) * (config.maxY - radius);
          velocity.y = -velocity.y * config.wallBounce;
        }
      } else if (position.y - radius < -config.maxY) {
        position.y = -config.maxY + radius;
        velocity.y = -velocity.y * config.wallBounce;
      }

      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(position.z) + radius > maxBoundary) {
        position.z = Math.sign(position.z) * (config.maxZ - radius);
        velocity.z = -velocity.z * config.wallBounce;
      }

      position.toArray(positionData, base);
      velocity.toArray(velocityData, base);
    }
  }
}

const DEFAULTS = {
  count: 200,
  texture: null,
  layers: null,
  colors: [0, 0, 0],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 200,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  cursorForce: 1,
  followCursor: true,
  showCursorBall: true,
};

/* Grupo de cuerpos voladores. Cada "capa" es una textura distinta (aguila,
   sombrero...) renderizada con su propio InstancedMesh, pero TODAS comparten
   UN solo motor de fisica y UN solo contexto WebGL -> fluido (no varios canvas).
   Cada cuerpo es un plano de lado 2 (PlaneGeometry(2,2)): asi su mitad visible
   (=1*escala) coincide con el radio de colision (=tamaño), y dejan de "chocar"
   al doble de su tamaño aparente. La camara mira de frente al plano XY, asi que
   los planos ya quedan de cara (no hace falta billboarding). Sin luces/envmap. */
class BallMesh extends Group {
  constructor(options = {}) {
    super();
    const config = { ...DEFAULTS, ...options };

    // Normaliza a "capas": si no hay layers, se arma una sola con la textura suelta.
    const layers =
      Array.isArray(config.layers) && config.layers.length > 0
        ? config.layers
        : [{ texture: config.texture, count: config.count, minSize: config.minSize, maxSize: config.maxSize }];

    // El total manda en la fisica; mutamos el MISMO objeto config para que
    // physics.config === this.config (el resize actualiza maxX/maxY por referencia).
    config.count = layers.reduce((sum, l) => sum + l.count, 0);
    this.config = config;
    this.physics = new BallPhysics(config);

    this.layerRecs = [];
    let start = 0;
    for (const layer of layers) {
      const minSize = layer.minSize ?? config.minSize;
      const maxSize = layer.maxSize ?? config.maxSize;
      // Tamaños propios por capa (sobreescribe los globales de la fisica).
      for (let i = start; i < start + layer.count; i++) {
        this.physics.sizeData[i] = randFloat(minSize, maxSize);
      }

      const geometry = new PlaneGeometry(2, 2);
      const material = new MeshBasicMaterial({
        color: 0xffffff, // blanco = no tiñe la imagen
        transparent: true,
        alphaTest: 0.5,
        depthWrite: false,
        side: DoubleSide,
        toneMapped: false,
      });
      if (layer.texture) {
        // Invisible hasta que la textura carga: sin ella el plano se veria
        // como un cuadro solido (el "flash" de cuadros al abrir la pagina).
        material.visible = false;
        new TextureLoader().load(layer.texture, (texture) => {
          texture.colorSpace = SRGBColorSpace;
          material.map = texture;
          material.visible = true;
          material.needsUpdate = true;
          // Respeta el aspecto real para que la imagen no salga estirada.
          const img = texture.image;
          if (img && img.width && img.height) {
            const aspect = img.width / img.height;
            if (aspect >= 1) geometry.scale(1, 1 / aspect, 1);
            else geometry.scale(aspect, 1, 1);
          }
        });
      }

      const mesh = new InstancedMesh(geometry, material, layer.count);
      mesh.frustumCulled = false; // los cuerpos se mueven fuera del bound del plano
      this.add(mesh);
      this.layerRecs.push({ mesh, start, count: layer.count });
      start += layer.count;
    }
  }

  update(time) {
    this.physics.update(time);
    const { positionData, velocityData, sizeData } = this.physics;
    for (const layer of this.layerRecs) {
      for (let k = 0; k < layer.count; k++) {
        const idx = layer.start + k;
        tempObject.position.fromArray(positionData, 3 * idx);
        tempObject.scale.setScalar(sizeData[idx]);
        // Inclinacion sutil segun la velocidad horizontal: "planean" al caer.
        tempObject.rotation.z = -velocityData[3 * idx] * 4;
        tempObject.updateMatrix();
        layer.mesh.setMatrixAt(k, tempObject.matrix);
      }
      layer.mesh.instanceMatrix.needsUpdate = true;
    }
  }
}

function isWebGLContextUsable(context) {
  if (!context || context.isContextLost?.()) return false;

  try {
    return Boolean(context.getShaderPrecisionFormat?.(context.VERTEX_SHADER, context.HIGH_FLOAT));
  } catch {
    return false;
  }
}

function canCreateWebGLContext() {
  try {
    const canvas = document.createElement("canvas");
    const context =
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2", { alpha: true }) || canvas.getContext("webgl", { alpha: true }));

    return isWebGLContextUsable(context);
  } catch {
    return false;
  }
}

function createBallpit(canvas, options = {}) {
  if (!canCreateWebGLContext()) return null;

  let three;
  let spheres;
  let paused = false;
  let interaction;

  try {
    three = new ThreeScene({
      canvas,
      size: "parent",
      rendererOptions: { antialias: true, alpha: true },
    });

    three.renderer.toneMapping = ACESFilmicToneMapping;
    three.camera.position.set(0, 0, 20);
    three.camera.lookAt(0, 0, 0);
    three.cameraMaxAspect = 1.5;
    three.maxPixelRatio = 1.5;
    three.resize();
    initialize({
      ...options,
      maxX: three.size.wWidth / 2,
      maxY: three.size.wHeight / 2,
    });
  } catch (error) {
    interaction?.dispose();
    three?.dispose?.();
    if (process.env.NODE_ENV !== "production") {
      console.warn("Ballpit disabled because WebGL could not initialize.", error);
    }
    return null;
  }

  const raycaster = new Raycaster();
  const plane = new Plane(new Vec3(0, 0, 1), 0);
  const intersection = new Vec3();

  canvas.style.touchAction = "pan-y";
  canvas.style.userSelect = "none";
  canvas.style.webkitUserSelect = "none";

  if (options.followCursor !== false) {
    interaction = createInteraction({
      domElement: canvas,
      onMove() {
        raycaster.setFromCamera(interaction.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, intersection);
        spheres.physics.center.copy(intersection);
        spheres.config.controlSphere0 = true;
      },
      onLeave() {
        spheres.config.controlSphere0 = false;
      },
    });
  }

  function initialize(initOptions) {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new BallMesh(initOptions);
    three.scene.add(spheres);
  }

  three.onBeforeRender = (time) => {
    if (!paused) spheres.update(time);
  };

  three.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };
  three.onAfterResize(three.size);

  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(count) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      interaction?.dispose();
      three.dispose();
    },
  };
}

export default function Ballpit({ className = "", followCursor = true, ...props }) {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initialize = () => {
      instanceRef.current = createBallpit(canvas, { followCursor, ...props });
      if (!instanceRef.current) {
        canvas.dataset.webglFallback = "true";
      } else {
        delete canvas.dataset.webglFallback;
      }
    };

    const frame = requestAnimationFrame(initialize);

    return () => {
      cancelAnimationFrame(frame);
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
    // React Bits initializes this simulation once; prop changes recreate too much WebGL state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
