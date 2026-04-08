import { NavLink, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../auth/authStorage";

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-cyan-300 text-slate-950"
      : "text-slate-300 hover:bg-white/5 hover:text-white",
  ].join(" ");

const TopNavigation = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate("/login");
  };

  return (
    <div className="relative mx-auto max-w-[1750px] px-4 pt-6 sm:px-6 lg:px-8">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/45 px-4 py-4 shadow-[0_18px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300 text-sm font-black text-slate-950">
              CL
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Cover Letter Studio
              </div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                AI assistant for job applications
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NavLink className={navLinkClassName} to="/content">
              Генератор
            </NavLink>
            <NavLink className={navLinkClassName} to="/pricing">
              Тарифы
            </NavLink>
            <NavLink className={navLinkClassName} to="/about">
              О нас
            </NavLink>
          </div>

          <button
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            onClick={handleLogout}
            type="button"
          >
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
