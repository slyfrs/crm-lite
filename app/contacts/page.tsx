import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ContactCard } from "@/components/ContactCard";
import { EntityListLayout } from "@/components/layout/EntityListLayout";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where: Prisma.ContactWhereInput = {};
  if (q) {
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { account: { name: { contains: q, mode: "insensitive" } } },
    ];
  }

  const contacts = await prisma.contact.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { account: true },
  });

  return (
    <EntityListLayout
      title="Контакты"
      searchPlaceholder="Поиск по имени, email, компании..."
      emptyMessage="Контактов пока нет. Они создаются при конвертации лидов."
      isEmpty={contacts.length === 0}
    >
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} />
      ))}
    </EntityListLayout>
  );
}
