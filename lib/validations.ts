import { z } from "zod";

const optionalAmount = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : val),
  z.coerce.number().min(0, "Сумма не может быть отрицательной").optional()
);

export const leadSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  source: z.enum(["site", "email", "phone", "referral", "manual"], {
    message: "Выберите источник",
  }),
  status: z.enum(["new", "converted"]).optional(),
});

export const accountSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  industry: z.string().optional().or(z.literal("")),
  website: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const contactSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
  accountId: z.string().optional().or(z.literal("")),
});

export const opportunitySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  amount: optionalAmount,
  stageId: z.string().min(1, "Стадия обязательна"),
  accountId: z.string().optional().or(z.literal("")),
  contactId: z.string().optional().or(z.literal("")),
  leadId: z.string().optional().or(z.literal("")),
  lostReason: z.string().optional().or(z.literal("")),
});

export const createOpportunitySchema = opportunitySchema.extend({
  leadId: z.string().min(1, "Выберите лида"),
});

const emptyToString = z.preprocess(
  (val) => (val === null || val === undefined ? "" : val),
  z.string()
);

export const convertLeadSchema = z
  .object({
    email: z.string().min(1, "Email обязателен").email("Некорректный email"),
    phone: z.string().min(1, "Телефон обязателен"),
    accountMode: z.enum(["new", "existing"], {
      message: "Выберите режим компании",
    }),
    company: emptyToString,
    accountId: emptyToString,
    createOpportunity: z.preprocess(
      (val) => val === "on" || val === true,
      z.boolean().optional().default(false)
    ),
    opportunityName: emptyToString,
    opportunityAmount: optionalAmount,
  })
  .superRefine((data, ctx) => {
    if (data.accountMode === "new") {
      if (!data.company?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Название компании обязательно",
          path: ["company"],
        });
      }
    } else if (!data.accountId?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Выберите компанию",
        path: ["accountId"],
      });
    }
  });

export const activitySchema = z
  .object({
    type: z.enum(["note", "task"]),
    title: z.string().min(1, "Заголовок обязателен"),
    description: z.string().nullable().optional(),
    dueDate: emptyToString,
    leadId: z.string().nullable().optional(),
    accountId: z.string().nullable().optional(),
    contactId: z.string().nullable().optional(),
    opportunityId: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "task" && !data.dueDate.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Срок выполнения обязателен для задачи",
        path: ["dueDate"],
      });
    }
  });
