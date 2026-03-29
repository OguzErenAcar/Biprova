"use client";

import { useState } from 'react';
import type { ProjectDetail } from '@/features/projects/actions';
import { ProjectTopbar } from './project-topbar';
import { PanelGenel } from './panel-genel';
import { PanelGorevler } from './panel-gorevler';
import { PanelChat } from './panel-chat';
import { PanelDosyalar } from './panel-dosyalar';
import { PanelGonderiler } from './panel-gonderiler';

type Tab = 'genel' | 'gorevler' | 'chat' | 'dosyalar' | 'gonderiler';

interface Props {
  project: ProjectDetail;
}

export function ProjectTabView({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('genel');

  const TABS: { key: Tab; label: string; count?: number }[] = [
    { key: 'genel',      label: '📋 Genel' },
    { key: 'gorevler',   label: '✅ Görevler' },
    { key: 'chat',       label: '💬 Chat',      count: project.messages.length },
    { key: 'dosyalar',   label: '📁 Dosyalar' },
    { key: 'gonderiler', label: '📢 Gönderiler' },
  ];

  return (
    <>
      <ProjectTopbar title={project.title} status={project.status} />

      {/* Tabs */}
      <div
        id="project-tabs"
        className="flex border-b border-slate-200 bg-white px-6 sticky top-[53px] z-30"
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-[0.82rem] font-bold px-4 py-3 cursor-pointer border-b-2 transition-all whitespace-nowrap flex items-center gap-1 bg-transparent ${
              activeTab === tab.key
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-400 border-transparent hover:text-slate-700'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="bg-slate-100 rounded-full text-[0.65rem] px-[0.4rem] py-[0.1rem] font-extrabold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'genel' && (
          <PanelGenel
            project={project}
            onGoToChat={() => setActiveTab('chat')}
            onGoToTasks={() => setActiveTab('gorevler')}
            onGoToFiles={() => setActiveTab('dosyalar')}
          />
        )}

        {activeTab === 'gorevler' && <PanelGorevler />}

        {activeTab === 'chat' && project.team_id ? (
          <PanelChat
            teamId={project.team_id}
            messages={project.messages}
            viewerId={project.viewer.id}
          />
        ) : activeTab === 'chat' ? (
          <div className="text-[0.84rem] text-slate-400 text-center py-12">
            Ekip kurulduktan sonra chat aktif olacak.
          </div>
        ) : null}

        {activeTab === 'dosyalar' && <PanelDosyalar />}

        {activeTab === 'gonderiler' && project.team_id ? (
          <PanelGonderiler
            teamId={project.team_id}
            teamName={project.team_name}
            posts={project.posts}
            viewerId={project.viewer.id}
            viewerName={project.viewer.name}
          />
        ) : activeTab === 'gonderiler' ? (
          <div className="text-[0.84rem] text-slate-400 text-center py-12">
            Ekip kurulduktan sonra gönderi paylaşabilirsiniz.
          </div>
        ) : null}
      </div>
    </>
  );
}
