
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import { Volume2, VolumeX } from 'lucide-react';
import TreeParticles from './components/TreeParticles.tsx';
import { Decorations } from './components/Decorations.tsx';
import Snow from './components/Snow.tsx';

// Define R3F intrinsic elements as components to resolve JSX type errors
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

const App: React.FC = () => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle music playback
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().then(() => {
          setIsMuted(false);
        }).catch(e => {
          console.error("Audio play failed:", e);
        });
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#010205] overflow-hidden">
      {/* 
          Using a very stable Christmas background music from Pixabay CDN.
          Christmas Spirit - by ZakharValaha
      */}
      <audio ref={audioRef} loop preload="auto">
        <source src="https://cdn.pixabay.com/audio/2021/11/24/audio_333068f05e.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 1, 15]} fov={35} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.7} 
            minDistance={7} 
            maxDistance={25}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          <Suspense fallback={null}>
            {/* Base ambient lighting */}
            <AmbientLight intensity={0.4} />
            
            {/* Main key light */}
            <SpotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={3} castShadow />
            
            {/* Fill light from the left */}
            <PointLight position={[-10, 5, -5]} intensity={1.5} color="#ffffff" />
            
            {/* Rim light from the back-right to highlight particles */}
            <PointLight position={[5, 2, -10]} intensity={2} color="#4477ff" />
            
            {/* Warm glow light from the bottom */}
            <PointLight position={[0, -4, 0]} intensity={1.2} color="#ffcc00" distance={10} />
            
            <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.05}>
              <TreeParticles />
              <Decorations />
            </Float>

            <Snow />

            <ContactShadows 
              position={[0, -4.7, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={3} 
              far={10} 
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Decorative Text Overlay - Top Left */}
      <div className="absolute top-10 left-10 pointer-events-none z-10">
        <div className="animate-fade-in">
          <h1 className="font-script text-white text-4xl md:text-6xl text-glow opacity-95">
            Merry Christmas Yao
          </h1>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-yellow-500 to-transparent opacity-60"></div>
        </div>
      </div>

      {/* Audio Control - Bottom Right */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg"
        title={isMuted ? "Play Music" : "Mute Music"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]"></div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 2.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
