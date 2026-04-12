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

export function CreateProjectLeftCol({  cities, skills, userTeams }: Props) {
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
    <form id="create-project-form" action={formAction} className="flex flex-col gap-3 md:gap-5">
      {state?.error && (
        <div className="bg-red-50 border-[1.5px] border-red-200 rounded-[12px] px-4 py-3 text-[0.84rem] font-semibold text-red-600">
          {state.error}
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
              className="flex-1 outline-none text-[0.88rem] text-slate-900 bg-transparent placeholder:text-slate-400"
              type="text"
              name="title"
              placeholder="örn. İklim Değişikliği Farkındalık Belgeseli"
              maxLength={80}
            />
          </InputWithIcon>
        </FormGroup>

        <FormGroup label="Ne İhtiyacın Var?" required hint="— Fikir değil, ihtiyaç yaz">
          <textarea
            className="form-input resize-y min-h-[80px] md:min-h-[100px] leading-relaxed"
            name="description"
            placeholder="Hangi sorunu çözüyorsun, ekiple ne yapmak istiyorsun? İnsanlar başvurmadan önce bunu okuyacak."
            maxLength={500}
          />
        </FormGroup>
      </FormCard>

      {/* KONUM & KATEGORİ */}
      <FormCard id="section-location" title="📍 Konum & Kategori" sub="Ekibini nerede ve hangi alanda arıyorsun?">
        <FormGroup label="">
          <div className="flex items-center justify-between bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-3 py-2.5 md:px-4 md:py-3">
            <div>
              <div className="text-[0.88rem] font-bold text-slate-900">🌐 Remote Uyumlu</div>
              <div className="text-[0.74rem] text-slate-400 mt-0.5">Uzaktan çalışmaya açıksanız işaretle</div>
            </div>
            <label className="relative w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0 absolute"
                name="is_remote"
                value="on"
                checked={isRemote}
                onChange={(e) => setIsRemote(e.target.checked)}
              />
              <div className={`absolute inset-0 rounded-full transition-colors ${isRemote ? "bg-blue-600" : "bg-slate-200"}`} />
              <div className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform ${isRemote ? "translate-x-[23px]" : "translate-x-[3px]"}`} />
            </label>
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
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[0.8rem]">▾</span>
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
        {/* Mod toggle — sadece ekibi olan kullanıcılara göster */}
        {userTeams.length > 0 && (
          <div className="flex gap-1.5 bg-slate-100 rounded-[11px] p-1 mb-1">
            <button
              type="button"
              onClick={() => setTeamMode("existing")}
              className={`flex-1 text-[0.82rem] font-bold rounded-[8px] py-2 transition-all ${
                teamMode === "existing"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              🤝 Mevcut Ekiplerimden
            </button>
            <button
              type="button"
              onClick={() => setTeamMode("new")}
              className={`flex-1 text-[0.82rem] font-bold rounded-[8px] py-2 transition-all ${
                teamMode === "new"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              ✨ Sıfırdan Belirle
            </button>
          </div>
        )}

        {/* Mevcut ekip seçimi */}
        {teamMode === "existing" && (
          <div className="flex flex-col gap-2.5">
            {userTeams.map((team) => {
              const isSelected = selectedTeamId === team.id;
              return (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setSelectedTeamId(team.id)}
                  className={`flex items-center gap-2.5 rounded-[11px] px-3 py-2.5 md:px-4 md:py-3 border-[1.5px] text-left transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 ${isSelected ? "bg-blue-100" : "bg-white border-[1.5px] border-slate-200"}`}>
                    {team.is_leader ? "👑" : "👤"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[0.88rem] font-bold truncate ${isSelected ? "text-blue-700" : "text-slate-900"}`}>
                      {team.name}
                    </div>
                    <div className="text-[0.74rem] text-slate-400 mt-0.5">
                      {team.is_leader ? "Lider" : "Üye"} · {TEAM_STATUS_LABEL[team.status] ?? team.status}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "border-blue-600 bg-blue-600" : "border-slate-300"}`}>
                    {isSelected && <span className="text-white text-[0.6rem]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Sıfırdan rol ekleme */}
        {teamMode === "new" && (
          <>
            {roles.length > 0 && (
              <div id="roles-list" className="flex flex-col gap-2.5 mb-3.5">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2.5 bg-slate-50 border-[1.5px] border-slate-200 rounded-[11px] px-4 py-3 transition-colors hover:border-slate-300"
                  >
                    <span className="text-slate-300 cursor-grab text-base">⠿</span>
                    <span className="flex-1 text-[0.88rem] font-bold text-slate-900">{role.name}</span>
                    <div className="flex items-center gap-1 bg-white border-[1.5px] border-slate-200 rounded-[8px] p-0.5">
                      <button
                        type="button"
                        onClick={() => changeCount(role.id, -1)}
                        className="w-6 h-6 rounded-[6px] border-none bg-transparent cursor-pointer text-[0.9rem] text-slate-400 flex items-center justify-center transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        −
                      </button>
                      <span className="font-nunito font-black text-[0.88rem] min-w-[18px] text-center">
                        {role.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeCount(role.id, 1)}
                        className="w-6 h-6 rounded-[6px] border-none bg-transparent cursor-pointer text-[0.9rem] text-slate-400 flex items-center justify-center transition-colors hover:bg-slate-50 hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRole(role.id)}
                      className="w-7 h-7 rounded-[7px] border-none bg-transparent cursor-pointer text-slate-300 flex items-center justify-center text-base transition-all hover:bg-red-50 hover:text-red-500"
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
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[0.8rem]">▾</span>
              </div>
              <button
                type="button"
                onClick={addRole}
                disabled={!selectedSkillId || roles.length >= 6}
                className="bg-blue-50 text-blue-600 border-[1.5px] border-blue-200 rounded-[10px] font-nunito font-extrabold text-[0.86rem] px-4 py-[0.7rem] cursor-pointer whitespace-nowrap transition-all flex items-center gap-1 hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
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
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[0.8rem]">▾</span>
            </div>
          </FormGroup>
        </div>

        <FormGroup label="Bağlantı" hint="— opsiyonel">
          <InputWithIcon icon="🔗">
            <input
              className="flex-1 outline-none text-[0.88rem] text-slate-900 bg-transparent placeholder:text-slate-400"
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
    <div className="flex items-center gap-2.5 border-[1.5px] border-slate-200 rounded-[11px] px-3.5 py-[0.65rem] bg-white focus-within:border-blue-600 transition-colors">
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
    <div id={id} className="bg-white border-[1.5px] border-slate-200 lg:rounded-[18px] p-[1.8rem]">
      <div className="font-nunito font-black text-[1.05rem] text-slate-900 mb-1 flex items-center gap-[0.45rem]">
        {title}
      </div>
      <div className="text-[0.81rem] text-slate-400 mb-5">{sub}</div>
      <div className="flex flex-col gap-4">{children}</div>
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
        <label className="block text-[0.82rem] font-bold text-slate-900 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
          {hint && <span className="text-[0.72rem] text-slate-400 font-normal ml-1">{hint}</span>}
        </label>
      )}
      {children}
    </div>
  );
}
