import axios from "axios";
import { useEffect, useState } from "react";

type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at?: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
};

type AIPost = {
  id: string;
  topic: string;
  tone: string;
  length: string;
  language: string;
  title: string;
  content: string;
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20";

const selectClassName =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-300/60 focus:bg-white/10 focus:ring-2 focus:ring-cyan-300/20 text-white";

const cardClassName =
  "relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)] backdrop-blur-xl";

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [aiposts, setAiposts] = useState<AIPost[]>([]);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [length, setLength] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/users/");
        setUsers(data);
      } catch (e) {}
    };
    getUser();
  }, []);

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/posts/");
        setPosts(data);
      } catch (e) {}
    };
    getPost();
  }, []);

  useEffect(() => {
    const getAIPost = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/ai/");
        setAiposts(data);
      } catch (e) {}
    };
    getAIPost();
  }, []);

  const addUser = async () => {
    try {
      await axios.post("http://localhost:8000/users/", {
        last_name: name,
        email,
        first_name: surname,
      });
      await axios.get("http://localhost:8000/users/");
      setName("");
      setSurname("");
      setEmail("");
    } catch (e) {}
  };

  const addPost = async () => {
    try {
      await axios.post("http://localhost:8000/posts/", {
        title,
        description,
      });
      await axios.get("http://localhost:8000/posts/");
      setDescription("");
      setTitle("");
    } catch (e) {}
  };

  const addAIPost = async () => {
    try {
      await axios.post("http://localhost:8000/ai/generate-post", {
        topic,
        tone,
        length,
        language,
      });
      await axios.get("http://localhost:8000/ai/");
      setTopic("");
      setTone("");
      setLength("");
      setLanguage("");
    } catch (e) {}
  };

  return (
    <div className="relative min-h-screen bg-[#07111f] text-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/5 px-6 py-8 shadow-[0_24px_120px_rgba(8,15,30,0.55)] backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.28em] text-cyan-200">
                Content Studio
              </span>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Панель для пользователей, постов и AI-генерации
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Всё на одной странице: создавай пользователей, публикуй
                обычные посты и генерируй тексты через ИИ в аккуратном,
                читаемом интерфейсе.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center">
                <div className="text-2xl font-black text-white">{users.length}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  users
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center">
                <div className="text-2xl font-black text-white">{posts.length}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  posts
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-center">
                <div className="text-2xl font-black text-white">{aiposts.length}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-400">
                  ai posts
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-3">
          <section className={cardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">
                  User Creation
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Создание пользователя
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Форма регистрации и список уже созданных пользователей.
                </p>
              </div>
              <div className="rounded-2xl bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
                {users.length} шт.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Имя
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Кирилл"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Фамилия
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Например, Кушов"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="mail@example.com"
                />
              </div>
              <button
                className="w-full rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                onClick={addUser}
              >
                Зарегистрировать
              </button>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                  Последние пользователи
                </h3>
              </div>
              <div className="space-y-3">
                {users.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
                    Пользователи пока не найдены.
                  </div>
                ) : (
                  users.map((user) => (
                    <article
                      key={user.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-white">
                            {user.first_name} {user.last_name}
                          </h4>
                          <p className="mt-1 text-sm text-slate-300">
                            {user.email}
                          </p>
                        </div>
                        <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                          ID
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className={cardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                  Post Builder
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Создание поста
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Минималистичная форма для публикации обычных постов.
                </p>
              </div>
              <div className="rounded-2xl bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-100">
                {posts.length} шт.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Заголовок
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="О чём пост?"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Описание
                </label>
                <textarea
                  className={`${inputClassName} min-h-32 resize-none`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Коротко раскрой мысль поста"
                />
              </div>
              <button
                className="w-full rounded-2xl bg-amber-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-200"
                onClick={addPost}
              >
                Создать пост
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                Лента постов
              </h3>
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
                  Постов пока нет.
                </div>
              ) : (
                posts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <h4 className="font-semibold text-white">{post.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {post.description}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className={cardClassName}>
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
                  AI Generator
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white">
                  Генерация поста с ИИ
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Задай тему, стиль и язык, а затем получи готовый материал.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100">
                {aiposts.length} шт.
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Тема
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Например, история React"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">
                  Тон
                </label>
                <input
                  className={inputClassName}
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  placeholder="Friendly, Expert, Casual..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Длина
                  </label>
                  <select
                    className={selectClassName}
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                  >
                    <option value="" disabled className="text-slate-500 bg-slate-950">
                      Выбери вариант
                    </option>
                    <option value="small" className="bg-slate-950 text-white">
                      small
                    </option>
                    <option value="high" className="bg-slate-950 text-white">
                      high
                    </option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Язык
                  </label>
                  <select
                    className={selectClassName}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="" disabled className="text-slate-500 bg-slate-950">
                      Выбери язык
                    </option>
                    <option value="Russian" className="bg-slate-950 text-white">
                      Russian
                    </option>
                    <option value="English" className="bg-slate-950 text-white">
                      English
                    </option>
                  </select>
                </div>
              </div>
              <button
                className="w-full rounded-2xl bg-emerald-300 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-200"
                onClick={addAIPost}
              >
                Сгенерировать пост
              </button>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">
                AI результаты
              </h3>
              {aiposts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
                  Сгенерированных постов пока нет.
                </div>
              ) : (
                aiposts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs text-emerald-100">
                        {post.language || "No language"}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {post.tone || "No tone"}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-300">
                        {post.length || "No length"}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold text-white">
                      {post.title || `Post about ${post.topic}`}
                    </h4>
                    <p className="mt-2 text-sm text-slate-400">
                      Тема: {post.topic}
                    </p>
                    <p className="mt-3 max-h-52 overflow-hidden whitespace-pre-line text-sm leading-6 text-slate-300">
                      {post.content}
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

export default App;
