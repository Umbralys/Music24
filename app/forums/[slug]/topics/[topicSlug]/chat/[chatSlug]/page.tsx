import { ChatOrchestrator } from '@/features/chat/orchestrators/ChatOrchestrator';

interface ChatPageProps {
  params: Promise<{ slug: string; topicSlug: string; chatSlug: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { slug, topicSlug, chatSlug } = await params;
  return (
    <ChatOrchestrator
      forumSlug={slug}
      topicSlug={topicSlug}
      subTopicSlug={chatSlug}
    />
  );
}
