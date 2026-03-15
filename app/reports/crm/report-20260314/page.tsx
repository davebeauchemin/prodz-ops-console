import { readFileSync } from "fs";
import { join } from "path";
import { MarkdownContent } from "@/components/reports/MarkdownContent";

export default function CrmMarkdownReportPage() {
  const feedbackContent = readFileSync(
    join(process.cwd(), "app/reports/crm/report-20260314/crm-feedback.md"),
    "utf-8"
  );
  const actionPlanContent = readFileSync(
    join(process.cwd(), "app/reports/crm/report-20260314/crm-action-plan.md"),
    "utf-8"
  );

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Rapport CRM — Version markdown
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          CRM Feedback & Plan d&apos;action · 14 mars 2026
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <h2 className="mb-5 border-l-4 border-zinc-900 pl-5 text-xl font-bold tracking-tight text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 sm:text-2xl">
          CRM Feedback
        </h2>
        <MarkdownContent content={feedbackContent} />
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,.04)] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <h2 className="mb-5 border-l-4 border-zinc-900 pl-5 text-xl font-bold tracking-tight text-zinc-900 dark:border-zinc-100 dark:text-zinc-100 sm:text-2xl">
          Plan d&apos;action CRM
        </h2>
        <MarkdownContent content={actionPlanContent} />
      </section>
    </div>
  );
}
