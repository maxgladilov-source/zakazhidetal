"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TECHNOLOGIES = [
  { id: "cnc_milling", label: "Фрезеровка ЧПУ" },
  { id: "cnc_turning", label: "Токарная ЧПУ" },
  { id: "cnc_multi_axis", label: "Многоосевая ЧПУ" },
  { id: "sheet_laser", label: "Лазерная резка" },
  { id: "sheet_bending", label: "Гибка" },
  { id: "sheet_welding", label: "Сварка" },
  { id: "3d_fdm", label: "3D-печать FDM" },
  { id: "3d_sla", label: "3D-печать SLA" },
  { id: "3d_sls", label: "3D-печать SLS" },
  { id: "injection_molding", label: "Литьё под давлением" },
  { id: "vacuum_casting", label: "Вакуумное литьё" },
  { id: "die_casting", label: "Литьё в кокиль" },
  { id: "surface_anodizing", label: "Анодирование" },
  { id: "surface_powder_coat", label: "Порошковая окраска" },
];

const MATERIALS = [
  { id: "al6061", label: "Алюминий 6061" },
  { id: "al7075", label: "Алюминий 7075" },
  { id: "steel_45", label: "Сталь 45" },
  { id: "steel_304", label: "Нержавеющая 304" },
  { id: "steel_316", label: "Нержавеющая 316" },
  { id: "titanium_gr5", label: "Титан Grade 5" },
  { id: "copper_c110", label: "Медь" },
  { id: "brass_c360", label: "Латунь" },
  { id: "abs", label: "ABS" },
  { id: "pa_nylon", label: "Нейлон (PA)" },
  { id: "pc", label: "Поликарбонат (PC)" },
  { id: "pom", label: "POM (Делрин)" },
];

const API_URL = process.env.NEXT_PUBLIC_EVERYPART_API || "https://app.everypart.tech";

type Step = 1 | 2 | 3;

export default function ZayavkaPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ orderNumber: string; redirectUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step 1 — contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");

  // Step 2 — parameters
  const [title, setTitle] = useState("");
  const [technologyId, setTechnologyId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Step 3 — description
  const [freeText, setFreeText] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const canGoStep2 = fullName.trim() && email.trim() && title.trim();

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/public/submit-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          companyName,
          title,
          technologyId: technologyId || undefined,
          materialId: materialId || undefined,
          quantity: quantity ? Number(quantity) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          deadlineDesired: deadline || undefined,
          freeText,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка при отправке");
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка при отправке заявки");
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
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
              <h2 className="text-2xl font-bold text-green-800">Заявка отправлена!</h2>
              <p className="mt-2 text-green-700">
                Номер заказа: <strong>{result.orderNumber}</strong>
              </p>
              <p className="mt-4 text-sm text-green-600">
                На ваш email отправлены данные для входа в личный кабинет,
                где вы сможете отслеживать статус заказа.
              </p>
              <a
                href={result.redirectUrl}
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                Перейти в личный кабинет
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-6">
          <h1 className="text-3xl font-bold text-foreground">Оставить заявку</h1>
          <p className="mt-2 text-muted">
            Опишите вашу задачу — мы подберём оптимальное решение и свяжемся с вами.
          </p>

          {/* Progress */}
          <div className="mt-8 flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Шаг {step} из 3:{" "}
            {step === 1 && "Контакты и название"}
            {step === 2 && "Параметры (необязательно)"}
            {step === 3 && "Описание проекта"}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step 1 — Contact + Title */}
          {step === 1 && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  ФИО <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Иванов Иван Иванович"
                  className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ivanov@company.ru"
                  className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Телефон</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Компания</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ООО «Компания»"
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Название заказа <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Например: Корпус датчика из алюминия, 500 шт"
                  className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!canGoStep2}
                className="mt-4 w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
              >
                Далее
              </button>
            </div>
          )}

          {/* Step 2 — Parameters */}
          {step === 2 && (
            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted">
                Заполните что знаете — остальное уточним позже.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Технология</label>
                  <select
                    value={technologyId}
                    onChange={(e) => setTechnologyId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  >
                    <option value="">Не выбрана</option>
                    {TECHNOLOGIES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Материал</label>
                  <select
                    value={materialId}
                    onChange={(e) => setMaterialId(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  >
                    <option value="">Не выбран</option>
                    {MATERIALS.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Количество</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="шт"
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Бюджет (макс)</label>
                  <input
                    type="number"
                    min="0"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="₽"
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Срок</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                >
                  Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Далее
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Description */}
          {step === 3 && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Опишите ваш проект
                </label>
                <textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  rows={5}
                  placeholder="Расскажите подробности: что нужно изготовить, особые требования к качеству, допуски, покрытие, упаковка..."
                  className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">
                  Файлы (чертежи, 3D-модели, фото)
                </label>
                <div className="mt-1 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.step,.stp,.iges,.igs,.stl,.dwg,.dxf,.png,.jpg,.jpeg,.zip,.rar"
                    onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <svg className="mx-auto h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-muted">
                      Нажмите для выбора файлов или перетащите сюда
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      PDF, STEP, STL, DWG, DXF, PNG, JPG (до 25 МБ)
                    </p>
                  </label>
                </div>
                {files.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {files.map((f, i) => (
                      <li key={i} className="text-sm text-muted">
                        📎 {f.name} ({(f.size / 1024 / 1024).toFixed(1)} МБ)
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1 text-xs text-muted">
                  Загрузка файлов будет доступна в следующей версии. Пока приложите их к письму после отправки заявки.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface"
                >
                  Назад
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Отправка..." : "Отправить заявку"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
