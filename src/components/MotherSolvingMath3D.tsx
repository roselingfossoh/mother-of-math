import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function MotherCartoon() {
  const group = useRef<any>(null);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]}>
      {/* Desk */}
      <mesh position={[0, -0.7, 0]}>
        <boxGeometry args={[3, 0.3, 1.2]} />
        <meshStandardMaterial color="#deb887" />
      </mesh>
      {/* Paper */}
      <mesh position={[0.3, -0.55, 0.35]} rotation={[-Math.PI / 2.2, 0, 0]}>
        <boxGeometry args={[0.7, 0.5, 0.03]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.9, 32]} />
        <meshStandardMaterial color="#e0218a" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#f8d7b3" />
      </mesh>
      {/* Left Arm */}
      <mesh position={[-0.38, 0.25, 0.2]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.09, 0.09, 0.7, 32]} />
        <meshStandardMaterial color="#f8d7b3" />
      </mesh>
      {/* Right Arm (writing) */}
      <mesh position={[0.38, 0.25, 0.32]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.09, 0.09, 0.7, 32]} />
        <meshStandardMaterial color="#f8d7b3" />
      </mesh>
      {/* Pen in right hand */}
      <mesh position={[0.65, -0.05, 0.48]} rotation={[0, 0, -Math.PI / 3]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.09, 0.8, 0.29]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.09, 0.8, 0.29]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Smile */}
      <mesh position={[0, 0.7, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#b76e79" />
      </mesh>
      {/* Hair (back) */}
      <mesh position={[0, 0.9, -0.18]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#3b2c1a" />
      </mesh>
      {/* Hair (top) */}
      <mesh position={[0, 1.02, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#3b2c1a" />
      </mesh>
    </group>
  );
}

const MotherSolvingMath3D = () => (
  <div style={{ width: '100%', height: 220 }}>
    <Canvas camera={{ position: [0, 0.5, 4], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 5]} intensity={0.7} />
      <MotherCartoon />
    </Canvas>
  </div>
);

export default MotherSolvingMath3D;
