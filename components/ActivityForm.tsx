"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createActivity, toggleActivityDone } from "@/app/actions/stages";
import { FormField, FormFieldError } from "@/components/Form";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

type Activity = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  done: boolean;
};

function AddActivityForm({
  opportunityId,
  onCancel,
  onSuccess,
}: {
  opportunityId: string;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [type, setType] = useState<"note" | "task">("note");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors(null);

    const formData = new FormData(e.currentTarget);
    formData.set("type", type);
    formData.set("opportunityId", opportunityId);

    const result = (await createActivity(formData)) as {
      error?: string | Record<string, string[]>;
      success?: boolean;
    };

    if (result.error) {
      if (typeof result.error === "string") {
        setError(result.error);
      } else {
        setFieldErrors(result.error);
        setError(Object.values(result.error).flat().join(", "));
      }
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="rounded-lg border border-zinc-100 p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Тип" name="type">
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={type === "note" ? "primary" : "secondary"}
              onClick={() => setType("note")}
            >
              Заметка
            </Button>
            <Button
              type="button"
              size="sm"
              variant={type === "task" ? "primary" : "secondary"}
              onClick={() => setType("task")}
            >
              Задача
            </Button>
          </div>
        </FormField>

        <FormField
          label={type === "note" ? "Текст заметки" : "Название задачи"}
          name="title"
          required
        >
          <Input
            id="title"
            name="title"
            placeholder={type === "note" ? "Введите текст заметки" : "Введите название задачи"}
            required
          />
        </FormField>

        <FormField label="Описание" name="description">
          <Textarea
            id="description"
            name="description"
            placeholder="Необязательно"
            rows={3}
          />
        </FormField>

        {type === "task" && (
          <FormField label="Срок выполнения" name="dueDate" type="date" required>
            <Input id="dueDate" name="dueDate" type="date" className="w-auto" required />
            <FormFieldError messages={fieldErrors?.dueDate} />
          </FormField>
        )}

        {error && <Alert>{error}</Alert>}

        <div className="flex gap-3 pt-4 border-t border-zinc-100">
          <Button type="submit" disabled={loading}>
            {loading ? "Сохранение..." : "Добавить"}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Отмена
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ActivitiesSection({
  opportunityId,
  activities,
}: {
  opportunityId: string;
  activities: Activity[];
}) {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setShowForm(false);
    router.refresh();
  }

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-zinc-900">Активности</h2>
        {!showForm && (
          <Button size="sm" variant="secondary" onClick={() => setShowForm(true)}>
            + Активность
          </Button>
        )}
      </div>

      {showForm && (
        <AddActivityForm
          opportunityId={opportunityId}
          onCancel={() => setShowForm(false)}
          onSuccess={handleSuccess}
        />
      )}

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((act) => (
            <ActivityItem key={act.id} activity={act} />
          ))}
        </div>
      ) : (
        !showForm && <p className="text-zinc-400 text-sm">Нет активностей</p>
      )}
    </Card>
  );
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    setError(null);
    const result = await toggleActivityDone(activity.id, !activity.done);
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
  }

  const isOverdue =
    activity.dueDate && !activity.done && new Date(activity.dueDate) < new Date();

  return (
    <div className="rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 transition-colors text-sm">
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`px-1.5 py-0.5 rounded text-xs ${
            activity.type === "task"
              ? "bg-orange-100 text-orange-800"
              : "bg-zinc-100 text-zinc-600"
          }`}
        >
          {activity.type === "task" ? "Задача" : "Заметка"}
        </span>
        <span className={`font-medium ${activity.done ? "line-through text-zinc-400" : ""}`}>
          {activity.title}
        </span>
        {activity.done && (
          <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-700">
            Выполнено
          </span>
        )}
        {isOverdue && (
          <span className="px-1.5 py-0.5 rounded text-xs bg-red-100 text-red-700 font-medium">
            Просрочено
          </span>
        )}
        {activity.type === "task" && (
          <Button
            size="sm"
            variant={activity.done ? "secondary" : "success"}
            onClick={handleToggle}
            className="ml-auto"
          >
            {activity.done ? "Отменить" : "Выполнено"}
          </Button>
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      {activity.description && <p className="text-zinc-500 mt-1">{activity.description}</p>}
      {activity.dueDate && (
        <p className={`text-xs mt-1 ${isOverdue ? "text-red-500" : "text-zinc-400"}`}>
          Срок: {formatDate(new Date(activity.dueDate))}
        </p>
      )}
    </div>
  );
}
