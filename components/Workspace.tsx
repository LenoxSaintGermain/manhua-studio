
import React, { useState } from 'react';
import { ShowrunnerSeries, Issue, Frame, Beat } from '../types';

interface WorkspaceProps {
  series: ShowrunnerSeries;
  isProcessing: boolean;
  onDraftScript: (id: string) => void;
  onShootFrame: (fid: string, bid: string, iid: string) => void;
  onReset: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({ series, isProcessing, onDraftScript, onShootFrame, onReset }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'architect' | 'canvas' | 'publish'>('architect');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(series.story.issues[0]?.id || null);
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(null);

  const selectedIssue = series.story.issues.find(i => i.id === selectedIssueId);

  return (
    <div className="flex bg-white">
      {/* 1. Navigation (Left) */}
      <nav className="studio-nav">
        <div className="p-8">
           <h1 className="text-2xl font-editorial cursor-pointer hover:opacity-70 transition-opacity" onClick={onReset}>STUDIO.</h1>
           <div className="mt-12 space-y-2">
              <NavLink icon="🎞️" label="Series Overview" active={activeTab === 'architect'} onClick={() => setActiveTab('architect')} />
              <NavLink icon="👤" label="Cast Roster" active={activeTab === 'roster'} onClick={() => setActiveTab('roster')} />
              <NavLink icon="🎬" label="Director Canvas" active={activeTab === 'canvas'} onClick={() => setActiveTab('canvas')} />
              <NavLink icon="🚢" label="Publish" active={activeTab === 'publish'} onClick={() => setActiveTab('publish')} />
           </div>
        </div>
        
        <div className="mt-auto p-8 border-t border-[var(--studio-border)]">
           <div className="label-caps mb-2">Active Series</div>
           <div className="font-editorial text-sm truncate">{series.title}</div>
           <div className="mt-4 p-3 bg-[var(--studio-muted)] rounded-xl text-[10px] font-medium uppercase tracking-tighter">
             {selectedIssue ? `Next: Draft ${selectedIssue.title}` : 'Drafting Blueprint'}
           </div>
        </div>
      </nav>

      {/* 2. Primary Workspace (Center) */}
      <main className="studio-center">
        {activeTab === 'roster' && <CastRosterView series={series} />}
        {activeTab === 'architect' && <StoryArchitectView series={series} onDraft={onDraftScript} isProcessing={isProcessing} onSelectIssue={(id) => { setSelectedIssueId(id); setActiveTab('canvas'); }} />}
        {activeTab === 'canvas' && <DirectorCanvasView series={series} selectedIssue={selectedIssue} onShoot={onShootFrame} onSelectFrame={setSelectedFrameId} />}
        {activeTab === 'publish' && <PublishView series={series} />}
      </main>

      {/* 3. Director Board (Right) */}
      <aside className="studio-director">
        <div className="label-caps mb-8">Director Board</div>
        
        <div className="space-y-12">
           {/* Context Aware: Global Series */}
           {activeTab === 'architect' && (
             <div className="space-y-8 animate-studio">
                <div>
                   <label className="label-caps block mb-4">Cut Pack</label>
                   <div className="flex flex-wrap gap-2">
                      {['Modern', 'Wuxia', 'Cyber', 'Noir'].map(c => <span key={c} className={`chip ${series.style.cutPack.includes(c) ? 'chip-active' : ''}`}>{c}</span>)}
                   </div>
                </div>
                <div>
                   <label className="label-caps block mb-4">Arc Arc</label>
                   <div className="text-sm font-medium border border-black p-3 rounded-lg flex justify-between items-center">
                      {series.story.arc} <span>⌄</span>
                   </div>
                </div>
             </div>
           )}

           {/* Context Aware: Frame Selection */}
           {activeTab === 'canvas' && selectedFrameId && (
              <div className="space-y-8 animate-studio">
                 <div>
                    <label className="label-caps block mb-4">Camera Angle</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['Wide', 'Close', 'Dutch', 'Aerial'].map(c => <span key={c} className="chip text-center">{c}</span>)}
                    </div>
                 </div>
                 <div>
                    <label className="label-caps block mb-4">Emphasis</label>
                    <div className="flex flex-wrap gap-2">
                       {['Face', 'Impact', 'Hands'].map(c => <span key={c} className="chip">{c}</span>)}
                    </div>
                 </div>
                 <hr className="border-[var(--studio-border)]" />
                 <button className="w-full btn-studio btn-studio-primary py-4 uppercase tracking-widest text-xs">Reshoot Frame</button>
              </div>
           )}

           {!selectedFrameId && activeTab === 'canvas' && (
             <div className="text-center py-20 opacity-20 italic text-sm">Select a frame to adjust shots</div>
           )}
        </div>
      </aside>
    </div>
  );
};

const NavLink = ({ icon, label, active, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[var(--studio-muted)] text-black font-semibold' : 'text-gray-400 hover:text-black'}`}>
    <span>{icon}</span> <span className="text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const CastRosterView = ({ series }: { series: ShowrunnerSeries }) => (
  <div className="animate-studio">
    <header className="mb-12">
      <h2 className="text-5xl font-editorial">Cast Roster</h2>
      <p className="text-gray-400 mt-2 font-light">Managing Character Continuity & Outfits</p>
    </header>
    <div className="grid grid-cols-2 gap-8">
      {series.cast.map(c => (
        <div key={c.id} className="premium-card card-hover flex gap-6 items-center">
          <div className="w-32 h-32 bg-[var(--studio-muted)] rounded-2xl overflow-hidden flex-shrink-0">
             {c.base64 ? <img src={`data:image/jpeg;base64,${c.base64}`} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">👤</div>}
          </div>
          <div className="flex-1">
             <div className="flex justify-between items-start">
               <h4 className="text-2xl font-editorial">{c.name}</h4>
               {c.canonLocked && <span className="label-caps text-green-500">Locked</span>}
             </div>
             <p className="text-xs text-gray-500 mt-1 uppercase font-mono">{c.role}</p>
             <div className="flex gap-2 mt-4">
                {c.traits.map(t => <span key={t} className="text-[10px] bg-gray-50 px-2 py-1 rounded-md border border-gray-100">{t}</span>)}
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const StoryArchitectView = ({ series, onDraft, isProcessing, onSelectIssue }: any) => (
  <div className="animate-studio">
    <header className="mb-12">
      <h2 className="text-5xl font-editorial">Story Architect</h2>
      <p className="text-gray-400 mt-2 font-light">Series Blueprint: {series.story.arc}</p>
    </header>
    <div className="space-y-8">
      {series.story.issues.map((issue: Issue, idx: number) => (
        <div key={issue.id} className="premium-card">
           <div className="flex justify-between items-start mb-6">
              <div>
                 <div className="label-caps mb-1">Issue #0{idx+1}</div>
                 <h3 className="text-3xl font-editorial">{issue.title}</h3>
              </div>
              <IssueProgressLadder status={issue.status} />
           </div>
           <p className="text-gray-500 mb-8 max-w-2xl font-light">{issue.summary}</p>
           
           <div className="flex justify-between items-center pt-6 border-t border-[var(--studio-border)]">
              <div className="flex items-center gap-3">
                 <div className={`status-ring ${issue.status === 'Blueprint' ? 'bg-orange-400 animate-pulse' : 'bg-green-500'}`}></div>
                 <span className="text-[10px] font-mono uppercase">Next: {issue.status === 'Blueprint' ? 'Draft Beats' : 'Shoot Frames'}</span>
              </div>
              {issue.status === 'Blueprint' ? (
                <button onClick={() => onDraft(issue.id)} disabled={isProcessing} className="btn-studio btn-studio-primary px-8">
                  {isProcessing ? 'Drafting...' : 'Punch Up Dialogue'}
                </button>
              ) : (
                <button onClick={() => onSelectIssue(issue.id)} className="btn-studio">Enter Director Board</button>
              )}
           </div>
        </div>
      ))}
    </div>
  </div>
);

const IssueProgressLadder = ({ status }: { status: string }) => {
  const steps = ['Blueprint', 'Scripted', 'Boarded', 'Shot', 'Published'];
  const currentIndex = steps.indexOf(status);
  return (
    <div className="w-64">
       <div className="flex gap-1 mb-2">
          {steps.map((_, i) => <div key={i} className={`ladder-step ${i <= currentIndex ? 'ladder-step-active' : ''}`}></div>)}
       </div>
       <div className="text-right label-caps text-[8px]">{status}</div>
    </div>
  );
};

const DirectorCanvasView = ({ series, selectedIssue, onShoot, onSelectFrame }: any) => (
  <div className="animate-studio">
    <header className="mb-20">
      <div className="label-caps mb-2">Issue #01 Director Canvas</div>
      <h2 className="text-6xl font-editorial">{selectedIssue?.title}</h2>
    </header>

    <div className="webtoon-strip">
       {selectedIssue?.beats.map((beat: Beat) => (
         <div key={beat.id} className="mb-32">
            <div className="mb-12 pl-6 border-l-2 border-black">
               <div className="label-caps mb-2">Beat Notes</div>
               <p className="text-xl font-editorial text-gray-400 italic">"{beat.summary}"</p>
               <div className="flex gap-4 mt-4">
                  <span className="text-[9px] uppercase font-bold tracking-widest bg-black text-white px-2 py-0.5 rounded">Energy: {beat.energy}</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest border border-black px-2 py-0.5 rounded">Stakes: {beat.stakes}</span>
               </div>
            </div>

            <div className="space-y-1">
               {beat.frames.map((frame: Frame) => (
                 <div key={frame.id} className="webtoon-panel group relative cursor-crosshair" onClick={() => onSelectFrame(frame.id)}>
                    {frame.plateUrl ? (
                      <div className="relative overflow-hidden">
                         <img src={frame.plateUrl} alt="Frame Plate" className="w-full grayscale-[0.2] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-[1.01]" />
                         <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-12">
                            <div className="text-white">
                               <div className="label-caps text-white/60 mb-2">{frame.camera}</div>
                               <h5 className="text-3xl font-editorial mb-4">{frame.dialogue}</h5>
                               <button onClick={(e) => { e.stopPropagation(); onShoot(frame.id, beat.id, selectedIssue.id); }} className="btn-studio bg-white text-black border-white text-[10px] uppercase font-bold">Reshoot Frame</button>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="aspect-[16/9] w-full bg-[var(--studio-muted)] border-y border-[var(--studio-border)] flex flex-col items-center justify-center p-20 text-center">
                         {frame.isLoading ? (
                           <div className="animate-pulse label-caps text-black">Shooting Frame...</div>
                         ) : (
                           <>
                             <div className="label-caps text-gray-300 mb-6">{frame.camera} Lens</div>
                             <p className="text-2xl font-editorial text-gray-300 max-w-lg mb-8 italic">"{frame.beatDescription}"</p>
                             <button onClick={() => onShoot(frame.id, beat.id, selectedIssue.id)} className="btn-studio btn-studio-primary px-12 py-4">Shoot Frame</button>
                           </>
                         )}
                      </div>
                    )}
                 </div>
               ))}
            </div>
         </div>
       ))}
    </div>
  </div>
);

const PublishView = ({ series }: any) => (
  <div className="animate-studio flex flex-col items-center justify-center py-40">
    <div className="text-6xl mb-12">📦</div>
    <h2 className="text-5xl font-editorial mb-4">Ready to Publish</h2>
    <p className="text-gray-400 mb-12 text-center max-w-lg">Your Issue is packaged and ready for worldwide release. Select your distribution format below.</p>
    
    <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
       <button className="premium-card card-hover text-left">
          <div className="text-3xl mb-4">📱</div>
          <h4 className="font-editorial text-xl mb-2">Webtoon Scroll</h4>
          <p className="text-xs text-gray-500">Vertical strip optimized for mobile readers.</p>
       </button>
       <button className="premium-card card-hover text-left opacity-40">
          <div className="text-3xl mb-4">📖</div>
          <h4 className="font-editorial text-xl mb-2">Manga Pages</h4>
          <p className="text-xs text-gray-500">Standard print-ready A4/Letter spreads.</p>
       </button>
    </div>

    <button className="mt-16 btn-studio btn-studio-primary px-20 py-5 text-lg uppercase tracking-[0.2em]">Prepare Publish Bundle</button>
    <p className="mt-4 text-[10px] font-mono text-gray-300">DOWNLOAD SYSTEM TEMPORARILY CLOUD-ONLY</p>
  </div>
);
