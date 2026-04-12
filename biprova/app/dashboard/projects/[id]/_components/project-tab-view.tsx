"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { animate } from 'animejs';
import { ChevronLeft, ChevronRight, LayoutList, Shield, Users, MessageCircle, Megaphone, Folder, ListTodo } from 'lucide-react';
import type { ProjectDetail } from '@/features/projects/actions';
import { PanelGenel } from './panel-genel';
import { PanelGorevler } from './panel-gorevler';
import { PanelChat } from './panel-chat';
import { PanelDosyalar } from './panel-dosyalar';
import { PanelGonderiler } from './panel-gonderiler';
import { PanelEkip } from './panel-ekip';
import { PanelAdmin } from './panel-admin';

type Tab = 'genel' | 'admin' | 'ekip' | 'gorevler' | 'chat' | 'dosyalar' | 'gonderiler';

interface Props {
  project: ProjectDetail;
}

export function ProjectTabView({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('genel');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const hasTeam = !!project.team_id;

  useEffect(() => {
    if (!contentRef.current) return;
    animate(contentRef.current, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 220,
      easing: 'easeOutQuad',
    });
  }, [activeTab]);

  const updateScrollState = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    tabsRef.current?.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' });
  };

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
      {/* Tabs */}
      <div
        id="project-tabs"
        className="sticky top-0 z-30 backdrop-blur-[12px] border-b text-white"
      >
        <div className="relative flex items-center">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 h-full px-1 flex items-center bg-gradient-to-r from-white/80 to-transparent text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Sola kaydır"
            >
              <ChevronLeft size={16} />
            </button>
          )}

          {/* Scrollable tab list */}
          <div
            ref={tabsRef}
            className="flex overflow-x-auto scrollbar-hide px-2 sm:px-6"
          >
            {visibleTabs.map((tab) => {
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
                      ? tab.key === 'admin'
                        ? 'text-slate-900 border-indigo-600 cursor-pointer'
                        : 'text-slate-900 border-blue-600 cursor-pointer'
                      : 'border-transparent hover:text-slate-700 cursor-pointer'
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

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 h-full px-1 flex items-center bg-gradient-to-l from-white/80 to-transparent text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Sağa kaydır"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-4 sm:p-6 pb-[calc(1rem+56px)] lg:pb-6">
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
            members={project.members}
            category={project.category}
            city={project.city}
            isRemote={project.is_remote}
            viewerId={project.viewer.id}
            viewerName={project.viewer.name}
            isLeader={isLeader}
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
