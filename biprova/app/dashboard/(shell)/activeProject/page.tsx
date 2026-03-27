"use client";

import { useState } from "react";

import { ChatPanel } from "./_components/chat-panel";
import { LeftNav } from "./_components/left-nav";
import { PostsPanel } from "./_components/posts-panel";
import { ProjectDetailPanel } from "./_components/project-detail-panel";
import { ProjectHeader } from "./_components/project-header";

type Panel = "chat" | "posts" | "detail";

export default function ActiveProjectPage() {
  const [activePanel, setActivePanel] = useState<Panel>("chat");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ProjectHeader />
      <div className="flex flex-1 overflow-hidden">
        <LeftNav activePanel={activePanel} onSwitch={setActivePanel} />
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {activePanel === "chat" && <ChatPanel />}
          {activePanel === "posts" && <PostsPanel />}
          {activePanel === "detail" && <ProjectDetailPanel />}
        </div>
      </div>
    </div>
  );
}
