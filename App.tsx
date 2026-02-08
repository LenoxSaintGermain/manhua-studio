
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
  ShowrunnerSeries, 
  CastMember, 
  CutPack, 
  ArcTemplate, 
  Issue,
  Beat,
  Frame
} from './types';
import { useApiKey } from './useApiKey';
import { ApiKeyDialog } from './ApiKeyDialog';
import { Workspace } from './components/Workspace';
import { Onboarding } from './components/Onboarding';

const MODEL_PRO = "gemini-3-pro-preview";
const MODEL_IMAGE = "gemini-2.5-flash-image";

const App: React.FC = () => {
  const { validateApiKey, setShowApiKeyDialog, showApiKeyDialog, handleApiKeyDialogContinue } = useApiKey();

  const [series, setSeries] = useState<ShowrunnerSeries | null>(null);
  const [currentView, setCurrentView] = useState<'onboarding' | 'dashboard'>('onboarding');
  const [isProcessing, setIsProcessing] = useState(false);

  const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

  const handleAPIError = (e: any) => {
    const msg = String(e);
    if (msg.includes('entity was not found') || msg.toLowerCase().includes('permission denied')) {
      setShowApiKeyDialog(true);
    }
  };

  const createSeries = async (title: string, path: 'scratch' | 'premise' | 'refs', premise?: string) => {
    const hasKey = await validateApiKey();
    if (!hasKey) return;

    setIsProcessing(true);
    
    const newSeries: ShowrunnerSeries = {
      title: title || "New Series",
      language: "en-US",
      cast: [],
      style: { cutPack: 'Manhua Modern', mood: 'Balanced', canonLock: 'Strict' },
      story: { arc: "Hero's Journey", pace: "Balanced", issues: [] }
    };

    try {
      const ai = getAI();
      const prompt = `Act as a master Showrunner. Based on the title "${title}" and concept "${premise || 'A clean slate'}", draft:
      1. A Cast Roster of 3 primary characters with distinct archetypes and appearances.
      2. A 3-Issue story arc outline.
      Output JSON: { 
        "cast": [{ "name": "...", "role": "Protagonist", "archetype": "...", "appearance": "...", "traits": ["A", "B"] }],
        "outline": [{ "title": "...", "summary": "..." }]
      }`;

      const res = await ai.models.generateContent({
        model: MODEL_PRO,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(res.text || '{}');
      newSeries.cast = data.cast.map((c: any) => ({ 
        ...c, 
        id: Math.random().toString(36).substr(2, 9),
        canonLocked: true,
        outfitCount: 1,
        expressionCount: 1
      }));
      newSeries.story.issues = data.outline.map((e: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: e.title,
        summary: e.summary,
        beats: [],
        status: 'Blueprint'
      }));
    } catch (e) {
      handleAPIError(e);
    }

    setSeries(newSeries);
    setCurrentView('dashboard');
    setIsProcessing(false);
  };

  const draftIssueScript = async (issueId: string) => {
    if (!series) return;
    setIsProcessing(true);

    try {
      const ai = getAI();
      const issue = series.story.issues.find(i => i.id === issueId);
      if (!issue) return;

      const prompt = `Punch Up Dialogue and Beats for Issue: ${issue.title}. Summary: ${issue.summary}. 
      Cut Pack: ${series.style.cutPack}. Arc: ${series.story.arc}.
      Break this into 3 high-energy Beats, each with 2-3 Frames.
      For each Frame provide: caption, punchy dialogue, and a vivid visual beatDescription in English.
      Output JSON: { "beats": [{ "summary": "...", "frames": [{ "caption": "...", "dialogue": "...", "beatDescription": "...", "camera": "Wide" }] }] }`;

      const res = await ai.models.generateContent({
        model: MODEL_PRO,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(res.text || '{}');
      const beats: Beat[] = data.beats.map((b: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        summary: b.summary,
        stakes: 'Local',
        energy: 'Tense',
        frames: b.frames.map((f: any) => ({
          ...f,
          id: Math.random().toString(36).substr(2, 9),
          isLoading: false
        }))
      }));

      setSeries(prev => {
        if (!prev) return null;
        return {
          ...prev,
          story: {
            ...prev.story,
            issues: prev.story.issues.map(i => i.id === issueId ? { ...i, beats, status: 'Boarded' } : i)
          }
        };
      });
    } catch (e) {
      handleAPIError(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const shootFrame = async (frameId: string, beatId: string, issueId: string) => {
    if (!series) return;
    
    // Set loading
    setSeries(prev => {
      if (!prev) return null;
      return {
        ...prev,
        story: {
          ...prev.story,
          issues: prev.story.issues.map(i => i.id === issueId ? {
            ...i,
            beats: i.beats.map(b => b.id === beatId ? {
              ...b,
              frames: b.frames.map(f => f.id === frameId ? { ...f, isLoading: true } : f)
            } : b)
          } : i)
        }
      };
    });

    try {
      const ai = getAI();
      const issue = series.story.issues.find(i => i.id === issueId);
      const beat = issue?.beats.find(b => b.id === beatId);
      const frame = beat?.frames.find(f => f.id === frameId);

      if (!frame) return;

      const styleContext = `Art Direction: ${series.style.cutPack} graphic novel. Mood: Cinematic. High fidelity ink and digital paint.`;
      const castContext = series.cast.map(c => `${c.name} (${c.role}): ${c.appearance}`).join('. ');
      
      const res = await ai.models.generateContent({
        model: MODEL_IMAGE,
        contents: `FRAME SHOOT. ${styleContext}. Cast Reference: ${castContext}. ACTION: ${frame.beatDescription}. Camera: ${frame.camera}. Dialogue: ${frame.dialogue || ''}.`,
        config: { imageConfig: { aspectRatio: '16:9' } }
      });

      const part = res.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      const plateUrl = part?.inlineData?.data ? `data:image/jpeg;base64,${part.inlineData.data}` : '';

      setSeries(prev => {
        if (!prev) return null;
        return {
          ...prev,
          story: {
            ...prev.story,
            issues: prev.story.issues.map(i => i.id === issueId ? {
              ...i,
              beats: i.beats.map(b => b.id === beatId ? {
                ...b,
                frames: b.frames.map(f => f.id === frameId ? { ...f, plateUrl, isLoading: false } : f)
              } : b)
            } : i)
          }
        };
      });
    } catch (e) {
      handleAPIError(e);
    }
  };

  return (
    <div className="min-h-screen">
      {showApiKeyDialog && <ApiKeyDialog onContinue={handleApiKeyDialogContinue} />}
      
      {currentView === 'onboarding' ? (
        <Onboarding onCreate={createSeries} isGenerating={isProcessing} />
      ) : (
        <Workspace 
          series={series!} 
          onDraftScript={draftIssueScript} 
          onShootFrame={shootFrame}
          isProcessing={isProcessing}
          onReset={() => setCurrentView('onboarding')}
        />
      )}
    </div>
  );
};

export default App;
