import { TopicDetailOrchestrator } from '@/features/topics/orchestrators/TopicDetailOrchestrator';

interface TopicPageProps {
  params: Promise<{ slug: string; topicSlug: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug, topicSlug } = await params;
  return <TopicDetailOrchestrator forumSlug={slug} topicSlug={topicSlug} />;
}
