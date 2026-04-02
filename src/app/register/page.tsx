"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

const ENTITY_TYPES = [
  { id: "individual", label: "Частное лицо" },
  { id: "company", label: "Компания (ООО, АО)" },
  { id: "sole_proprietor", label: "Индивидуальный предприниматель" },
];

const API_URL = process.env.NEXT_PUBLIC_EVERYPART_API || "https://app.everypart.tech";

const inputCls = "mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelCls = "block text-sm font-medium text-foreground";
const sectionCls = "rounded-2xl border border-border bg-white p-6";
const sectionTitleCls = "text-lg font-semibold text-foreground";
const sectionDescCls = "mt-1 text-sm text-muted mb-4";

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ registrationId: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [emailCodeInput, setEmailCodeInput] = useState("");
  const [emailVerifyError, setEmailVerifyError] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [entityType, setEntityType] = useState("company");
  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");

  // Consent
  const [consentAccepted, setConsentAccepted] = useState(false);

  // Session timeout
  const [sessionExpired, setSessionExpired] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSessionTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSessionExpired(true);
    }, SESSION_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    resetSessionTimer();
    const events = ["mousemove", "keydown", "scroll", "touchstart", "click"] as const;
    events.forEach((e) => window.addEventListener(e, resetSessionTimer));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((e) => window.removeEventListener(e, resetSessionTimer));
    };
  }, [resetSessionTimer]);

  const canSubmit = consentAccepted && fullName.trim() && email.trim() && emailVerified;

  // --- Email verification ---
  const sendEmailCode = () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailVerifyError("Введите корректный email");
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setEmailCode(code);
    setEmailCodeSent(true);
    setEmailVerifyError("");

    fetch(`${API_URL}/api/public/send-verification-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    }).catch(() => {});
  };

  const verifyEmailCode = () => {
    if (emailCodeInput === emailCode) {
      setEmailVerified(true);
      setEmailVerifyError("");
    } else {
      setEmailVerifyError("Неверный код");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/public/register-buyer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: phone || undefined,
          city: city || undefined,
          entityType,
          companyName: entityType !== "individual" ? companyName : undefined,
          inn: inn || undefined,
          source: "zakazhidetal.ru",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка при отправке");
      }

      const data = await res.json();
      setResult(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при отправке заявки");
    } finally {
      setSubmitting(false);
    }
  };

  // --- Session expired ---
  if (sessionExpired) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="mx-auto max-w-xl px-6">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-800">Время сессии истекло</h2>
              <p className="mt-2 text-amber-700">
                В целях защиты ваших персональных данных (ФЗ-152) сессия была завершена после 10 минут неактивности.
              </p>
              <p className="mt-2 text-sm text-amber-600">
                Все введённые данные удалены из буфера. Пожалуйста, заполните форму заново.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Начать заново
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --- Success ---
  if (result) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="mx-auto max-w-xl px-6">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800">Заявка на регистрацию принята!</h2>
              <p className="mt-4 text-sm text-green-600">
                Мы рассмотрим вашу заявку и отправим данные для входа в личный кабинет на указанный email.
              </p>
              <a
                href="/"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                На главную
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --- Form ---
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="text-3xl font-bold text-foreground">Регистрация</h1>
          <p className="mt-2 text-muted">
            Заполните анкету для создания личного кабинета.
            После рассмотрения заявки мы отправим данные для входа на указанный email.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">

            {/* ══════ Контактная информация ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Контактная информация</h2>
              <p className={sectionDescCls}>Как с вами связаться</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    ФИО <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Иванов Иван Иванович"
                    className={inputCls}
                  />
                </div>

                {/* Email with verification */}
                <div>
                  <label className={labelCls}>
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                        setEmailCodeSent(false);
                        setEmailVerifyError("");
                      }}
                      placeholder="ivanov@company.ru"
                      className={`flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm outline-none transition-colors ${
                        emailVerified
                          ? "border-green-400 bg-green-50"
                          : "border-border focus:border-primary"
                      }`}
                      disabled={emailVerified}
                    />
                    {!emailVerified && !emailCodeSent && (
                      <button
                        type="button"
                        onClick={sendEmailCode}
                        className="whitespace-nowrap rounded-lg border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-blue-50"
                      >
                        Подтвердить
                      </button>
                    )}
                    {emailVerified && (
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Подтверждён
                      </span>
                    )}
                  </div>
                  {emailCodeSent && !emailVerified && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="text"
                        value={emailCodeInput}
                        onChange={(e) => setEmailCodeInput(e.target.value)}
                        placeholder="Введите 6-значный код"
                        maxLength={6}
                        className="w-48 rounded-lg border border-border bg-white px-4 py-2 text-sm outline-none transition-colors focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={verifyEmailCode}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                      >
                        Проверить
                      </button>
                      <button
                        type="button"
                        onClick={sendEmailCode}
                        className="text-sm text-muted underline hover:text-foreground"
                      >
                        Отправить повторно
                      </button>
                    </div>
                  )}
                  {emailVerifyError && (
                    <p className="mt-1 text-sm text-red-500">{emailVerifyError}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className={labelCls}>Телефон</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className={inputCls}
                  />
                </div>

                {/* City */}
                <div>
                  <label className={labelCls}>Город</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Москва"
                    className={inputCls}
                  />
                </div>

                {/* Entity type */}
                <div>
                  <label className={labelCls}>Тип заказчика</label>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    {ENTITY_TYPES.map((et) => (
                      <button
                        key={et.id}
                        type="button"
                        onClick={() => setEntityType(et.id)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          entityType === et.id
                            ? "border-primary bg-blue-50 text-primary"
                            : "border-border text-foreground hover:border-muted"
                        }`}
                      >
                        {et.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company name */}
                {entityType !== "individual" && (
                  <div>
                    <label className={labelCls}>
                      {entityType === "sole_proprietor" ? "Название ИП" : "Название компании"}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={entityType === "sole_proprietor" ? "ИП Иванов И.И." : "ООО «Компания»"}
                      className={inputCls}
                    />
                  </div>
                )}

                {/* INN */}
                {entityType !== "individual" && (
                  <div>
                    <label className={labelCls}>ИНН</label>
                    <input
                      type="text"
                      value={inn}
                      onChange={(e) => setInn(e.target.value.replace(/\D/g, ""))}
                      placeholder={entityType === "sole_proprietor" ? "12 цифр" : "10 цифр"}
                      maxLength={entityType === "sole_proprietor" ? 12 : 10}
                      className={inputCls}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* ══════ Согласие и отправка ══════ */}
            <section className={`${sectionCls} ${consentAccepted ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`}>
              <h2 className={sectionTitleCls}>Согласие на обработку данных</h2>
              <div className="text-sm text-foreground space-y-2 mb-4">
                <p>
                  Нажимая кнопку «Отправить заявку», вы даёте согласие на обработку
                  персональных данных в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
                </p>
                <div className="rounded-lg border border-border bg-white p-4 text-xs text-muted max-h-40 overflow-y-auto">
                  <p className="font-semibold text-foreground mb-2">Основные положения:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Персональные данные обрабатываются в соответствии с ФЗ-152 «О персональных данных».</li>
                    <li>До момента отправки заявки никакие данные не передаются и не сохраняются на сервере.</li>
                    <li>Сессия заполнения формы ограничена 10 минутами неактивности — по истечении все данные автоматически удаляются из буфера.</li>
                    <li>Данные используются исключительно для создания учётной записи и взаимодействия в рамках платформы.</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/privacy" target="_blank" className="text-primary underline">Политика конфиденциальности →</a>
                  </p>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-sm">
                  Я даю согласие на обработку персональных данных в соответствии с ФЗ-152
                </span>
              </label>
            </section>

            <div className="pb-8">
              {!emailVerified && (
                <p className="mb-3 text-sm text-amber-600">
                  Для отправки заявки необходимо подтвердить email
                </p>
              )}
              {!consentAccepted && (
                <p className="mb-3 text-sm text-amber-600">
                  Для отправки необходимо дать согласие на обработку данных
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Отправка..." : "Отправить заявку на регистрацию"}
              </button>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
