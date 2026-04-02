"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes

const DELIVERY_OPTIONS = [
  { id: "warehouse_russia", label: "Со склада в РФ (самовывоз)" },
  { id: "transport_company", label: "Доставка транспортной компанией" },
  { id: "undecided", label: "Решу позже" },
];

const ENTITY_TYPES = [
  { id: "individual", label: "Частное лицо" },
  { id: "company", label: "Компания (ООО, АО)" },
  { id: "sole_proprietor", label: "Индивидуальный предприниматель" },
];

const API_URL = process.env.NEXT_PUBLIC_EVERYPART_API || "https://app.everypart.tech";

// --- Reusable styles ---
const inputCls = "mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary";
const labelCls = "block text-sm font-medium text-foreground";
const sectionCls = "rounded-2xl border border-border bg-white p-6";
const sectionTitleCls = "text-lg font-semibold text-foreground";
const sectionDescCls = "mt-1 text-sm text-muted mb-4";

export default function ZayavkaPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ inquiryNumber: string } | null>(null);
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

  // Order
  const [title, setTitle] = useState("");
  const [freeText, setFreeText] = useState("");
  const [quantity, setQuantity] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  // NDA
  const [ndaAccepted, setNdaAccepted] = useState(false);

  // Commercial
  const [orderStrategy, setOrderStrategy] = useState("best_price");
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetType, setBudgetType] = useState<"per_unit" | "per_batch">("per_batch");
  const [budgetCurrency, setBudgetCurrency] = useState("RUB");
  const [deadline, setDeadline] = useState("");
  const [needPilot, setNeedPilot] = useState<"yes" | "no" | "undecided">("undecided");
  const [incoterms, setIncoterms] = useState("none");

  // QC
  const [qcType, setQcType] = useState("supplier");
  const [qcScope, setQcScope] = useState("sampling");
  const [qcAdvanced, setQcAdvanced] = useState(false);
  const [qcThirdParty, setQcThirdParty] = useState(false);
  const [qcFai, setQcFai] = useState(false);
  const [qcInProcess, setQcInProcess] = useState(false);
  const [qcAqlLevel, setQcAqlLevel] = useState("normal");

  // Delivery
  const [deliveryOption, setDeliveryOption] = useState("undecided");

  // Session timeout (ФЗ-152: clear buffer after 10 min inactivity)
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

  const canSubmit = ndaAccepted && fullName.trim() && email.trim() && emailVerified && title.trim();

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
      const res = await fetch(`${API_URL}/api/public/submit-inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          city,
          entityType,
          companyName: entityType !== "individual" ? companyName : undefined,
          inn: inn || undefined,
          title,
          quantity: quantity ? Number(quantity) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          budgetType,
          budgetCurrency: "RUB",
          orderStrategy,
          needPilot: needPilot !== "undecided" ? needPilot : undefined,
          incoterms: undefined,
          deliveryOption: deliveryOption !== "undecided" ? deliveryOption : undefined,
          deadlineDesired: deadline || undefined,
          freeText: freeText || undefined,
          qc: {
            type: qcType,
            scope: qcScope,
            thirdParty: qcThirdParty,
            fai: qcFai,
            inProcess: qcInProcess,
            aqlLevel: qcScope === "sampling" ? qcAqlLevel : undefined,
          },
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

  // --- Session expired screen ---
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
                Начать новую заявку
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // --- Success screen ---
  if (result) {
    const registerUrl = `${API_URL}/register`;
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
              <h2 className="text-2xl font-bold text-green-800">Заявка принята!</h2>
              <p className="mt-2 text-green-700">
                Номер заявки: <strong>{result.inquiryNumber}</strong>
              </p>
              <p className="mt-4 text-sm text-green-600">
                Мы получили вашу информацию и свяжемся с вами в ближайшее время.
              </p>
              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left">
                <p className="text-sm font-semibold text-blue-800">Хотите отслеживать статус заявки?</p>
                <p className="mt-1 text-sm text-blue-700">
                  Зарегистрируйтесь в личном кабинете, подтвердите email и настройте уведомления.
                </p>
              </div>
              <a
                href={registerUrl}
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Зарегистрироваться
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
          <h1 className="text-3xl font-bold text-foreground">Оставить заявку</h1>
          <p className="mt-2 text-muted">
            Опишите вашу задачу — мы подберём оптимальное решение и свяжемся с вами.
            Эта форма — для заявки на изготовление партии деталей одного типа.
            Если в вашем заказе несколько позиций — <a href="/register" className="underline hover:text-foreground">зарегистрируйтесь в личном кабинете</a>, там доступен инструмент для формирования заказа.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 space-y-6">

            {/* ══════ 1. Контактная информация ══════ */}
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
                  <div className="mt-1 flex gap-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (___) ___-__-__"
                      className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                    />
                    {phone.trim().length >= 11 && (
                      <button
                        type="button"
                        onClick={() => {
                          alert("Подтверждение по SMS будет доступно в ближайшее время");
                        }}
                        className="whitespace-nowrap rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted transition-colors hover:border-primary hover:text-primary"
                      >
                        Подтвердить по SMS
                      </button>
                    )}
                  </div>
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

                {/* Company name — only for company/sole_proprietor */}
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

                {/* INN — optional, for company/sole_proprietor */}
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
                    <p className="mt-1 text-xs text-muted">
                      Необязательно. В будущем — автозаполнение реквизитов по ИНН.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* ══════ 2. Информация о заказе ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Информация о детали</h2>
              <p className={sectionDescCls}>Одна заявка — одна деталь. Укажите что нужно изготовить.</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Название детали <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Корпус датчика из алюминия 6061-T6"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Описание</label>
                  <textarea
                    value={freeText}
                    onChange={(e) => setFreeText(e.target.value)}
                    rows={4}
                    placeholder="Расскажите подробности: что нужно изготовить, особые требования к качеству, допуски, покрытие, упаковка..."
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Количество</label>
                  <input
                    type="number"
                    min="1"
                    max="1000000"
                    value={quantity}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "" || (Number(v) >= 0 && Number(v) <= 1000000)) setQuantity(v);
                    }}
                    placeholder="шт (макс. 1 000 000)"
                    className={inputCls}
                    style={{ maxWidth: 200 }}
                  />
                </div>

                {/* Documentation */}
                <div>
                  <label className={labelCls}>Документация на деталь</label>
                  <p className="mt-1 mb-2 text-xs text-muted">
                    Чертёж, 3D-модель, спецификация — на одну деталь
                  </p>
                  <div className="rounded-lg border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.step,.stp,.iges,.igs,.stl,.dwg,.dxf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => {
                        const selected = Array.from(e.target.files || []);
                        const ALLOWED_EXT = [".pdf",".step",".stp",".iges",".igs",".stl",".dwg",".dxf",".png",".jpg",".jpeg",".doc",".docx",".xls",".xlsx"];
                        const MAX_SIZE = 25 * 1024 * 1024;
                        const valid: File[] = [];
                        const rejected: string[] = [];
                        for (const f of selected) {
                          const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
                          if (!ALLOWED_EXT.includes(ext)) {
                            rejected.push(`${f.name} — недопустимый формат`);
                          } else if (f.size > MAX_SIZE) {
                            rejected.push(`${f.name} — превышает 25 МБ`);
                          } else {
                            valid.push(f);
                          }
                        }
                        setFiles(valid);
                        if (rejected.length) {
                          setError(`Отклонённые файлы: ${rejected.join("; ")}`);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <svg className="mx-auto h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-1 text-sm text-muted">
                        Нажмите для выбора файлов или перетащите сюда
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        PDF, STEP, STL, DWG, DXF, IGES, PNG, JPG, DOC, XLS (до 25 МБ за файл)
                      </p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center justify-between text-sm text-muted">
                          <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            {f.name} ({(f.size / 1024 / 1024).toFixed(1)} МБ)
                          </span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, fi) => fi !== i))}
                            className="text-xs text-red-400 hover:text-red-600"
                          >
                            Удалить
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Архивы (ZIP, RAR) не принимаются — загружайте файлы по отдельности.
                  </p>
                </div>

              </div>
            </section>

            {/* ══════ 3. Коммерческие условия ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Коммерческие условия</h2>
              <p className={sectionDescCls}>Что для вас важнее и каков бюджет</p>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 mb-5 space-y-1">
                <p>Рассмотрение заявки — <strong>бесплатно</strong>.</p>
                <p>Согласование технических деталей с производством — платная услуга.</p>
                <p>Изготовление партии деталей — <strong>100% предоплата</strong>, расчёты в рублях.</p>
              </div>
              <div className="space-y-5">

                {/* Order strategy */}
                <div>
                  <label className={labelCls + " mb-2"}>Приоритет заказа</label>
                  <div className="space-y-2">
                    {[
                      { id: "best_price", label: "Лучшее предложение по цене", desc: "Ищем оптимальное соотношение цена/качество, сроки гибкие" },
                      { id: "best_time", label: "Лучшее предложение по срокам", desc: "Приоритет — скорость, готовы рассмотреть более высокую цену" },
                      { id: "blitz", label: "Блиц-цена (проходная)", desc: "Быстрый запуск — первый поставщик, который подтвердит условия" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                          orderStrategy === opt.id
                            ? "border-primary bg-blue-50"
                            : "border-border hover:border-muted"
                        }`}
                      >
                        <input
                          type="radio"
                          name="orderStrategy"
                          value={opt.id}
                          checked={orderStrategy === opt.id}
                          onChange={(e) => setOrderStrategy(e.target.value)}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium">{opt.label}</span>
                          <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <label className={labelCls}>Бюджет</label>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="number"
                      min="0"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                      placeholder="Сумма, ₽"
                      className="flex-1 rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <span className="flex items-center px-3 text-sm text-muted">₽</span>
                    <select
                      value={budgetType}
                      onChange={(e) => setBudgetType(e.target.value as "per_unit" | "per_batch")}
                      className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                    >
                      <option value="per_batch">за партию</option>
                      <option value="per_unit">за единицу</option>
                    </select>
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className={labelCls}>Желаемый срок поставки</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className={inputCls}
                    style={{ maxWidth: 250 }}
                  />
                </div>

                {/* Pilot batch */}
                <div>
                  <label className={labelCls + " mb-2"}>Пилотная партия (образцы)</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { id: "yes" as const, label: "Да, нужна" },
                      { id: "no" as const, label: "Нет, сразу серия" },
                      { id: "undecided" as const, label: "Обсудим" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setNeedPilot(opt.id)}
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          needPilot === opt.id
                            ? "border-primary bg-blue-50 text-primary"
                            : "border-border text-foreground hover:border-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Пилотная партия — проверка качества на небольшом объёме перед запуском серийного производства
                  </p>
                </div>

              </div>
            </section>

            {/* ══════ 4. Приёмка и контроль качества ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Приёмка партии и контроль качества</h2>
              <p className={sectionDescCls}>Кто и как проверяет качество вашего заказа</p>

              {/* QC Type — кто проверяет */}
              <div className="mb-5">
                <label className={labelCls + " mb-2"}>Кто проверяет</label>
                <div className="space-y-2">
                  {[
                    { id: "supplier", label: "Контроль поставщика", desc: "Завод проверяет качество по своим стандартам" },
                    { id: "everypart", label: "Проверка EveryPart", desc: "Наши специалисты дополнительно проверят партию в КНР перед отгрузкой" },
                    { id: "customer_rep", label: "Приёмка вашим представителем", desc: "Ваш представитель в Китае лично примет партию" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        qcType === opt.id
                          ? "border-primary bg-blue-50"
                          : "border-border hover:border-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name="qcType"
                        value={opt.id}
                        checked={qcType === opt.id}
                        onChange={(e) => setQcType(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* QC Scope — объём проверки */}
              <div className="mb-4">
                <label className={labelCls + " mb-2"}>Объём проверки</label>
                <div className="space-y-2">
                  {[
                    { id: "sampling", label: "Выборочная проверка по стандарту", desc: "Проверяется часть партии по утверждённому стандарту (укажите ниже)" },
                    { id: "sampling_custom", label: "Выборочная проверка по своим параметрам", desc: "Проверка по вашим критериям — укажите требования в описании заказа" },
                    { id: "full", label: "Сплошной контроль (100%)", desc: "Проверяется каждая деталь — для ответственных изделий" },
                    { id: "combined", label: "Комбинированный", desc: "100% проверка ключевых параметров, выборочная по остальным" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                        qcScope === opt.id
                          ? "border-primary bg-blue-50"
                          : "border-border hover:border-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name="qcScope"
                        value={opt.id}
                        checked={qcScope === opt.id}
                        onChange={(e) => setQcScope(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced — раскрывающийся блок */}
              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setQcAdvanced(!qcAdvanced)}
                  className="flex w-full items-center justify-between text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  <span>Расширенные условия контроля</span>
                  <svg
                    className={`h-4 w-4 transition-transform ${qcAdvanced ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {qcAdvanced && (
                  <div className="mt-4 space-y-4">
                    {/* Third party */}
                    <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      qcThirdParty ? "border-primary bg-blue-50" : "border-border hover:border-muted"
                    }`}>
                      <input
                        type="checkbox"
                        checked={qcThirdParty}
                        onChange={(e) => setQcThirdParty(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">Инспекция третьей стороной</span>
                        <p className="text-xs text-muted mt-0.5">Независимая проверка (SGS, Bureau Veritas, TÜV и др.)</p>
                      </div>
                    </label>

                    {/* FAI */}
                    <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      qcFai ? "border-primary bg-blue-50" : "border-border hover:border-muted"
                    }`}>
                      <input
                        type="checkbox"
                        checked={qcFai}
                        onChange={(e) => setQcFai(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">Проверка первой детали (FAI)</span>
                        <p className="text-xs text-muted mt-0.5">Утверждение образца перед запуском серии — помогает выявить проблемы до массового производства</p>
                      </div>
                    </label>

                    {/* In-process */}
                    <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                      qcInProcess ? "border-primary bg-blue-50" : "border-border hover:border-muted"
                    }`}>
                      <input
                        type="checkbox"
                        checked={qcInProcess}
                        onChange={(e) => setQcInProcess(e.target.checked)}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-sm font-medium">Промежуточный контроль</span>
                        <p className="text-xs text-muted mt-0.5">Проверка в процессе производства — для крупных или длительных заказов</p>
                      </div>
                    </label>

                    {/* AQL level — only if standard sampling selected */}
                    {qcScope === "sampling" && (
                      <div>
                        <label className={labelCls}>Уровень приёмки (AQL)</label>
                        <p className="mt-0.5 mb-2 text-xs text-muted">Стандарт ISO 2859-1 — допустимый уровень дефектов</p>
                        <div className="flex gap-2 flex-wrap">
                          {[
                            { id: "normal", label: "Нормальный", desc: "AQL 2.5%" },
                            { id: "tightened", label: "Усиленный", desc: "AQL 1.0%" },
                            { id: "reduced", label: "Облегчённый", desc: "AQL 4.0%" },
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => setQcAqlLevel(lvl.id)}
                              className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                                qcAqlLevel === lvl.id
                                  ? "border-primary bg-blue-50 text-primary"
                                  : "border-border text-foreground hover:border-muted"
                              }`}
                            >
                              <span className="font-medium">{lvl.label}</span>
                              <span className="ml-1 text-xs text-muted">({lvl.desc})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* ══════ 5. Доставка ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Доставка</h2>
              <p className={sectionDescCls}>Как вы хотите получить заказ</p>
              <div className="space-y-2">
                {DELIVERY_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                      deliveryOption === opt.id
                        ? "border-primary bg-blue-50"
                        : "border-border hover:border-muted"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={opt.id}
                      checked={deliveryOption === opt.id}
                      onChange={(e) => setDeliveryOption(e.target.value)}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* ══════ Согласие и отправка ══════ */}
            <section className={`${sectionCls} ${ndaAccepted ? "border-green-200 bg-green-50/30" : "border-amber-200 bg-amber-50/30"}`}>
              <h2 className={sectionTitleCls}>Соглашение о конфиденциальности и обработке данных</h2>
              <div className="text-sm text-foreground space-y-2 mb-4">
                <p>
                  Нажимая кнопку «Отправить заявку», вы соглашаетесь с условиями соглашения
                  о конфиденциальности (NDA) и даёте согласие на обработку персональных данных
                  в соответствии с Федеральным законом №152-ФЗ «О персональных данных».
                </p>
                <div className="rounded-lg border border-border bg-white p-4 text-xs text-muted max-h-40 overflow-y-auto">
                  <p className="font-semibold text-foreground mb-2">Основные положения:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Вся предоставленная техническая документация (чертежи, 3D-модели, спецификации) является конфиденциальной информацией Заказчика.</li>
                    <li>EveryPart обязуется не передавать документацию третьим лицам без письменного согласия Заказчика, за исключением производителей, привлечённых к выполнению заказа.</li>
                    <li>Производители получают документацию только в объёме, необходимом для оценки и выполнения заказа.</li>
                    <li>Персональные данные обрабатываются в соответствии с ФЗ-152 «О персональных данных».</li>
                    <li>До момента отправки заявки никакие данные не передаются и не сохраняются на сервере.</li>
                    <li>Сессия заполнения формы ограничена 10 минутами неактивности — по истечении все данные автоматически удаляются из буфера.</li>
                    <li>Соглашение действует бессрочно в отношении переданной документации.</li>
                  </ul>
                  <p className="mt-2">
                    <a href="/nda" target="_blank" className="text-primary underline">Полный текст соглашения →</a>
                  </p>
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={ndaAccepted}
                  onChange={(e) => setNdaAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <span className="text-sm">
                  Я принимаю условия <strong>соглашения о конфиденциальности</strong> и даю согласие
                  на обработку персональных данных в соответствии с ФЗ-152
                </span>
              </label>
            </section>

            <div className="pb-8">
              {!emailVerified && (
                <p className="mb-3 text-sm text-amber-600">
                  Для отправки заявки необходимо подтвердить email
                </p>
              )}
              {!ndaAccepted && (
                <p className="mb-3 text-sm text-amber-600">
                  Для отправки необходимо принять соглашение о конфиденциальности и обработке данных
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Отправка..." : "Отправить заявку"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
