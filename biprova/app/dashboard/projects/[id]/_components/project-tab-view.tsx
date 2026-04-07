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
import { PanelAdmin } from './panel-admin';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Tab = 'genel' | 'admin' | 'ekip' | 'gorevler' | 'chat' | 'dosyalar' | 'gonderiler';

interface Props {
  project: ProjectDetail;
}

export function ProjectTabView({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('genel');
  const hasTeam = !!project.team_id;
  const isLeader = project.viewer.is_project_leader;
  const pendingCount = project.applications.filter((a) => a.status === 'pending').length;

  const TABS: {
    key: Tab;
    label: string;
    count?: number;
    requiresTeam: boolean;
    comingSoon?: boolean;
    leaderOnly?: boolean;
  }[] = [
    { key: 'genel',      label: '📋 Genel',      requiresTeam: false },
    { key: 'admin',      label: '🛡️ Admin',       requiresTeam: false, leaderOnly: true, count: isLeader ? pendingCount : undefined },
    { key: 'ekip',       label: '👥 Ekip',        requiresTeam: false },
    { key: 'chat',       label: '💬 Chat',        requiresTeam: true,  count: project.messages.length },
    { key: 'gonderiler', label: '📢 Gönderiler',  requiresTeam: false },
    { key: 'dosyalar',   label: '📁 Dosyalar',    requiresTeam: true,  comingSoon: true },
    { key: 'gorevler',   label: '✅ Görevler',    requiresTeam: true,  comingSoon: true },
  ];

  const visibleTabs = TABS.filter((tab) => !tab.leaderOnly || isLeader);

  return (
    <>
      <ProjectTopbar title={project.title} status={project.status} hasTeam={hasTeam} />

      {/* Tabs */}
      <div
        id="project-tabs"
        className="flex border-b border-edge bg-canvas px-6 sticky top-[53px] z-30"
      >
        {visibleTabs.map((tab) => {
          const disabled = tab.comingSoon || (tab.requiresTeam && !hasTeam);
          const title = tab.comingSoon ? 'Yakında' : disabled ? 'Ekip kurulduktan sonra aktif olur' : undefined;
          const isActive = activeTab === tab.key;
          return (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => !disabled && setActiveTab(tab.key)}
              disabled={disabled}
              title={title}
              className={`text-caption font-bold px-4 py-3 border-b-2 rounded-none transition-all whitespace-nowrap gap-1 h-auto ${
                disabled
                  ? 'text-ink-subtle border-transparent cursor-not-allowed'
                  : isActive
                  ? tab.key === 'admin'
                    ? 'text-brand border-brand hover:bg-transparent'
                    : 'text-brand border-brand hover:bg-transparent'
                  : 'text-ink-subtle border-transparent hover:text-ink-muted hover:bg-transparent'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <Badge className="bg-brand text-white text-label px-[0.4rem] py-[0.1rem] font-extrabold rounded-full h-auto">
                  {tab.count}
                </Badge>
              )}
            </Button>
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

        {activeTab === 'admin' && isLeader && <PanelAdmin project={project} />}

        {activeTab === 'ekip' && <PanelEkip project={project} />}

        {activeTab === 'gorevler' && <PanelGorevler />}

        {activeTab === 'chat' && project.team_id ? (
          <PanelChat
            teamId={project.team_id}
            messages={project.messages}
            viewerId={project.viewer.id}
          />
        ) : activeTab === 'chat' ? (
          <div className="text-body text-ink-subtle text-center py-12">
            Ekip kurulduktan sonra chat aktif olacak.
          </div>
        ) : null}

        {activeTab === 'dosyalar' && <PanelDosyalar />}

        {activeTab === 'gonderiler' && project.team_id ? (
          <PanelGonderiler
            teamId={project.team_id}
            teamName={project.team_name}
            posts={project.posts}
            members={project.members}
            category={project.category}
            city={project.city}
            isRemote={project.is_remote}
            viewerId={project.viewer.id}
            viewerName={project.viewer.name}
            isLeader={isLeader}
          />
        ) : activeTab === 'gonderiler' ? (
          <div className="text-body text-ink-subtle text-center py-12">
            Ekip kurulduktan sonra gönderi paylaşabilirsiniz.
          </div>
        ) : null}
      </div>
    </>
  );
}
