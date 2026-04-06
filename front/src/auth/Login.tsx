import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveAuthToken } from "./authStorage";

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.registeredEmail ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Введи email и пароль.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const { data } = await axios.post("http://localhost:8000/users/login", {
        email: email.trim(),
        password,
      });

      saveAuthToken(data.access_token, data.token_type);
      navigate("/content");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const detail = requestError.response?.data?.detail;

        if (typeof detail === "string") {
          setError(detail);
        } else {
          setError("Не удалось войти. Проверь email и пароль.");
        }
      } else {
        setError("Не удалось войти. Проверь email и пароль.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-4 text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/60 p-8 shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">
          Login
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-white">
          Вход в аккаунт
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Здесь используется твой Swagger-эндпоинт `POST /users/login`. После успешного ответа сохраняем `access_token` и открываем контент.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              className={inputClassName}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="mail@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Пароль
            </label>
            <input
              className={inputClassName}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Kushov"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          <button
            className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-300">
          Еще нет аккаунта?{" "}
          <Link className="font-semibold text-cyan-200 hover:text-cyan-100" to="/register">
            Перейти к регистрации
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
