import Link from "next/link";
import { FileText } from "lucide-react";

const REPORTS = [
  // {
  //   title: "Rapport CRM — Analyse & Recommandations",
  //   description:
  //     "Analyse des pain points, flux pipeline, plan d'action et automatisations GoHighLevel.",
  //   href: "/reports/crm",
  //   date: "14 mars 2026",
  //   tags: ["GHL", "Pipeline", "Automatisations"],
  // },
  {
    title: "CRM Feedback & Plan d'action (Markdown)",
    description:
      "Version markdown brute de crm-feedback.md et crm-action-plan.md.",
    href: "/reports/crm/report-20260314",
    date: "14 mars 2026",
    tags: ["GHL", "Markdown"],
  },
];

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 sm:px-6">
      <div className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Archives des rapports
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Rapports d&apos;analyse et recommandations disponibles
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {REPORTS.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="group block overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,.04)] transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <FileText className="size-6 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-zinc-200">
                  {report.title}
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {report.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {report.date}
                  </span>
                  {report.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
