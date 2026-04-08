import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopNavigation from "../shared/TopNavigation";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/pricing", { replace: true });
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <TopNavigation />

      <div className="relative mx-auto max-w-[1750px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl sm:px-8">
          <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-emerald-200">
            Payment Success
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Оплата прошла успешно
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
            Сейчас вернем тебя обратно на страницу тарифов, чтобы можно было
            продолжить работу с пакетами и проверить обновления.
          </p>
          <button
            className="mt-8 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            onClick={() => navigate("/pricing", { replace: true })}
            type="button"
          >
            Вернуться сейчас
          </button>
        </section>
      </div>
    </div>
  );
};

export default PaymentSuccess;
