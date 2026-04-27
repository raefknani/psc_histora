import { useEffect, useRef, useState } from "react";

class PerformanceMonitor {
  constructor(onUpdate) {
    this.fps = 0;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.onUpdate = onUpdate;
    this.history = [];
  }

  update() {
    this.frameCount++;
    const now = performance.now();
    const elapsed = now - this.lastTime;

    if (elapsed >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
      this.history.push(this.fps);
      if (this.history.length > 60) this.history.shift();
      this.onUpdate?.(this.fps);
    }
  }

  getAverageFPS() {
    if (this.history.length === 0) return 0;
    return Math.round(
      this.history.reduce((a, b) => a + b, 0) / this.history.length,
    );
  }

  getMinFPS() {
    return Math.min(...this.history);
  }

  getMaxFPS() {
    return Math.max(...this.history);
  }
}

export default function ModelViewerPro({
  modelUrl,
  onError,
  showStats = false,
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({});
  const [fps, setFps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!modelUrl) return;
    let alive = true;

    async function init() {
      try {
        // Dynamic import to reduce initial bundle
        const THREE = await import("three");
        const { GLTFLoader } =
          await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { OrbitControls } =
          await import("three/examples/jsm/controls/OrbitControls.js");
        const { DRACOLoader } =
          await import("three/examples/jsm/loaders/DRACOLoader.js");

        if (!alive) return;

        const el = mountRef.current;
        if (!el) return;

        const w = el.clientWidth || 600;
        const h = el.clientHeight || 340;

        // Renderer with performance optimizations
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          logarithmicDepthBuffer: true,
          precision: "highp",
        });
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        renderer.shadowMap.resolution = 1024;
        renderer.sortObjects = true;
        el.appendChild(renderer.domElement);

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#131829");
        scene.fog = new THREE.Fog("#131829", 20, 100);

        // Camera
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 100);
        camera.position.set(0, 1.2, 3.5);

        // Lights with optimized setup
        const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.7);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xfff5dc, 1.4);
        keyLight.position.set(4, 6, 4);
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.far = 15;
        keyLight.castShadow = true;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xd0e8ff, 0.5);
        fillLight.position.set(-4, 2, -2);
        scene.add(fillLight);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minDistance = 0.5;
        controls.maxDistance = 10;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
        controls.enableZoom = true;
        controls.enablePan = true;

        // Load model
        const loader = new GLTFLoader();
        const draco = new DRACOLoader();
        draco.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.6/",
        );
        loader.setDRACOLoader(draco);

        const loadStart = performance.now();

        loader.load(
          modelUrl,
          (gltf) => {
            if (!alive) return;
            const model = gltf.scene;

            // Auto-center and auto-scale
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            model.position.sub(center);
            model.scale.multiplyScalar(2.2 / Math.max(size.x, size.y, size.z));

            // Enable shadows on model
            let meshCount = 0;
            model.traverse((child) => {
              if (child.isMesh) {
                meshCount++;
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                  child.material.side = THREE.FrontSide;
                }
              }
            });

            scene.add(model);

            // Play animations
            if (gltf.animations?.length) {
              const mixer = new THREE.AnimationMixer(model);
              mixer.clipAction(gltf.animations[0]).play();
              stateRef.current.mixer = mixer;
            }

            const loadTime = performance.now() - loadStart;

            setLoading(false);
            if (showStats) {
              setStats({
                meshCount,
                loadTime: loadTime.toFixed(0),
                triangles: gltf.scene.children.length,
              });
            }
          },
          (progress) => {
            const pct = Math.round((progress.loaded / progress.total) * 100);
            console.log(`Model: ${pct}%`);
          },
          (err) => {
            console.error("Model load error:", err);
            setError("Failed to load 3D model");
            setLoading(false);
            onError?.(err);
          },
        );

        // Performance monitoring
        const perfMonitor = new PerformanceMonitor((newFps) => {
          setFps(newFps);
        });

        // Animation loop
        const clock = new THREE.Clock();
        let animationId;

        const animate = () => {
          const delta = clock.getDelta();

          if (stateRef.current.mixer) {
            stateRef.current.mixer.update(delta);
          }

          controls.update();
          renderer.render(scene, camera);
          perfMonitor.update();

          animationId = requestAnimationFrame(animate);
        };

        animate();
        perfMonitor.start?.();

        // Handle resize
        const handleResize = () => {
          const newW = el?.clientWidth || 600;
          const newH = el?.clientHeight || 340;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        };

        window.addEventListener("resize", handleResize);

        stateRef.current = {
          renderer,
          scene,
          camera,
          controls,
          animate,
          perfMonitor,
          animationId,
        };

        return () => {
          alive = false;
          window.removeEventListener("resize", handleResize);
          renderer.dispose();
          loader.manager.itemEnd?.();
        };
      } catch (err) {
        console.error("Init error:", err);
        setError(err.message);
        onError?.(err);
      }
    }

    const cleanup = init();

    return () => {
      alive = false;
      cleanup?.();
      if (stateRef.current?.animationId) {
        cancelAnimationFrame(stateRef.current.animationId);
      }
    };
  }, [modelUrl, onError, showStats]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        height: 340,
        borderRadius: "var(--radius)",
        overflow: "hidden",
        background: "var(--bg3)",
        position: "relative",
      }}
    >
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(9,12,21,0.95)",
            backdropFilter: "blur(4px)",
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                border: "2px solid var(--border2)",
                borderTopColor: "var(--gold)",
                borderRadius: "50%",
                animation: "spin .8s linear infinite",
                margin: "0 auto 12px",
              }}
            />
            <p style={{ color: "var(--text-dim)", fontSize: 12 }}>
              Loading 3D model…
            </p>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(9,12,21,0.95)",
            zIndex: 10,
          }}
        >
          <p
            style={{
              color: "var(--coral)",
              textAlign: "center",
              padding: 20,
            }}
          >
            ⚠️ {error}
          </p>
        </div>
      )}

      {fps > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            background: "rgba(0,0,0,0.7)",
            color: fps < 30 ? "var(--coral)" : "var(--teal)",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 11,
            fontFamily: "monospace",
            fontWeight: 500,
            zIndex: 5,
          }}
        >
          {fps} FPS
          {showStats && stats && (
            <div style={{ fontSize: 10, marginTop: 4, opacity: 0.8 }}>
              Load: {stats.loadTime}ms
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
