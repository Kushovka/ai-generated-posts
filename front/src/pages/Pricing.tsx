import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, getAccessToken } from "../auth/authStorage";
import TopNavigation from "../shared/TopNavigation";

type PricingPlan = {
  name: string;
  price: number;
  credits: number;
  description: string;
};

type CreatePaymentResponse = {
  payment_url: string;
};

const apiBaseUrl = "http://localhost:8000";

const accentByIndex = [
  "from-cyan-300/20 to-slate-950/40",
  "from-emerald-300/20 to-slate-950/40",
  "from-amber-300/20 to-slate-950/40",
];

const formatPrice = (value: number) =>
  `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;

const formatCredits = (value: number) => `${value} запросов`;

const Pricing = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingPlanName, setPayingPlanName] = useState("");

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate("/login");
  };

  const getAuthHeaders = () => {
    const token = getAccessToken();

    if (!token) {
      return null;
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setError("");
        const { data } = await axios.get(`${apiBaseUrl}/pricing/plans`);
        setPlans(data);
      } catch (requestError) {
        console.error("Failed to fetch pricing plans", requestError);
        setError("Не удалось загрузить тарифы. Попробуй обновить страницу.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchPlans();
  }, []);

  const handleCreatePayment = async (planName: string) => {
    const headers = getAuthHeaders();

    if (!headers) {
      handleUnauthorized();
      return;
    }

    setPayingPlanName(planName);
    setError("");

    try {
      const { data } = await axios.post<CreatePaymentResponse>(
        `${apiBaseUrl}/payments/create`,
        {
          plan_name: planName,
        },
        {
          headers,
        },
      );

      if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      console.error("Failed to create payment", requestError);
      setError("Не удалось создать оплату. Попробуй еще раз.");
    } finally {
      setPayingPlanName("");
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <TopNavigation />

      <div className="relative mx-auto max-w-[1750px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl sm:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-amber-200">
              Pricing
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Пакеты запросов для генерации писем
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Тарифы загружаются напрямую с бэкенда через `GET /pricing/plans`.
              При выборе пакета фронт отправляет `POST /payments/create` с
              `plan_name` и переводит пользователя на страницу оплаты.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-10 rounded-[28px] border border-white/10 bg-slate-950/45 p-6 text-sm text-slate-300">
              Загружаем тарифы...
            </div>
          ) : error ? (
            <div className="mt-10 rounded-[28px] border border-rose-400/20 bg-rose-400/10 p-6 text-sm text-rose-100">
              {error}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <article
                  key={plan.name}
                  className={`rounded-[28px] border border-white/10 bg-gradient-to-br ${
                    accentByIndex[index % accentByIndex.length]
                  } p-6 shadow-[0_18px_60px_rgba(15,23,42,0.35)]`}
                >
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-300">
                    {plan.name}
                  </div>
                  <div className="mt-4 text-4xl font-black text-white">
                    {formatPrice(plan.price)}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-cyan-100">
                    {formatCredits(plan.credits)}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    {plan.description}
                  </p>
                  <button
                    className="mt-8 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={payingPlanName === plan.name}
                    onClick={() => handleCreatePayment(plan.name)}
                    type="button"
                  >
                    {payingPlanName === plan.name
                      ? "Переходим к оплате..."
                      : "Выбрать пакет"}
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/45 p-6">
            <div className="text-sm font-semibold text-white">
              Что дальше можно подключить
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Подтверждение успешной оплаты, автоматическое обновление кредитов и
              отдельную страницу истории платежей.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Pricing;
