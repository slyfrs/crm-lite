import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.account.deleteMany();
  await prisma.stage.deleteMany();

  const stages = await Promise.all([
    prisma.stage.create({ data: { name: "Новый", position: 1 } }),
    prisma.stage.create({ data: { name: "Выигран", position: 2 } }),
    prisma.stage.create({ data: { name: "Проигран", position: 3 } }),
  ]);
  const S = Object.fromEntries(stages.map((s) => [s.name, s.id]));

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Лид 1: Елена — создаёт TechCorp + 2 сделки
  const lead1 = await prisma.lead.create({
    data: { firstName: "Елена", lastName: "Морозова", email: "elena@techcorp.ru", phone: "+7 902 111-11-11", company: "TechCorp", source: "site", status: "new" },
  });
  const acc1 = await prisma.account.create({ data: { name: "TechCorp", industry: "IT", website: "https://techcorp.ru", phone: "+7 902 111-11-11" } });
  const con1 = await prisma.contact.create({ data: { firstName: "Елена", lastName: "Морозова", email: "elena@techcorp.ru", phone: "+7 902 111-11-11", jobTitle: "Директор", accountId: acc1.id } });
  await prisma.lead.update({ where: { id: lead1.id }, data: { status: "converted", accountId: acc1.id, contactId: con1.id } });
  const opp1 = await prisma.opportunity.create({
    data: { name: "Стенд для TechCorp", amount: 1500000, stageId: S["Новый"], accountId: acc1.id, contactId: con1.id, leadId: lead1.id },
  });
  const opp6 = await prisma.opportunity.create({
    data: { name: "Моя супер-сделка", amount: null, stageId: S["Новый"], accountId: acc1.id, contactId: con1.id, leadId: lead1.id },
  });

  // Лид 2: Игорь — привязан к существующей TechCorp (второй контакт) + 1 сделка
  const lead2 = await prisma.lead.create({
    data: { firstName: "Игорь", lastName: "Волков", email: "igor@techcorp.ru", phone: "+7 902 222-22-22", company: "TechCorp", source: "email", status: "new" },
  });
  const con2 = await prisma.contact.create({ data: { firstName: "Игорь", lastName: "Волков", email: "igor@techcorp.ru", phone: "+7 902 222-22-22", jobTitle: "Руководитель проектов", accountId: acc1.id } });
  await prisma.lead.update({ where: { id: lead2.id }, data: { status: "converted", accountId: acc1.id, contactId: con2.id, company: "TechCorp" } });
  const opp2 = await prisma.opportunity.create({
    data: { name: "Бренд-зона TechCorp", amount: 800000, stageId: S["Новый"], accountId: acc1.id, contactId: con2.id, leadId: lead2.id },
  });

  // Лид 3: Кира — создаёт MediaGroup + сделка (Выигран)
  const lead3 = await prisma.lead.create({
    data: { firstName: "Кира", lastName: "Лебедева", email: "kira@mediaGroup.ru", phone: "+7 902 333-33-33", company: "MediaGroup", source: "phone", status: "new" },
  });
  const acc3 = await prisma.account.create({ data: { name: "MediaGroup", industry: "Медиа", phone: "+7 902 333-33-33" } });
  const con3 = await prisma.contact.create({ data: { firstName: "Кира", lastName: "Лебедева", email: "kira@mediaGroup.ru", phone: "+7 902 333-33-33", jobTitle: "Менеджер", accountId: acc3.id } });
  await prisma.lead.update({ where: { id: lead3.id }, data: { status: "converted", accountId: acc3.id, contactId: con3.id } });
  const opp3 = await prisma.opportunity.create({
    data: { name: "Выставка MediaGroup", amount: 1200000, stageId: S["Выигран"], accountId: acc3.id, contactId: con3.id, leadId: lead3.id },
  });

  // Лид 4: Леонид — создаёт BuildExpo + 2 сделки (Новый, Проигран)
  const lead4 = await prisma.lead.create({
    data: { firstName: "Леонид", lastName: "Орлов", email: "leonid@buildexpo.ru", phone: "+7 902 444-44-44", company: "BuildExpo", source: "referral", status: "new" },
  });
  const acc4 = await prisma.account.create({ data: { name: "BuildExpo", industry: "Строительство", phone: "+7 902 444-44-44" } });
  const con4 = await prisma.contact.create({ data: { firstName: "Леонид", lastName: "Орлов", email: "leonid@buildexpo.ru", phone: "+7 902 444-44-44", jobTitle: "Генеральный директор", accountId: acc4.id } });
  await prisma.lead.update({ where: { id: lead4.id }, data: { status: "converted", accountId: acc4.id, contactId: con4.id } });
  const opp4 = await prisma.opportunity.create({
    data: { name: "Стенд BuildExpo", amount: 500000, stageId: S["Новый"], accountId: acc4.id, contactId: con4.id, leadId: lead4.id },
  });
  const opp5 = await prisma.opportunity.create({
    data: { name: "Редизайн стенда BuildExpo", amount: 950000, lostReason: "Клиент выбрал другого подрядчика по цене", stageId: S["Проигран"], accountId: acc4.id, contactId: con4.id, leadId: lead4.id },
  });

  // Лид 5: Никита — создаёт DesignLab, без сделки
  const lead5 = await prisma.lead.create({
    data: { firstName: "Никита", lastName: "Федоров", email: "nikita@designlab.ru", phone: "+7 902 666-66-66", company: "DesignLab", source: "site", status: "new" },
  });
  const acc2 = await prisma.account.create({ data: { name: "DesignLab", industry: "Дизайн", phone: "+7 902 666-66-66" } });
  const con5 = await prisma.contact.create({ data: { firstName: "Никита", lastName: "Федоров", email: "nikita@designlab.ru", phone: "+7 902 666-66-66", jobTitle: "Арт-директор", accountId: acc2.id } });
  await prisma.lead.update({ where: { id: lead5.id }, data: { status: "converted", accountId: acc2.id, contactId: con5.id } });

  // Лид 6: Марина — NOT CONVERTED (демо ручной конвертации)
  await prisma.lead.create({
    data: { firstName: "Марина", lastName: "Зайцева", email: "marina@retailplus.ru", phone: "+7 902 555-55-55", company: "RetailPlus", source: "manual", status: "new" },
  });

  // Activities — 2 просроченные, 2 на сегодня, 2 заметки, 2 будущие
  await Promise.all([
    prisma.activity.create({ data: { type: "task", title: "Позвонить Елене Морозовой", description: "Уточнить бюджет на стенд", dueDate: new Date(today.getTime() - 4 * 86400000), done: false, opportunityId: opp1.id } }),
    prisma.activity.create({ data: { type: "task", title: "Отправить макет TechCorp", description: "Финальный макет бренд-зоны", dueDate: new Date(today.getTime() - 2 * 86400000), done: false, opportunityId: opp2.id } }),
    prisma.activity.create({ data: { type: "task", title: "Согласовать дизайн с MediaGroup", description: "Обсудить финальные правки", dueDate: today, done: false, opportunityId: opp3.id } }),
    prisma.activity.create({ data: { type: "task", title: "Подготовить презентацию для BuildExpo", description: "Слайды с портфолио", dueDate: today, done: false, opportunityId: opp4.id } }),
    prisma.activity.create({ data: { type: "note", title: "Заметка по TechCorp", description: "Елена заинтересована в участии на выставке в октябре.", opportunityId: opp1.id } }),
    prisma.activity.create({ data: { type: "note", title: "Разговор с Игорем", description: "Игорь хочет увидеть кейсы. Отправить портфолио до пятницы.", opportunityId: opp2.id } }),
    prisma.activity.create({ data: { type: "task", title: "Встреча с BuildExpo", description: "Обсуждение технического задания", dueDate: new Date(today.getTime() + 3 * 86400000), done: false, opportunityId: opp5.id } }),
    prisma.activity.create({ data: { type: "task", title: "Уточнить сроки с TechCorp", description: "Согласовать дату монтажа стенда", dueDate: new Date(today.getTime() + 5 * 86400000), done: false, opportunityId: opp6.id } }),
  ]);

  console.log("Seed completed:");
  console.log("  Stages: Новый, Выигран, Проигран");
  console.log("  6 leads (5 converted, 1 new)");
  console.log("  4 accounts, 5 contacts, 6 opportunities, 8 activities");
  console.log("  TechCorp: 2 contacts (Елена, Игорь)");
  console.log("  Deals: 4 Новый, 1 Выигран, 1 Проигран");
  console.log("  Tasks: 2 overdue, 2 due today");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
