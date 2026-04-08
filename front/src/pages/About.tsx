import TopNavigation from "../shared/TopNavigation";

const features = [
  {
    title: "Быстрый отклик",
    text: "Сервис помогает быстро собирать письмо под конкретную вакансию без ручной рутины.",
  },
  {
    title: "Личный кабинет",
    text: "Пользователь видит свои письма, историю генераций и количество оставшихся кредитов.",
  },
  {
    title: "Фокус на результате",
    text: "Интерфейс сделан так, чтобы ты тратил время на отклики, а не на борьбу с формой.",
  },
];

const About = () => {
  return (
    <div className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <TopNavigation />

      <div className="relative mx-auto max-w-[1750px] px-4 pb-10 pt-8 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/10 bg-white/5 px-6 py-10 shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl sm:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
              About
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
              Что это за сервис
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Это аккуратный AI-инструмент для создания сопроводительных писем под
              реальные вакансии. Пользователь авторизуется, получает кредиты,
              вставляет описание вакансии и быстро получает готовый текст.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-white/10 bg-slate-950/45 p-6"
              >
                <div className="text-lg font-semibold text-white">
                  {feature.title}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-cyan-300/10 to-slate-950/50 p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-cyan-200">
              Для кого
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
              Для студентов, начинающих специалистов и всех, кто хочет быстрее
              адаптировать сопроводительное письмо под разные вакансии без потери
              качества и структуры.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
