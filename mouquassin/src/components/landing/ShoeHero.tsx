"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useScroll, useTransform, motion } from "framer-motion";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { DustParticles } from "./DustParticles";

function ShoeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new OBJLoader();
    loader.load(
      "/models/shoe.obj",
      (obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color("#1a1512"),
              roughness: 0.35,
              metalness: 0.1,
            });
          }
        });
        const box = new THREE.Box3().setFromObject(obj);
        const center = box.getCenter(new THREE.Vector3());
        obj.position.sub(center);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        obj.scale.setScalar(2 / maxDim);
        obj.rotation.set(0, 0, 0);
        setModel(obj);
      },
      undefined,
      () => console.error("Failed to load shoe")
    );
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      const target = Math.sin(t * 0.4) * 0.35 + Math.sin(t * 0.13) * 0.1;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        target,
        4,
        delta
      );
    }
  });

  if (!model) return null;

  return (
    <group ref={groupRef} position={[0.1, 1.2, 0]}>
      <primitive object={model} />
    </group>
  );
}

function CameraParallax() {
  useFrame((state, delta) => {
    const x = state.mouse.x * 0.15;
    const y = state.mouse.y * 0.1;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, x, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 2 + y, 2, delta);
    state.camera.lookAt(0, 1, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />

      <Environment preset="apartment" />
      <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={6} blur={2} far={2} />

      <group position={[0, 0, 0]}>
        <ShoeModel />
      </group>

      <DustParticles />
      <CameraParallax />

      <EffectComposer>
        <Bloom intensity={0.4} luminanceThreshold={0.6} />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
    </>
  );
}

function Fallback() {
  return (
    <div className="w-64 h-64 md:w-96 md:h-96 mx-auto bg-charcoal/5 rounded-2xl flex items-center justify-center">
      <div className="text-6xl md:text-8xl font-heading text-charcoal/20 select-none">
        L
      </div>
    </div>
  );
}

function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const cores = navigator.hardwareConcurrency ?? 2;
  if (cores < 4) return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return false;
  } catch {
    return false;
  }
  return true;
}

export function ShoeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (canRun3D()) {
      setUseFallback(false);
    }
  }, []);

  return (
    <section ref={containerRef} className="relative h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-background" />

      {/* Shoe - full screen behind everything */}
      <div className="absolute inset-0 z-0">
        {!useFallback ? (
          <Canvas
            camera={{ position: [0, 2, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Fallback />
          </div>
        )}
      </div>

      {/* Text on top */}
      <motion.div style={{ opacity }} className="relative z-10 text-center px-4 pt-[30vh]">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-brand"
            style={{ fontStyle: "normal", fontSynthesis: "none", WebkitFontSmoothing: "antialiased", color: "#b5985a" }}
          >
            Lyzane
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 text-lg md:text-xl text-muted-foreground tracking-wide"
          >
            Where elegance meets the ground
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-12"
          >
            <a
              href="#values"
              className="inline-block text-sm tracking-widest uppercase text-burgundy border-b border-burgundy pb-1 hover:text-charcoal hover:border-charcoal transition-colors"
            >
              Discover
            </a>
          </motion.div>
      </motion.div>
    </section>
  );
}