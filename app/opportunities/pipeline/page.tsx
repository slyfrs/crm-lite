import { prisma } from "@/lib/prisma";
import { PipelineBoard } from "@/components/PipelineBoard";
import { PageHeader } from "@/components/ui/PageHeader";

export default async function PipelinePage() {
  const stages = await prisma.stage.findMany({
    orderBy: { position: "asc" },
    include: {
      opportunities: {
        include: { account: true, lead: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div>
      <PageHeader title="Воронка сделок" />
      <PipelineBoard stages={stages} />
    </div>
  );
}
