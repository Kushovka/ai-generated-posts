import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthToken, getAccessToken } from "../auth/authStorage";

type CoverLetter = {
  id: string;
  company_name: string;
  vacancy_text: string;
  applicant_name: string;
  language: string;
  cover_letter: string;
};

type CurrentUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20";

const selectClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20";

const cardClassName =
  "relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl";

const apiBaseUrl = "http://localhost:8000";

const Content = () => {
  const navigate = useNavigate();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [vacancyText, setVacancyText] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [language, setLanguage] = useState("Russian");
  const [coverLetterError, setCoverLetterError] = useState("");
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  const handleLogout = () => {
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

  const handleUnauthorized = () => {
    clearAuthToken();
    navigate("/login");
  };

  const fetchCoverLetters = async () => {
    const headers = getAuthHeaders();

    if (!headers) {
      setIsGeneratingCoverLetter(false);
      handleUnauthorized();
      return;
    }

    try {
      const { data } = await axios.get(`${apiBaseUrl}/ai/cover-letters`, {
        headers,
      });
      setCoverLetters(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      console.error("Failed to fetch cover letters", error);
    }
  };

  const fetchCurrentUser = async () => {
    const headers = getAuthHeaders();

    if (!headers) {
      handleUnauthorized();
      return;
    }

    try {
      const { data } = await axios.get(`${apiBaseUrl}/users/me`, {
        headers,
      });
      setCurrentUser(data);
      setApplicantName(
        (prevValue) =>
          prevValue || `${data.first_name} ${data.last_name}`.trim(),
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        handleUnauthorized();
        return;
      }

      console.error("Failed to fetch current user", error);
    }
  };

  useEffect(() => {
    void fetchCurrentUser();
    void fetchCoverLetters();
  }, []);

  const addCoverLetter = async () => {
    if (!companyName.trim() || !vacancyText.trim() || !applicantName.trim()) {
      setCoverLetterError(
        "Заполни компанию, текст вакансии и имя кандидата.",
      );
      return;
    }

    setCoverLetterError("");
    setIsGeneratingCoverLetter(true);

    const headers = getAuthHeaders();

    if (!headers) {
      handleUnauthorized();
      return;
    }

    try {
      await axios.post(
        `${apiBaseUrl}/ai/generate-cover-letter`,
        {
          company_name: companyName.trim(),
          vacancy_text: vacancyText.trim(),
          applicant_name: applicantName.trim(),
          language,
        },
        {
          headers,
        },
      );

      await fetchCoverLetters();
      setCompanyName("");
      setVacancyText("");
      setApplicantName("");
      setLanguage("Russian");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          handleUnauthorized();
          return;
        }

        const detail = error.response?.data?.detail;

        if (typeof detail === "string") {
          setCoverLetterError(detail);
        } else {
          setCoverLetterError(
            "Не получилось сгенерировать сопроводительное письмо. Проверь поля и попробуй еще раз.",
          );
        }
      } else {
        setCoverLetterError(
          "Не получилось сгенерировать сопроводительное письмо. Проверь поля и попробуй еще раз.",
        );
      }
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 pt-10 sm:px-6 lg:px-8">
        <section className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl sm:px-8">
          <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-stretch">
            <div className="relative">
              <div className="absolute -left-8 top-0 h-28 w-28 rounded-full bg-cyan-300/10 blur-3xl" />
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
                Cover Letter Studio
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Генерация сопроводительных писем
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Вставь компанию, текст вакансии и имя кандидата. Сервис отправит
                запрос в AI, соберет сопроводительное письмо и сразу покажет
                историю последних генераций.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Формат
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    Company + Vacancy + Applicant
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Endpoint
                  </div>
                  <div className="mt-1 text-sm font-semibold text-white">
                    POST /ai/generate-cover-letter
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] xl:grid-cols-1">
              {currentUser ? (
                <div className="rounded-[28px] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/12 via-slate-950/40 to-slate-950/70 px-5 py-5 text-left shadow-[0_12px_40px_rgba(34,211,238,0.08)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.24em] text-cyan-100/80">
                        Current User
                      </div>
                      <div className="mt-2 text-lg font-semibold text-white">
                        {[currentUser.first_name, currentUser.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      </div>
                      <div className="mt-1 text-sm text-slate-300">
                        {currentUser.email}
                      </div>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-cyan-100">
                      {currentUser.first_name?.[0]}
                      {currentUser.last_name?.[0]}
                    </div>
                  </div>
                  {currentUser.created_at ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-xs text-slate-300">
                      С нами с{" "}
                      {new Date(currentUser.created_at).toLocaleDateString(
                        "ru-RU",
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_auto]">
                <div className="rounded-[28px] border border-white/10 bg-slate-900/60 px-6 py-5 text-center">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    cover letters
                  </div>
                  <div className="mt-2 text-3xl font-black text-white">
                    {coverLetters.length}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    уже доступно в истории
                  </div>
                </div>

                <button
                  className="rounded-[28px] border border-white/10 bg-white/5 px-6 py-5 text-sm font-semibold text-white transition hover:bg-white/10 xl:min-w-[150px]"
                  onClick={handleLogout}
                  type="button"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 pb-10 xl:grid-cols-[0.95fr_1.05fr]">
          <section className={cardClassName}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                Cover Letter AI
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Сгенерировать новое письмо
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Компания
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="ООО Сима-ленд"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Текст вакансии
                </label>
                <textarea
                  className={`${inputClassName} min-h-48 resize-none`}
                  value={vacancyText}
                  onChange={(event) => setVacancyText(event.target.value)}
                  placeholder="Вставь требования, обязанности и условия вакансии"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Имя кандидата
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={applicantName}
                  onChange={(event) => setApplicantName(event.target.value)}
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Язык
                </label>
                <select
                  className={selectClassName}
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  <option value="Russian" className="bg-slate-950 text-white">
                    Russian
                  </option>
                  <option value="English" className="bg-slate-950 text-white">
                    English
                  </option>
                </select>
              </div>

              {coverLetterError ? (
                <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {coverLetterError}
                </div>
              ) : null}

              <button
                className="w-full rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
                onClick={addCoverLetter}
                type="button"
              >
                {isGeneratingCoverLetter
                  ? "Генерируем письмо..."
                  : "Сгенерировать сопроводительное письмо"}
              </button>
            </div>
          </section>

          <section className={cardClassName}>
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
                History
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                История писем
              </h2>
            </div>

            <div className="space-y-3">
              {coverLetters.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
                  Сопроводительных писем пока нет.
                </div>
              ) : (
                coverLetters.map((letter) => (
                  <article
                    key={letter.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100">
                        {letter.language || "No language"}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {letter.company_name}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold text-white">
                      {letter.applicant_name}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">
                      Вакансия для: {letter.company_name}
                    </p>
                    <p className="mt-3 max-h-72 overflow-auto whitespace-pre-line text-sm leading-6 text-slate-300">
                      {letter.cover_letter}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Content;
