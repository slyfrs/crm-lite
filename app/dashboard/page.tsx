import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import {
  LeadsByStatusChart,
  LeadsBySourceChart,
  OpportunitiesByStageChart,
} from "@/components/Charts";
import { formatCurrency, formatDate, formatPersonName } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card padding="md">
          <p className="text-sm text-zinc-500">Всего лидов</p>
          <p className="text-3xl font-bold text-blue-600">{data.kpi.totalLeads}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-zinc-500">Всего сделок</p>
          <p className="text-3xl font-bold text-green-600">{data.kpi.totalOpportunities}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-zinc-500">Сумма открытых сделок</p>
          <p className="text-3xl font-bold text-emerald-600">
            {formatCurrency(data.kpi.openOpportunitiesSum)}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-zinc-500">Просроченных задач</p>
          <p className={`text-3xl font-bold ${data.kpi.overdueTasks > 0 ? "text-red-600" : "text-zinc-400"}`}>
            {data.kpi.overdueTasks}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <LeadsByStatusChart data={data.leadsByStatus} />
        <LeadsBySourceChart data={data.leadsBySource} />
        <OpportunitiesByStageChart data={data.opportunitiesByStage} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card padding="md">
          <h3 className="font-semibold text-sm text-zinc-700 mb-3">Последние лиды</h3>
          {data.recentLeads.length === 0 ? (
            <p className="text-zinc-400 text-sm">Нет лидов</p>
          ) : (
            <ul className="space-y-2">
              {data.recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-center justify-between text-sm border-b border-zinc-100 pb-2">
                  <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:underline">
                    {formatPersonName(lead.firstName, lead.lastName)}
                  </Link>
                  <span className="text-zinc-400 text-xs">
                    {formatDate(new Date(lead.createdAt))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card padding="md">
          <h3 className="font-semibold text-sm text-zinc-700 mb-3">
            Просроченные задачи
            {data.overdueTasksList.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">
                {data.overdueTasksList.length}
              </span>
            )}
          </h3>
          {data.overdueTasksList.length === 0 ? (
            <p className="text-zinc-400 text-sm">Нет просроченных задач</p>
          ) : (
            <ul className="space-y-2">
              {data.overdueTasksList.map((task) => (
                <li key={task.id} className="text-sm border-b border-zinc-100 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{task.title}</span>
                    <span className="text-red-500 text-xs">
                      {task.dueDate ? formatDate(new Date(task.dueDate)) : ""}
                    </span>
                  </div>
                  {task.lead && (
                    <Link href={`/leads/${task.lead.id}`} className="text-zinc-400 text-xs hover:underline">
                      Лид: {task.lead.firstName} {task.lead.lastName}
                    </Link>
                  )}
                  {task.opportunity && (
                    <Link href={`/opportunities/${task.opportunity.id}`} className="text-zinc-400 text-xs hover:underline">
                      Сделка: {task.opportunity.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
