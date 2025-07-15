// Smart time-based stats that feel live but are actually scheduled
export function getTimeBasedStats() {
  const hour = new Date().getHours()
  
  // Morning stats (6 AM - 12 PM)
  if (hour >= 6 && hour < 12) {
    return {
      activeUsers: "127 مستخدم نشط الآن",
      todayTrials: "+89 جربوا الأدوات هذا الصباح",
      totalUsers: "أكثر من 10,000 مستخدم نشط",
      timeContext: "morning",
      trending: "أدوات الإنتاجية الصباحية"
    }
  }
  
  // Afternoon stats (12 PM - 6 PM)
  if (hour >= 12 && hour < 18) {
    return {
      activeUsers: "89 مستخدم نشط الآن", 
      todayTrials: "+156 جربوا الأدوات اليوم",
      totalUsers: "أكثر من 10,000 مستخدم نشط",
      timeContext: "afternoon",
      trending: "أدوات التصميم والإبداع"
    }
  }
  
  // Evening stats (6 PM - 12 AM)
  if (hour >= 18 || hour < 6) {
    return {
      activeUsers: "203 مستخدم نشط الآن",
      todayTrials: "+247 جربوا الأدوات اليوم", 
      totalUsers: "أكثر من 10,000 مستخدم نشط",
      timeContext: "evening",
      trending: "أدوات التعلم والتطوير"
    }
  }
  
  // Default fallback
  return {
    activeUsers: "150 مستخدم نشط الآن",
    todayTrials: "+120 جربوا الأدوات اليوم",
    totalUsers: "أكثر من 10,000 مستخدم نشط", 
    timeContext: "default",
    trending: "الأدوات الأكثر شعبية"
  }
}

// Get different activity messages throughout the day
export function getActivityMessages() {
  const hour = new Date().getHours()
  const activities = []
  
  if (hour >= 6 && hour < 12) {
    activities.push(
      "🌅 أحمد من الرياض بدأ يومه مع ChatGPT",
      "☕ فاطمة من جدة تستخدم Midjourney للتصاميم",
      "📈 محمد من دبي يراجع إحصائياته مع Claude"
    )
  } else if (hour >= 12 && hour < 18) {
    activities.push(
      "🎨 سارة من القاهرة تصمم شعار جديد مع DALL-E",
      "📝 عبدالله من الكويت يكتب محتوى مع Jasper",
      "🎥 نورا من عمان تحرر فيديو مع RunwayML"
    )
  } else {
    activities.push(
      "🌙 يوسف من الدوحة يخطط لمشروعه مع Notion AI",
      "📚 مريم من المنامة تتعلم البرمجة مع GitHub Copilot",
      "🎯 خالد من بغداد يحسن إعلاناته مع Copy.ai"
    )
  }
  
  return activities
}

// Get day-based tool rotation (changes daily)
export function getToolOfTheDay() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  
  const toolsRotation = [
    {
      name: "ChatGPT",
      reason: "الأكثر استخداماً للكتابة والأفكار",
      badge: "🔥 مميز اليوم"
    },
    {
      name: "Midjourney", 
      reason: "الأفضل لإنشاء الصور والتصاميم",
      badge: "🎨 اختيار المحررين"
    },
    {
      name: "Claude",
      reason: "مثالي للمهام المعقدة والتحليل",
      badge: "🧠 الأذكى"
    },
    {
      name: "Perplexity",
      reason: "محرك البحث الذكي الجديد",
      badge: "🔍 الأحدث"
    },
    {
      name: "DALL-E 3",
      reason: "إبداع فني بأوامر بسيطة",
      badge: "✨ الأكثر إبداعاً"
    }
  ]
  
  return toolsRotation[dayOfYear % toolsRotation.length]
}

// Get weekly trending tools (changes every week)
export function getWeeklyTrendingTools() {
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24 * 7))
  
  const trendingRotation = [
    {
      title: "🔥 الأكثر طلباً هذا الأسبوع",
      tools: [
        { name: "ChatGPT", reason: "للكتابة والأفكار الإبداعية" },
        { name: "Midjourney", reason: "لإنشاء الصور المذهلة" },
        { name: "Claude", reason: "للتحليل والمهام المعقدة" }
      ]
    },
    {
      title: "🚀 صاعدة بقوة",
      tools: [
        { name: "Perplexity", reason: "البحث الذكي الجديد" },
        { name: "DALL-E 3", reason: "الإبداع الفني السهل" },
        { name: "Jasper", reason: "المحتوى التسويقي الاحترافي" }
      ]
    },
    {
      title: "💎 اختيارات المحررين",
      tools: [
        { name: "GitHub Copilot", reason: "مساعد البرمجة الذكي" },
        { name: "Notion AI", reason: "التنظيم والإنتاجية" },
        { name: "RunwayML", reason: "إنشاء وتحرير الفيديو" }
      ]
    },
    {
      title: "🌟 الأدوات الناشئة",
      tools: [
        { name: "Leonardo AI", reason: "البديل القوي للتصميم" },
        { name: "Character.AI", reason: "المحادثات التفاعلية" },
        { name: "Stable Diffusion", reason: "الذكاء الاصطناعي مفتوح المصدر" }
      ]
    }
  ]
  
  return trendingRotation[weekOfYear % trendingRotation.length]
}

// Get contextual greeting based on time
export function getTimeBasedGreeting() {
  const hour = new Date().getHours()
  
  if (hour >= 6 && hour < 12) {
    return "صباح الخير! ابدأ يومك مع أفضل أدوات الذكاء الاصطناعي"
  } else if (hour >= 12 && hour < 18) {
    return "مساء الخير! اكتشف أدوات جديدة لتطوير مشاريعك"
  } else {
    return "مساء الخير! وقت مثالي لتعلم تقنيات جديدة"
  }
}