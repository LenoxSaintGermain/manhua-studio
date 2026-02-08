
import React, { useState } from 'react';

interface OnboardingProps {
  onCreate: (title: string, path: 'scratch' | 'premise' | 'refs', premise?: string) => void;
  isGenerating: boolean;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onCreate, isGenerating }) => {
  const [title, setTitle] = useState('');
  const [premise, setPremise] = useState('');
  const [step, setStep] = useState<'intro' | 'details'>('intro');
  const [selectedPath, setSelectedPath] = useState<'scratch' | 'premise' | 'refs' | null>(null);

  if (isGenerating) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-1 px-40 bg-gray-100 rounded-full h-1 overflow-hidden">
           <div className="h-full bg-black animate-[loading_2s_infinite_linear]"></div>
        </div>
        <h2 className="text-2xl font-editorial mt-8 animate-pulse">Drafting Series Blueprint...</h2>
        <style>{`
          @keyframes loading {
            0% { width: 0%; transform: translateX(-100%); }
            100% { width: 100%; transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-black selection:text-white">
      {/* Hero Content Section */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        
        {/* Left: Text & Entry Paths (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center px-8 lg:px-20 py-20 z-10">
          <div className="animate-studio">
            <div className="flex items-center gap-2 mb-8">
              <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest">v3.1 Pro</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Multimodal Studio</span>
            </div>
            
            <h1 className="text-8xl lg:text-9xl font-editorial tracking-tighter leading-[0.85] mb-8 bg-gradient-to-br from-black to-gray-400 bg-clip-text text-transparent">
              SHOWRUNNER<br/>STUDIO.
            </h1>
            
            <p className="text-2xl text-gray-500 font-light max-w-lg leading-relaxed mb-16">
              The industry-grade environment for Manhua production. From reference logic to final export in a single workspace.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mb-16">
              <button 
                onClick={() => { setSelectedPath('premise'); setStep('details'); }}
                className="group p-8 text-left border border-gray-100 rounded-3xl hover:border-black hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-2xl bg-white"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">✍️</div>
                <h3 className="font-editorial text-2xl mb-1">Premise First</h3>
                <p className="text-sm opacity-50 font-light">Draft a full series from a single spark.</p>
              </button>
              
              <button 
                onClick={() => { setSelectedPath('refs'); setStep('details'); }}
                className="group p-8 text-left border border-gray-100 rounded-3xl hover:border-black hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-1 shadow-sm hover:shadow-2xl bg-white"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
                <h3 className="font-editorial text-2xl mb-1">Cast Refs</h3>
                <p className="text-sm opacity-50 font-light">Upload sketches for perfect continuity.</p>
              </button>
            </div>

            <div className="flex flex-col gap-6 text-[10px] font-mono uppercase tracking-[0.2em] text-gray-400">
               <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2 text-black font-bold">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    Canon Lock Engine
                  </div>
                  <div>Kinetic Story Arcs</div>
                  <div>Plate Rendering</div>
               </div>
               <div className="pt-6 border-t border-gray-100 max-w-sm">
                  <p className="text-[9px] leading-relaxed opacity-60">
                    Proprietary consistency logic ensures Lil' Jian remains Lil' Jian from Issue #1 to the finale.
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Right: The Banging Hero Visual (7 Cols) */}
        <div className="lg:col-span-7 relative hidden lg:flex items-center justify-center bg-[#fdfdfd] border-l border-gray-50 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
              backgroundSize: '80px 80px' 
            }}
          ></div>

          {/* Cinematic Composition */}
          <div className="relative w-full h-full flex items-center justify-center">
             {/* Large Central "Plate" Render */}
             <div className="relative z-20 w-[60%] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-4 border-white rotate-[-1deg] transition-all duration-1000 group hover:rotate-0 hover:scale-[1.02] animate-studio">
                <img 
                  src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&q=80&w=1200" 
                  className="w-full h-full object-cover" 
                  alt="High Quality Output"
                />
                <div className="absolute top-8 left-8">
                   <span className="backdrop-blur-md bg-white/20 border border-white/40 text-white text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-[0.2em]">Fidelity: Ultra</span>
                </div>
                <div className="absolute bottom-12 left-12 right-12">
                   <div className="text-white font-editorial text-4xl leading-none mb-4 drop-shadow-2xl">The 808 Chambers await, Lil' Jian.</div>
                   <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-full animate-[progress_3s_ease-out_forwards]"></div>
                   </div>
                </div>
             </div>

             {/* Background Floating Frames */}
             <div className="absolute top-[10%] right-[10%] w-[35%] aspect-video rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] z-10 border border-white/50 opacity-80 animate-studio delay-200">
                <img 
                  src="https://images.unsplash.com/photo-1614728263952-84ea206f99b6?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover grayscale" 
                  alt="Establishing Frame"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-4 left-4 label-caps text-white text-[8px]">Frame 01: Wide Exterior</div>
             </div>

             <div className="absolute bottom-[15%] left-[5%] w-[30%] aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-[-12deg] z-30 border-4 border-white animate-studio delay-500">
                <img 
                  src="https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&q=80&w=1000" 
                  className="w-full h-full object-cover" 
                  alt="Character Close-up"
                />
                <div className="absolute top-4 right-4 h-3 w-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_red]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="text-white font-mono text-[8px] tracking-[0.4em] opacity-40 uppercase">Canon Locked</div>
                </div>
             </div>

             {/* Director UI elements floating */}
             <div className="absolute top-[20%] left-[15%] z-40 bg-white shadow-2xl p-4 rounded-xl border border-gray-100 animate-studio delay-700 hidden xl:block">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs">📸</div>
                   <div>
                      <div className="text-[8px] font-mono text-gray-400 uppercase">Camera</div>
                      <div className="text-[10px] font-bold">Low Angle / Dutch</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Details Step (Drawer-like Modal) */}
      {step === 'details' && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="max-w-3xl w-full bg-white rounded-[2.5rem] p-12 lg:p-20 shadow-[0_100px_200px_rgba(0,0,0,0.4)] animate-studio relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-50">
               <div className="h-full bg-black w-full origin-left animate-[progress_0.8s_ease-out]"></div>
            </div>
            
            <header className="mb-16">
               <h2 className="text-6xl font-editorial tracking-tighter mb-2">Initialize Series.</h2>
               <p className="text-gray-400 font-light">Set the parameters for your new production.</p>
            </header>
            
            <div className="space-y-16">
              <div className="relative">
                <label className="label-caps block mb-4">Series Title</label>
                <input 
                  autoFocus
                  className="w-full text-5xl lg:text-6xl font-editorial border-b-2 border-gray-100 outline-none focus:border-black transition-all pb-8 placeholder:text-gray-100" 
                  placeholder="e.g. 808 Chambers" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              {selectedPath === 'premise' && (
                <div className="animate-studio">
                  <label className="label-caps block mb-4">The Premise</label>
                  <textarea 
                    className="w-full text-2xl font-light border-b-2 border-gray-100 outline-none focus:border-black transition-all pb-8 resize-none h-40 placeholder:text-gray-100" 
                    placeholder="Describe the world, the master conflict, the stakes..." 
                    value={premise}
                    onChange={e => setPremise(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="mt-20 flex justify-between items-center">
              <button onClick={() => setStep('intro')} className="text-gray-400 hover:text-black uppercase tracking-[0.3em] font-mono text-[10px] border-b border-transparent hover:border-black transition-all">← Abort Production</button>
              <button 
                onClick={() => onCreate(title, selectedPath!, premise)}
                disabled={!title}
                className="btn-studio bg-black text-white px-20 py-6 text-sm uppercase tracking-[0.3em] font-bold disabled:opacity-10 shadow-2xl hover:bg-gray-800 transition-all"
              >
                Draft Issue #1
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes progress {
           from { width: 0%; }
           to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
