"use client";

import { useActionState, useState } from "react";
import { createProject } from "@/features/projects/actions";
import type { CategoryOption, CityOption, SkillOption, UserTeamOption } from "@/features/projects/actions";

interface Role {
  id: number;
  skillId: string;
  name: string;
  count: number;
}

type TeamMode = "existing" | "new";

const DURATION_OPTIONS = [
  "Belirtilmemiş",
  "1–4 hafta",
  "1–3 ay",
  "3–6 ay",
  "Uzun vadeli",
];

const TEAM_STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  pending: "Kuruldu",
  no_project: "Projesi yok",
};

interface Props {
  categories: CategoryOption[];
  cities: CityOption[];
  skills: SkillOption[];
  userTeams: UserTeamOption[];
}

export function CreateProjectLeftCol({ cities, skills, userTeams }: Props) {
  const [state, formAction] = useActionState(createProject, null);
  const [isRemote, setIsRemote] = useState(false);
  const [selectedCategoryId] = useState<string | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [nextId, setNextId] = useState(1);
  const [teamMode, setTeamMode] = useState<TeamMode>(userTeams.length > 0 ? "existing" : "new");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(
    userTeams.length > 0 ? userTeams[0].id : null
  );

  function addRole() {
    if (!selectedSkillId || roles.length >= 6) return;
    if (roles.some((r) => r.skillId === selectedSkillId)) return;
    const skill = skills.find((s) => s.id === selectedSkillId);
    if (!skill) return;
    setRoles((prev) => [...prev, { id: nextId, skillId: skill.id, name: skill.name, count: 1 }]);
    setNextId((n) => n + 1);
    setSelectedSkillId("");
  }

  function removeRole(id: number) {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }

  function changeCount(id: number, delta: number) {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, count: Math.max(1, r.count + delta) } : r
      )
    );
  }

  const availableSkills = skills.filter((s) => !roles.some((r) => r.skillId === s.id));
  const serializedRoles = JSON.stringify(
    roles.map((r) => ({ name: r.name, count: r.count, skillIds: [r.skillId] }))
  );

  return (
    <form id="create-project-form" action={formAction} className="flex flex-col gap-5">
      {state?.error && (
        <div className="bg-danger-surface border border-danger rounded-lg px-4 py-3">
          <p className="text-body text-danger">{state.error}</p>
        </div>
      )}

      <input type="hidden" name="category_id" value={selectedCategoryId ?? ""} />
      <input type="hidden" name="roles" value={teamMode === "new" ? serializedRoles : ""} />
      <input type="hidden" name="team_id" value={teamMode === "existing" ? (selectedTeamId ?? "") : ""} />

      {/* TEMEL BİLGİLER */}
      <FormCard id="section-basics" title="📋 Temel Bilgiler" sub="Projenin ne olduğunu ve ne aradığını kısaca anlat.">
        <FormGroup label="Proje Başlığı" required>
          <InputWithIcon icon="✏️">
            <input
              className="flex-1 outline-none text-body text-ink bg-transparent placeholder:text-ink-subtle"
              type="text"
              name="title"
              placeholder="örn. İklim Değişikliği Farkındalık Belgeseli"
              maxLength={80}
            />
          </InputWithIcon>
        </FormGroup>

        <FormGroup label="Ne İhtiyacın Var?" required hint="— Fikir değil, ihtiyaç yaz">
          <textarea
            name="description"
            placeholder="Hangi sorunu çözüyorsun, ekiple ne yapmak istiyorsun? İnsanlar başvurmadan önce bunu okuyacak."
            maxLength={500}
            className="form-input resize-y min-h-[100px] leading-relaxed rounded-[11px]"
          />
        </FormGroup>
      </FormCard>

      {/* KONUM & KATEGORİ */}
      <FormCard id="section-location" title="📍 Konum & Kategori" sub="Ekibini nerede ve hangi alanda arıyorsun?">
        <FormGroup label="">
          <div className="flex items-center justify-between bg-canvas border-[1.5px] border-edge rounded-[11px] px-4 py-3">
            <label htmlFor="is_remote" className="cursor-pointer">
              <div className="text-body font-bold text-ink">🌐 Remote Uyumlu</div>
              <div className="text-meta text-ink-subtle mt-0.5">Uzaktan çalışmaya açıksanız işaretle</div>
            </label>
            <input type="hidden" name="is_remote" value={isRemote ? "on" : ""} />
            <button
              type="button"
              role="switch"
              aria-checked={isRemote}
              id="is_remote"
              onClick={() => setIsRemote(!isRemote)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isRemote ? "bg-brand" : "bg-edge"}`}
            >
              <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${isRemote ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        </FormGroup>

        <FormGroup label="Şehir" required>
          <div className="relative">
            <select className="form-input appearance-none pr-8" name="city" defaultValue="">
              <option value="" disabled>Şehir seçin...</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none text-caption">▾</span>
          </div>
        </FormGroup>
      </FormCard>

      {/* EKİBİ BELİRLE */}
      <FormCard
        id="section-roles"
        title="👥 Ekibi Belirle"
        sub={
          teamMode === "existing"
            ? "Projeyi mevcut ekiplerinden biriyle başlat."
            : "Hangi becerilere sahip kişilere ihtiyacın var? En az 1, en fazla 6 rol ekleyebilirsin."
        }
      >
        {userTeams.length > 0 && (
          <div className="flex gap-1.5 bg-slate-100 rounded-[11px] p-1 mb-1">
            <button
              type="button"
              onClick={() => setTeamMode("existing")}
              className={`flex-1 text-caption font-bold rounded-[8px] py-2 transition-all ${
                teamMode === "existing"
                  ? "bg-canvas text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink-muted"
              }`}
            >
              🤝 Mevcut Ekiplerimden
            </button>
            <button
              type="button"
              onClick={() => setTeamMode("new")}
              className={`flex-1 text-caption font-bold rounded-[8px] py-2 transition-all ${
                teamMode === "new"
                  ? "bg-canvas text-ink shadow-sm"
                  : "text-ink-subtle hover:text-ink-muted"
              }`}
            >
              ✨ Sıfırdan Belirle
            </button>
          </div>
        )}

        {teamMode === "existing" && (
          <div className="flex flex-col gap-2.5">
            {userTeams.map((team) => {
              const isSelected = selectedTeamId === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`flex items-center gap-3 rounded-[11px] border-[1.5px] px-4 py-3 text-left transition-all w-full ${
                    isSelected
                      ? "border-brand bg-brand-surface"
                      : "border-edge bg-canvas"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${isSelected ? "bg-brand-surface" : "bg-canvas border-[1.5px] border-edge"}`}>
                    {team.is_leader ? "👑" : "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-body font-bold truncate ${isSelected ? "text-brand" : "text-ink"}`}>
                      {team.name}
                    </div>
                    <div className="text-meta text-ink-subtle mt-0.5">
                      {team.is_leader ? "Lider" : "Üye"} · {TEAM_STATUS_LABEL[team.status] ?? team.status}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-brand bg-brand" : "border-edge"}`}>
                    {isSelected && <span className="text-white text-label">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {teamMode === "new" && (
          <>
            {roles.length > 0 && (
              <div id="roles-list" className="flex flex-col gap-2.5 mb-3.5">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2.5 bg-canvas border-[1.5px] border-edge rounded-[11px] px-4 py-3 transition-colors hover:border-edge"
                  >
                    <span className="text-ink-subtle cursor-grab text-base">⠿</span>
                    <span className="flex-1 text-body font-bold text-ink">{role.name}</span>
                    <div className="flex items-center gap-1 bg-canvas border-[1.5px] border-edge rounded-[8px] p-0.5">
                      <button
                        type="button"
                        onClick={() => changeCount(role.id, -1)}
                        className="w-6 h-6 rounded-[6px] text-ink-subtle hover:bg-slate-100 flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="font-nunito font-black text-body min-w-[18px] text-center">
                        {role.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeCount(role.id, 1)}
                        className="w-6 h-6 rounded-[6px] text-ink-subtle hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRole(role.id)}
                      className="w-7 h-7 rounded-[7px] text-ink-subtle hover:bg-danger-surface hover:text-danger flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div id="roles-input" className="flex gap-2.5">
              <div className="relative flex-1">
                <select
                  className="form-input appearance-none pr-8 w-full"
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  disabled={roles.length >= 6 || availableSkills.length === 0}
                >
                  <option value="">
                    {availableSkills.length === 0 ? "Tüm beceriler eklendi" : "Beceri seçin..."}
                  </option>
                  {availableSkills.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none text-caption">▾</span>
              </div>
              <button
                type="button"
                onClick={addRole}
                disabled={!selectedSkillId || roles.length >= 6}
                className="font-nunito font-extrabold border-[1.5px] border-brand-surface text-brand bg-brand-surface hover:bg-brand hover:text-white hover:border-brand whitespace-nowrap px-4 py-[0.72rem] rounded-[11px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ＋ Ekle
              </button>
            </div>
          </>
        )}
      </FormCard>

      {/* ZAMAN DİLİMİ */}
      <FormCard id="section-timeline" title="⏳ Zaman Dilimi" sub="Projenin ne zaman başlayacağını belirt. Bu ekip bulmayı hızlandırır.">
        <div className="grid grid-cols-2 gap-3.5">
          <FormGroup label="Tahmini Başlangıç">
            <input className="form-input" type="date" name="start_date" />
          </FormGroup>
          <FormGroup label="Süre" hint="— opsiyonel">
            <div className="relative">
              <select className="form-input appearance-none pr-8" name="duration">
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none text-caption">▾</span>
            </div>
          </FormGroup>
        </div>

        <FormGroup label="Bağlantı" hint="— opsiyonel">
          <InputWithIcon icon="🔗">
            <input
              className="flex-1 outline-none text-body text-ink bg-transparent placeholder:text-ink-subtle"
              type="url"
              name="link"
              placeholder="Proje dosyası, Notion, Drive linki..."
            />
          </InputWithIcon>
        </FormGroup>
      </FormCard>
    </form>
  );
}

/* ---- Alt bileşenler ---- */

interface InputWithIconProps {
  icon: string;
  children: React.ReactNode;
}

function InputWithIcon({ icon, children }: InputWithIconProps) {
  return (
    <div className="flex items-center gap-2.5 border-[1.5px] border-edge rounded-[11px] px-3.5 py-[0.65rem] bg-canvas focus-within:border-brand transition-colors">
      <span className="shrink-0 text-base pointer-events-none select-none">{icon}</span>
      {children}
    </div>
  );
}

interface FormCardProps {
  id?: string;
  title: string;
  sub: React.ReactNode;
  children: React.ReactNode;
}

function FormCard({ id, title, sub, children }: FormCardProps) {
  return (
    <div id={id} className="bg-surface rounded-lg border border-edge shadow-card">
      <div className="px-6 pt-6 pb-0">
        <h2 className="font-nunito font-black text-title text-ink">{title}</h2>
        <p className="text-caption text-ink-subtle mt-1">{sub}</p>
      </div>
      <div className="flex flex-col gap-4 px-6 pt-5 pb-6">
        {children}
      </div>
    </div>
  );
}

interface FormGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

function FormGroup({ label, required, hint, children }: FormGroupProps) {
  return (
    <div>
      {label && (
        <label className="block text-caption font-bold text-ink mb-1.5">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
          {hint && <span className="text-meta text-ink-subtle font-normal ml-1">{hint}</span>}
        </label>
      )}
      {children}
    </div>
  );
}
