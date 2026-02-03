interface ForumHeaderProps {
  title: string;
  description?: string;
}

export function ForumHeader({ title, description }: ForumHeaderProps) {
  return (
    <div className="space-y-2 mb-8">
      <h1 className="text-3xl md:text-4xl font-bold gradient-text">
        {title}
      </h1>
      {description && (
        <p className="text-gray-400">{description}</p>
      )}
    </div>
  );
}
