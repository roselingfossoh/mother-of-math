import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';

function SpinningBox() {
  const meshRef = useRef<any>(null);
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#e0218a" />
    </mesh>
  );
}

const Fallback = () => (
  <div className="flex items-center justify-center h-[300px] text-mama-purple/80">
    Unable to load 3D math animation. Please check your internet connection or font file.
  </div>
);

const MathSymbols3D = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[500px] w-full rounded-xl overflow-hidden bg-gradient-to-b from-transparent to-mama-light/20"
    >
      <Suspense fallback={<Fallback />}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          style={{ background: 'transparent' }}
          dpr={[1, 2]} // Optimize for retina displays
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <SpinningBox />
        </Canvas>
      </Suspense>
    </motion.div>
  );
};

export default MathSymbols3D;