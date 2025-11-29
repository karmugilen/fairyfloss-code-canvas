import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, rotationIntensity, floatIntensity }: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.002 * speed;
            meshRef.current.rotation.y += 0.003 * speed;
        }
    });

    return (
        <Float
            speed={speed} // Animation speed, defaults to 1
            rotationIntensity={rotationIntensity} // XYZ rotation intensity, defaults to 1
            floatIntensity={floatIntensity} // Up/down float intensity, defaults to 1
            position={position}
        >
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.3}
                    metalness={0.8}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </Float>
    );
};

const Scene = () => {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <FloatingShape
                position={[-4, 2, -5]}
                color="#ff9ce6" // Fairyfloss pink
                speed={1.5}
                rotationIntensity={1}
                floatIntensity={2}
            />
            <FloatingShape
                position={[4, -2, -2]}
                color="#c9c8ff" // Fairyfloss purple
                speed={2}
                rotationIntensity={1.5}
                floatIntensity={1.5}
            />
            <FloatingShape
                position={[0, 3, -8]}
                color="#a0ffe6" // Fairyfloss teal
                speed={1}
                rotationIntensity={0.5}
                floatIntensity={1}
            />
            <FloatingShape
                position={[-5, -4, -6]}
                color="#ffffba" // Fairyfloss yellow
                speed={1.2}
                rotationIntensity={0.8}
                floatIntensity={1.8}
            />
        </>
    );
};

const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] opacity-60 pointer-events-none">
            <Canvas dpr={[1, 2]}>
                <Scene />
            </Canvas>
        </div>
    );
};

export default ThreeBackground;
