// Smart user interaction responses that feel live but are predictable

export function getViewerStats(toolName: string) {
  // Generate consistent but believable stats based on tool name
  const hash = toolName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const today = new Date().getDate();
  const baseViews = Math.abs(hash % 50) + 10; // 10-60 views
  const dailyVariation = today % 7; // Changes based on day of week
  
  return {
    todayViews: baseViews + dailyVariation,
    thisWeekViews: (baseViews + dailyVariation) * 7 + Math.abs(hash % 100),
    similarTools: getSimilarToolsViewed(toolName)
  };
}

export function getSimilarToolsViewed(toolName: string) {
  const similarMappings: { [key: string]: string[] } = {
    'ChatGPT': ['Claude', 'Perplexity', 'Jasper'],
    'Claude': ['ChatGPT', 'Gemini', 'Perplexity'],
    'Midjourney': ['DALL-E 3', 'Stable Diffusion', 'Leonardo AI'],
    'DALL-E 3': ['Midjourney', 'Firefly', 'Stable Diffusion'],
    'Perplexity': ['ChatGPT', 'Claude', 'You.com']
  };
  
  return similarMappings[toolName] || ['ChatGPT', 'Claude', 'Midjourney'];
}

export function getReturnVisitorMessage() {
  const messages = [
    "مرحباً مجدداً! إليك ما فاتك:",
    "أهلاً بك! أدوات جديدة تم إضافتها:",
    "مرحباً! اكتشف أدوات محدثة:",
    "عودة سعيدة! شاهد التحديثات الجديدة:",
    "أهلاً وسهلاً! محتوى جديد في انتظارك:"
  ];
  
  const hour = new Date().getHours();
  return messages[hour % messages.length];
}

export function getContextualSuggestions(currentTool?: string) {
  const suggestions = {
    'ChatGPT': [
      "جرّب Claude للمهام المعقدة",
      "استخدم Perplexity للبحث الذكي",
      "اكتشف Jasper للكتابة التسويقية"
    ],
    'Midjourney': [
      "جرّب DALL-E 3 للصور الواقعية", 
      "استخدم Leonardo AI للرسوم",
      "اكتشف Firefly من Adobe"
    ],
    'Claude': [
      "جرّب ChatGPT للمحادثات السريعة",
      "استخدم Perplexity للأسئلة البحثية",
      "اكتشف Notion AI للتنظيم"
    ]
  };
  
  if (currentTool && suggestions[currentTool as keyof typeof suggestions]) {
    return suggestions[currentTool as keyof typeof suggestions];
  }
  
  return [
    "اكتشف أدوات الكتابة الذكية",
    "جرّب أدوات إنشاء الصور",
    "استخدم أدوات البحث المتقدم"
  ];
}

export function getEngagementMessage(action: 'view' | 'click' | 'share') {
  const messages = {
    view: [
      "المستخدمون الآخرون شاهدوا أيضاً:",
      "الأدوات المشابهة الأكثر شعبية:",
      "يُنصح بتجربة هذه الأدوات أيضاً:"
    ],
    click: [
      "أدوات مميزة أخرى تستحق التجربة:",
      "المستخدمون الذين جربوا هذه الأداة أحبوا أيضاً:",
      "اكتشف أدوات مشابهة:"
    ],
    share: [
      "شكراً للمشاركة! أدوات أخرى قد تعجب زملاءك:",
      "رائع! إليك أدوات أخرى للمشاركة:",
      "أحسنت! أدوات مشابهة تستحق المشاركة:"
    ]
  };
  
  const messageArray = messages[action];
  return messageArray[Math.floor(Date.now() / 60000) % messageArray.length];
}

// Check if user is returning (using localStorage in client-side)
export function isReturningVisitor(): boolean {
  if (typeof window === 'undefined') return false;
  
  const lastVisit = localStorage.getItem('lastVisit');
  const now = Date.now();
  
  if (lastVisit) {
    const timeSinceLastVisit = now - parseInt(lastVisit);
    localStorage.setItem('lastVisit', now.toString());
    // Return true if last visit was more than 1 hour ago
    return timeSinceLastVisit > 3600000;
  } else {
    localStorage.setItem('lastVisit', now.toString());
    return false;
  }
}

// Track user actions for contextual responses
export function trackUserAction(action: string, toolName?: string) {
  if (typeof window === 'undefined') return;
  
  const actions = JSON.parse(localStorage.getItem('userActions') || '[]');
  actions.push({
    action,
    toolName,
    timestamp: Date.now()
  });
  
  // Keep only last 10 actions
  if (actions.length > 10) {
    actions.splice(0, actions.length - 10);
  }
  
  localStorage.setItem('userActions', JSON.stringify(actions));
}