import { getLocale, getTranslations } from "next-intl/server";

const LAST_UPDATED = new Date(2026, 7, 13);
const SECTION_COUNT = 7;

export default async function TermsPage() {
  const t = await getTranslations("legal");
  const locale = await getLocale();
  const updatedDate = LAST_UPDATED.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sections = Array.from({ length: SECTION_COUNT }, (_, i) => {
    const n = i + 1;
    return {
      title: t(`termsSection${n}Title`),
      body: t(`termsSection${n}Body`),
    };
  });

  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-bold">{t("termsTitle")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {t("termsUpdated", { date: updatedDate })}
      </p>
      <p className="mt-6 text-muted-foreground">{t("termsIntro")}</p>

      <div className="mt-8 space-y-6">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-semibold">{section.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
