import { Activity, Leaf, TimerReset, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { overviewStats } from "@/data/mock/dashboard";

const icons = [Activity, Leaf, TrendingUp, TimerReset];
const cardAccents = [
  "from-emerald-100/95 via-white/92 to-emerald-50/70",
  "from-lime-100/90 via-white/92 to-emerald-50/70",
  "from-sky-100/80 via-white/92 to-emerald-50/70",
  "from-amber-100/75 via-white/92 to-lime-50/80",
];
const iconAccents = [
  "bg-emerald-900 text-emerald-50",
  "bg-lime-500/90 text-emerald-950",
  "bg-sky-500/90 text-white",
  "bg-amber-400/95 text-emerald-950",
];

export function OverviewStatGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
      {overviewStats.map((item, index) => {
        const Icon = icons[index] ?? Activity;

        return (
          <Card
            key={item.id}
            className="group relative overflow-hidden rounded-[30px] border-emerald-100/70 transition duration-300 hover:-translate-y-1 hover:shadow-float"
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${cardAccents[index] ?? cardAccents[0]}`}
            />
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/80 blur-2xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                <p className="mt-3 font-display text-4xl font-semibold text-slate-950">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.helper}</p>
              </div>

              <div
                className={`rounded-2xl p-3 shadow-soft transition duration-300 group-hover:scale-105 ${iconAccents[index] ?? iconAccents[0]}`}
              >
                <Icon size={20} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
