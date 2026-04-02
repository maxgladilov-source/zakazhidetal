"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DELIVERY_OPTIONS = [
  { id: "warehouse_china", label: "Со склада в Китае" },
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

  // Commercial
  const [budgetMax, setBudgetMax] = useState("");
  const [budgetType, setBudgetType] = useState<"per_unit" | "per_batch">("per_batch");
  const [deadline, setDeadline] = useState("");

  // QC
  // placeholder — will be expanded later

  // Delivery
  const [deliveryOption, setDeliveryOption] = useState("undecided");

  const canSubmit = fullName.trim() && email.trim() && emailVerified && title.trim();

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
          deliveryOption: deliveryOption !== "undecided" ? deliveryOption : undefined,
          deadlineDesired: deadline || undefined,
          freeText: freeText || undefined,
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
              <h2 className={sectionTitleCls}>Информация о заказе</h2>
              <p className={sectionDescCls}>Что нужно изготовить</p>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Название заказа <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Например: Корпус датчика из алюминия, 500 шт"
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
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="шт"
                    className={inputCls}
                    style={{ maxWidth: 200 }}
                  />
                </div>

                {/* Documentation */}
                <div>
                  <label className={labelCls}>Документация</label>
                  <p className="mt-1 mb-2 text-xs text-muted">
                    Чертежи, 3D-модели, ТЗ, фотографии — всё, что поможет оценить заказ
                  </p>
                  <div className="rounded-lg border-2 border-dashed border-border p-5 text-center transition-colors hover:border-primary">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.step,.stp,.iges,.igs,.stl,.dwg,.dxf,.png,.jpg,.jpeg,.zip,.rar,.doc,.docx,.xls,.xlsx"
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
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
                        PDF, STEP, STL, DWG, DXF, PNG, JPG, DOC, XLS, ZIP (до 25 МБ)
                      </p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-3 space-y-1">
                      {files.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted">
                          <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          {f.name} ({(f.size / 1024 / 1024).toFixed(1)} МБ)
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    Загрузка файлов будет доступна в следующей версии. Пока приложите их к письму после отправки заявки.
                  </p>
                </div>
              </div>
            </section>

            {/* ══════ 3. Коммерческие условия ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Коммерческие условия</h2>
              <p className={sectionDescCls}>Бюджет и сроки — заполните что знаете, остальное обсудим</p>
              <div className="space-y-4">
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
                    <select
                      value={budgetType}
                      onChange={(e) => setBudgetType(e.target.value as "per_unit" | "per_batch")}
                      className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                    >
                      <option value="per_batch">за всю партию</option>
                      <option value="per_unit">за единицу</option>
                    </select>
                  </div>
                </div>

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
              </div>
            </section>

            {/* ══════ 4. Приёмка и контроль качества ══════ */}
            <section className={sectionCls}>
              <h2 className={sectionTitleCls}>Приёмка партии и контроль качества</h2>
              <p className={sectionDescCls}>Требования к проверке качества — раздел в разработке</p>
              <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted">
                Здесь будет выбор методов контроля качества: визуальный осмотр, измерение размеров, CMM,
                испытания на прочность, сертификация материалов и другие опции.
                <br /><br />
                Если у вас есть особые требования к контролю качества, укажите их в описании заказа выше.
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

            {/* ══════ Submit ══════ */}
            <div className="pb-8">
              {!emailVerified && (
                <p className="mb-3 text-sm text-amber-600">
                  Для отправки заявки необходимо подтвердить email
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="w-full rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Отправка..." : "Отправить заявку"}
              </button>
              <p className="mt-3 text-center text-xs text-muted">
                Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
