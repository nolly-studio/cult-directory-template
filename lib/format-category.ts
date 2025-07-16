export function formatCategoryLabel(category: string): string {
  if (!category) return ''
  
  // Handle hyphenated categories
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatToolType(toolType: string): string {
  if (!toolType) return ''
  
  // Common tool type mappings
  const typeMap: Record<string, string> = {
    'text-generation': 'Text Generation',
    'image-generation': 'Image Generation',
    'video-generation': 'Video Generation',
    'audio-generation': 'Audio Generation',
    'code-assistant': 'Code Assistant',
    'ai-writing': 'AI Writing',
    'ai-image': 'AI Image',
    'ai-video': 'AI Video',
    'ai-audio': 'AI Audio',
    'ai-code': 'AI Code',
    'ai-chat': 'AI Chat',
    'voice-assistant': 'Voice Assistant',
    'search-engine': 'Search Engine',
    'productivity': 'Productivity',
    'design': 'Design',
    'chatbot': 'Chatbot',
    'document': 'Document',
    // Arabic categories
    'تطوير': 'Development',
    'تصميم': 'Design',
    'كتابة': 'Writing',
    'صوت': 'Audio',
    'فيديو': 'Video',
    'محادثة': 'Chat'
  }
  
  return typeMap[toolType] || formatCategoryLabel(toolType)
}