"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

const PARTICLE_COUNT = 50;

export function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    setPositions(pos);
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += delta * 0.05;
      if (arr[i * 3 + 1] > 3) {
        arr[i * 3 + 1] = 0;
      }
    }
    posAttr.needsUpdate = true;
  });

  if (!positions) return null;

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        color="#b5985a"
        size={0.02}
        transparent
        opacity={0.4}
        depthWrite={false}
        sizeAttenuation
      />
    </Points>
  );
}
