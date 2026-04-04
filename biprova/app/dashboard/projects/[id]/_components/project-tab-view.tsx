"use client";

import { useState } from 'react';
import type { ProjectDetail } from '@/features/projects/actions';
import { ProjectTopbar } from './project-topbar';
import { PanelGenel } from './panel-genel';
import { PanelGorevler } from './panel-gorevler';
import { PanelChat } from './panel-chat';
import { PanelDosyalar } from './panel-dosyalar';
import { PanelGonderiler } from './panel-gonderiler';
import { PanelEkip } from './panel-ekip';

type Tab = 'genel' | 'ekip' | 'gorevler' | 'chat' | 'dosyalar' | 'gonderiler';

interface Props {
  project: ProjectDetail;
}

export function ProjectTabView({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('genel');
  const hasTeam = !!project.team_id;
  const pendingCount = project.applications.filter((a) => a.status === 'pending').length;

  const TABS: { key: Tab; label: string; count?: number; requiresTeam: boolean; comingSoon?: boolean }[] = [
    { key: 'genel',      label: '📋 Genel',      requiresTeam: false },
    { key: 'ekip',       label: '👥 Ekip',        requiresTeam: false, count: project.viewer.is_project_leader ? pendingCount : undefined },
    { key: 'chat',       label: '💬 Chat',        requiresTeam: true,  count: project.messages.length },
    { key: 'gorevler',   label: '✅ Görevler',    requiresTeam: true,  comingSoon: true },
    { key: 'dosyalar',   label: '📁 Dosyalar',    requiresTeam: true,  comingSoon: true },
    { key: 'gonderiler', label: '📢 Gönderiler',  requiresTeam: true,  comingSoon: true },
  ];

  return (
    <>
      <ProjectTopbar title={project.title} status={project.status} hasTeam={hasTeam} />

      {/* Tabs */}
      <div
        id="project-tabs"
        className="flex border-b border-slate-200 bg-white px-6 sticky top-[53px] z-30"
      >
        {TABS.map((tab) => {
          const disabled = tab.comingSoon || (tab.requiresTeam && !hasTeam);
          const title = tab.comingSoon ? 'Yakında' : disabled ? 'Ekip kurulduktan sonra aktif olur' : undefined;
          return (
            <button
              key={tab.key}
              onClick={() => !disabled && setActiveTab(tab.key)}
              disabled={disabled}
              title={title}
              className={`text-[0.82rem] font-bold px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center gap-1 bg-transparent ${
                disabled
                  ? 'text-slate-300 border-transparent cursor-not-allowed'
                  : activeTab === tab.key
                  ? 'text-blue-600 border-blue-600 cursor-pointer'
                  : 'text-slate-400 border-transparent hover:text-slate-700 cursor-pointer'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-blue-600 text-white rounded-full text-[0.6rem] px-[0.4rem] py-[0.1rem] font-extrabold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
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

        {activeTab === 'ekip' && <PanelEkip project={project} />}

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
