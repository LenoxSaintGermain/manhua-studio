
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
    <div className="max-w-7xl mx-auto px-12 py-24 min-h-screen flex flex-col justify-center">
      <div className="mb-24 animate-studio">
        <h1 className="text-8xl font-editorial tracking-tighter mb-6">STUDIO.</h1>
        <p className="text-2xl text-gray-400 font-light max-w-2xl">
          The premium multimodal environment for modern manhua production.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-12 w-full max-w-6xl animate-studio delay-100">
        <InitCard 
          title="Reference First" 
          desc="Initialize from your own cast sketches and style sheets."
          icon="🖼️"
          onClick={() => { setSelectedPath('refs'); setStep('details'); }}
        />
        <InitCard 
          title="Premise First" 
          desc="AI acts as a co-author to draft your series from a single spark."
          icon="✍️"
          onClick={() => { setSelectedPath('premise'); setStep('details'); }}
        />
        <InitCard 
          title="Scratch" 
          desc="A clean slate for pure architectural experimentation."
          icon="✨"
          onClick={() => { setSelectedPath('scratch'); setStep('details'); }}
        />
      </div>

      {step === 'details' && (
        <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center">
          <div className="max-w-3xl w-full px-12 animate-studio">
            <h2 className="text-6xl font-editorial mb-12">Initialize Series</h2>
            
            <div className="space-y-12">
              <div>
                <label className="label-caps block mb-4">Series Title</label>
                <input 
                  autoFocus
                  className="w-full text-5xl font-editorial border-b border-gray-200 outline-none focus:border-black transition-colors pb-4" 
                  placeholder="e.g. 808 Chambers" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>

              {selectedPath === 'premise' && (
                <div>
                  <label className="label-caps block mb-4">The Premise</label>
                  <textarea 
                    className="w-full text-xl font-light border-b border-gray-200 outline-none focus:border-black transition-colors pb-4 resize-none h-32" 
                    placeholder="Describe the world, the conflict..." 
                    value={premise}
                    onChange={e => setPremise(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="mt-20 flex justify-between items-center">
              <button onClick={() => setStep('intro')} className="text-gray-400 hover:text-black uppercase tracking-widest font-mono text-xs">← Abort</button>
              <button 
                onClick={() => onCreate(title, selectedPath!, premise)}
                disabled={!title}
                className="btn-studio btn-studio-primary px-16 py-6 text-lg uppercase tracking-[0.25em] disabled:opacity-20"
              >
                Draft Issue #1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InitCard = ({ title, desc, icon, onClick }: any) => (
  <button onClick={onClick} className="premium-card card-hover text-left p-12 group h-full flex flex-col border-gray-100">
    <div className="text-4xl mb-8 group-hover:scale-110 transition-transform duration-500">{icon}</div>
    <h3 className="text-3xl font-editorial mb-4">{title}</h3>
    <p className="text-gray-400 font-light leading-relaxed text-sm">{desc}</p>
  </button>
);
