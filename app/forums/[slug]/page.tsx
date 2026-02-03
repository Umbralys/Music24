import { ForumDetailOrchestrator } from '@/features/forums/orchestrators/ForumDetailOrchestrator';

interface ForumPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ForumPage({ params }: ForumPageProps) {
  const { slug } = await params;
  return <ForumDetailOrchestrator slug={slug} />;
}
