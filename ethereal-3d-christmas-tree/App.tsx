
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import { Volume2, VolumeX, Play } from 'lucide-react';
import TreeParticles from './components/TreeParticles';
import { Decorations } from './components/Decorations';
import Snow from './components/Snow';
import musicUrl from './music.mp3?url';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 确保音频音量始终保持在较低水平
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 设置音量为 30%
    }
  }, []);

  const startExperience = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // 再次确认音量
      audioRef.current.play().catch((e: Error) => {
        console.error("音频播放失败，请检查文件是否存在于根目录并命名为 music.mp3", e);
      });
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play();
        setIsMuted(false);
      } else {
        audioRef.current.pause();
        setIsMuted(true);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#010205] overflow-hidden">
      {/* 使用你提供的音频文件，确保文件名为 music.mp3 并放在根目录 */}
      <audio ref={audioRef} loop preload="auto">
        <source src={musicUrl} type="audio/mpeg" />
        您的浏览器不支持音频播放。
      </audio>

      {/* Entry Splash Screen */}
      {!isStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#010205]">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
          <div className="relative z-10 text-center px-6">
            <h1 className="font-script text-white text-6xl md:text-8xl text-glow mb-8 animate-pulse">
              Merry Christmas
            </h1>
            <p className="text-white/60 mb-12 tracking-widest uppercase text-sm">A Special Gift for Yao</p>
            <button 
              onClick={startExperience}
              className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-white/30 bg-white/5 hover:bg-white/10 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Play fill="white" size={32} className="text-white ml-1 group-hover:scale-110 transition-transform" />
            </button>
            <p className="mt-6 text-white/40 text-xs italic">点击开启冬日奇境</p>
          </div>
        </div>
      )}

      {/* 3D Scene */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${isStarted ? 'opacity-100' : 'opacity-0'}`}>
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 1, 25]} fov={35} />
          <OrbitControls 
            enablePan={false} 
            maxPolarAngle={Math.PI / 1.7} 
            minDistance={20} 
            maxDistance={30}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 20, 10]} angle={0.2} penumbra={1} intensity={3} castShadow />
            <pointLight position={[-10, 5, -5]} intensity={1.5} color="#ffffff" />
            <pointLight position={[5, 2, -10]} intensity={2} color="#4477ff" />
            <pointLight position={[0, -4, 0]} intensity={1.2} color="#ffcc00" distance={10} />
            
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

      {/* UI Elements */}
      {isStarted && (
        <>
          <div className="absolute top-8 left-8 md:top-12 md:left-12 pointer-events-none z-10 animate-fade-in">
            <h1 className="font-script text-white text-6xl md:text-8xl text-glow opacity-95">
              Merry Christmas Yao
            </h1>
            <div className="mt-2 h-1 w-24 bg-gradient-to-r from-yellow-500 to-transparent opacity-60"></div>
          </div>

          <div className="absolute bottom-8 right-8 z-20">
            <button 
              onClick={toggleMute}
              className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95 shadow-lg"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
