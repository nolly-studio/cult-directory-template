-- Insert blog categories
INSERT INTO public.blog_categories (id, name_ar, name_en, slug, description_ar, description_en, article_count, sort_order, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'دليل المبتدئين', 'Beginner Guide', 'beginner-guide', 'دليل شامل للمبتدئين في الذكاء الاصطناعي', 'Comprehensive guide for AI beginners', 0, 1, true),
('550e8400-e29b-41d4-a716-446655440002', 'مقارنات الأدوات', 'Tool Comparisons', 'tool-comparisons', 'مقارنات شاملة بين أدوات الذكاء الاصطناعي', 'Comprehensive comparisons of AI tools', 0, 2, true),
('550e8400-e29b-41d4-a716-446655440003', 'دروس متقدمة', 'Advanced Tutorials', 'advanced-tutorials', 'دروس متقدمة ونصائح للمحترفين', 'Advanced tutorials and tips for professionals', 0, 3, true),
('550e8400-e29b-41d4-a716-446655440004', 'قصص نجاح', 'Success Stories', 'success-stories', 'قصص نجاح حقيقية باستخدام الذكاء الاصطناعي', 'Real success stories using AI', 0, 4, true),
('550e8400-e29b-41d4-a716-446655440005', 'الأخبار والتحديثات', 'News & Updates', 'news-updates', 'آخر أخبار وتحديثات الذكاء الاصطناعي', 'Latest AI news and updates', 0, 5, true),
('550e8400-e29b-41d4-a716-446655440006', 'الذكاء الاصطناعي للأعمال', 'AI for Business', 'ai-for-business', 'كيفية استخدام الذكاء الاصطناعي في الأعمال', 'How to use AI in business', 0, 6, true);

-- Insert blog series
INSERT INTO public.blog_series (id, title_ar, title_en, slug, description_ar, description_en, total_parts, completed_parts, is_complete, difficulty_level, estimated_total_time) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'دليل ChatGPT الشامل', 'Complete ChatGPT Guide', 'chatgpt-complete-guide', 'دليل شامل لتعلم ChatGPT من الصفر إلى الاحتراف', 'Complete guide to learn ChatGPT from scratch to professional', 5, 3, false, 'مبتدئ', 50),
('660e8400-e29b-41d4-a716-446655440002', 'إتقان Midjourney', 'Mastering Midjourney', 'mastering-midjourney', 'تعلم إنشاء الصور المذهلة باستخدام Midjourney', 'Learn to create stunning images using Midjourney', 4, 2, false, 'متوسط', 40);

-- Insert blog authors
INSERT INTO public.blog_authors (id, name_ar, name_en, bio_ar, bio_en, expertise_areas, article_count, total_views, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'د. أحمد الذكي', 'Dr. Ahmed Al-Zaky', 'خبير في الذكاء الاصطناعي مع أكثر من 10 سنوات من الخبرة في التطوير والبحث', 'AI expert with over 10 years of experience in development and research', ARRAY['ChatGPT', 'Machine Learning', 'Deep Learning'], 0, 0, true),
('770e8400-e29b-41d4-a716-446655440002', 'سارة المحمدي', 'Sarah Al-Mohammadi', 'مختصة في تصميم الجرافيك والذكاء الاصطناعي التوليدي', 'Specialist in graphic design and generative AI', ARRAY['Midjourney', 'AI Art', 'Creative AI'], 0, 0, true),
('770e8400-e29b-41d4-a716-446655440003', 'م. محمد التقني', 'Eng. Mohammed Al-Taqni', 'مطور برمجيات متخصص في تطبيقات الذكاء الاصطناعي', 'Software developer specialized in AI applications', ARRAY['AI Development', 'Programming', 'Technical Writing'], 0, 0, true);

-- Insert comprehensive blog articles
INSERT INTO public.blog_articles (
  id, title_ar, title_en, slug, content_ar, content_en, excerpt_ar, excerpt_en, 
  meta_description_ar, meta_description_en, keywords, author_id, author_name, 
  category, tags, series_name, series_part, difficulty_level, estimated_reading_time, 
  featured_image_url, view_count, like_count, share_count, is_featured, is_published, 
  published_at
) VALUES 

-- Article 1: ChatGPT Complete Guide - Part 1
(
  '880e8400-e29b-41d4-a716-446655440001',
  'دليل ChatGPT الشامل للمبتدئين - الجزء الأول: البداية الصحيحة',
  'Complete ChatGPT Guide for Beginners - Part 1: Getting Started Right',
  'chatgpt-complete-guide-part-1-getting-started',
  '# دليل ChatGPT الشامل للمبتدئين - الجزء الأول: البداية الصحيحة

## مقدمة

ChatGPT هو أحد أهم أدوات الذكاء الاصطناعي في عصرنا الحالي. إذا كنت مبتدئاً وتريد تعلم كيفية استخدامه بفعالية، فهذا الدليل سيساعدك على البدء بالطريقة الصحيحة.

## ما هو ChatGPT؟

ChatGPT هو نموذج ذكاء اصطناعي متقدم تم تطويره من قبل شركة OpenAI. يمكنه:

- **فهم النصوص**: يتعامل مع اللغة العربية والإنجليزية بطلاقة
- **إنتاج المحتوى**: كتابة المقالات والقصص والشعر
- **حل المشاكل**: المساعدة في البرمجة والرياضيات
- **التحليل**: تحليل البيانات والنصوص

## كيفية البدء مع ChatGPT

### 1. إنشاء حساب

1. اذهب إلى موقع [chat.openai.com](https://chat.openai.com)
2. اضغط على "Sign up"
3. أدخل بريدك الإلكتروني وكلمة المرور
4. تحقق من بريدك الإلكتروني

### 2. واجهة المستخدم

عندما تدخل إلى ChatGPT، ستجد:

- **مربع النص**: لكتابة أسئلتك وطلباتك
- **سجل المحادثات**: على الجانب الأيسر
- **إعدادات الحساب**: في الأعلى

### 3. أول محادثة

جرب أن تسأل:
```
مرحباً، أريد تعلم كيفية استخدام ChatGPT بفعالية
```

## نصائح للمبتدئين

### 1. اكتب بوضوح

❌ **خطأ**: "اعملي شيء عن الذكاء الاصطناعي"
✅ **صحيح**: "اكتب مقالاً من 500 كلمة عن فوائد الذكاء الاصطناعي في التعليم"

### 2. استخدم السياق

بدلاً من سؤال منفصل، اربط أسئلتك:

```
أنا طالب في الجامعة، أدرس علوم الحاسوب. 
أريد فهم خوارزميات التعلم الآلي بطريقة مبسطة.
```

### 3. اطلب التوضيح

إذا لم تفهم الإجابة:
```
هل يمكنك شرح هذا بشكل أبسط؟
أو: أعطني مثالاً عملياً على هذا
```

## الأخطاء الشائعة

### 1. عدم التحديد

❌ "اشرح لي البرمجة"
✅ "اشرح لي أساسيات البرمجة بـ Python للمبتدئين"

### 2. عدم التفاعل

❌ سؤال واحد ثم المغادرة
✅ التفاعل والسؤال عن التفاصيل

### 3. عدم التحقق

❌ أخذ كل إجابة كحقيقة مطلقة
✅ التحقق من المعلومات المهمة

## أمثلة عملية

### مثال 1: طلب كتابة
```
الطلب: اكتب بريداً إلكترونياً رسمياً لطلب إجازة من العمل
النتيجة: بريد إلكتروني مهني ومناسب
```

### مثال 2: طلب الترجمة
```
الطلب: ترجم هذا النص إلى الإنجليزية مع مراعاة السياق الثقافي
النتيجة: ترجمة دقيقة ومناسبة
```

### مثال 3: طلب الشرح
```
الطلب: اشرح لي مفهوم البلوك تشين وكأنني في العاشرة من عمري
النتيجة: شرح مبسط وسهل الفهم
```

## الخطوات التالية

في الجزء التالي من هذه السلسلة، سنتعلم:

1. **تقنيات الـ Prompting المتقدمة**
2. **كيفية الحصول على أفضل النتائج**
3. **استخدام ChatGPT في مجالات مختلفة**
4. **النصائح والحيل المتقدمة**

## خلاصة

ChatGPT أداة قوية جداً عندما تعرف كيفية استخدامها. المفتاح هو:

- **الوضوح في الطلب**
- **التفاعل مع النتائج**
- **التحقق من المعلومات**
- **الممارسة المستمرة**

ابدأ بأسئلة بسيطة واتجه تدريجياً للأسئلة المعقدة. مع الوقت والممارسة، ستصبح خبيراً في استخدام ChatGPT!

---

*هل أعجبك هذا المقال؟ انتظر الجزء التالي من السلسلة حيث سنتعمق في التقنيات المتقدمة!*',
  '',
  'تعلم كيفية استخدام ChatGPT بفعالية من خلال هذا الدليل الشامل للمبتدئين. نصائح عملية، أمثلة واقعية، وإرشادات خطوة بخطوة.',
  '',
  'تعلم كيفية استخدام ChatGPT بفعالية من خلال هذا الدليل الشامل للمبتدئين مع نصائح عملية وأمثلة واقعية ⚡',
  '',
  ARRAY['ChatGPT', 'ChatGPT بالعربي', 'تعلم ChatGPT', 'دليل ChatGPT', 'كيفية استخدام ChatGPT', 'ChatGPT للمبتدئين', 'الذكاء الاصطناعي', 'OpenAI'],
  '770e8400-e29b-41d4-a716-446655440001',
  'د. أحمد الذكي',
  'beginner-guide',
  ARRAY['ChatGPT', 'المبتدئين', 'دليل شامل', 'الذكاء الاصطناعي'],
  'دليل ChatGPT الشامل',
  1,
  'مبتدئ',
  12,
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
  1847,
  156,
  43,
  true,
  true,
  '2025-01-08 10:00:00'
),

-- Article 2: Midjourney Arabic Guide
(
  '880e8400-e29b-41d4-a716-446655440002',
  'دليل إنشاء الصور المذهلة بـ Midjourney - من الصفر إلى الاحتراف',
  'Ultimate Guide to Creating Amazing Images with Midjourney',
  'midjourney-ultimate-guide-arabic',
  '# دليل إنشاء الصور المذهلة بـ Midjourney - من الصفر إلى الاحتراف

## مقدمة

Midjourney هو أحد أقوى أدوات الذكاء الاصطناعي لإنشاء الصور. في هذا الدليل الشامل، ستتعلم كيفية إنشاء صور مذهلة باستخدام هذه الأداة الرائعة.

## ما هو Midjourney؟

Midjourney هو نموذج ذكاء اصطناعي متخصص في إنشاء الصور من النصوص. يمكنه:

- **إنشاء صور فنية**: من الواقعية إلى الخيالية
- **تصميم الشعارات**: والعناصر البصرية
- **إنتاج المحتوى**: للمواقع والمجلات
- **التجريب الإبداعي**: لاستكشاف أفكار جديدة

## كيفية البدء مع Midjourney

### 1. إنشاء حساب Discord

Midjourney يعمل من خلال Discord:

1. اذهب إلى [discord.com](https://discord.com)
2. أنشئ حساباً جديداً
3. حمل تطبيق Discord (اختياري)

### 2. الانضمام إلى خادم Midjourney

1. اذهب إلى [midjourney.com/discord](https://midjourney.com/discord)
2. اضغط على "Join the Beta"
3. ستنتقل إلى Discord

### 3. اختيار الخطة

- **Free Trial**: 25 استخدام مجاني
- **Basic Plan**: $10/شهر - 200 استخدام
- **Standard Plan**: $30/شهر - استخدام لا محدود
- **Pro Plan**: $60/شهر - ميزات متقدمة

## أساسيات استخدام Midjourney

### الأمر الأساسي

```
/imagine prompt: وصف الصورة التي تريدها
```

### مثال بسيط

```
/imagine prompt: قط جميل يلعب في حديقة مليئة بالزهور
```

### مثال متقدم

```
/imagine prompt: portrait of a wise old man with white beard, oil painting style, warm lighting, detailed, 4k --ar 3:4 --v 6
```

## تقنيات الـ Prompting المتقدمة

### 1. استخدام الأسلوب الفني

```
/imagine prompt: landscape, impressionist style, monet inspired, soft colors
```

### 2. تحديد الإضاءة

```
/imagine prompt: portrait, golden hour lighting, soft shadows, cinematic
```

### 3. اختيار الكاميرا

```
/imagine prompt: street photography, shot with Canon 5D, 85mm lens, shallow depth of field
```

## المعاملات المهمة

### 1. نسبة العرض إلى الارتفاع (--ar)

- `--ar 16:9`: للشاشات العريضة
- `--ar 3:4`: للصور العمودية
- `--ar 1:1`: للصور المربعة

### 2. إصدار النموذج (--v)

- `--v 6`: الإصدار الأحدث (الافتراضي)
- `--v 5.2`: للحصول على نتائج مختلفة

### 3. الجودة (--q)

- `--q 0.25`: جودة سريعة
- `--q 1`: جودة عادية
- `--q 2`: جودة عالية

## نصائح للحصول على نتائج أفضل

### 1. كن محدداً

❌ "منظر طبيعي جميل"
✅ "منظر طبيعي لجبال الألب في الصباح مع ضباب خفيف وأشعة شمس ذهبية"

### 2. استخدم كلمات الأسلوب

- **Photorealistic**: للصور الواقعية
- **Anime style**: للأنمي
- **Oil painting**: للوحات الزيتية
- **Watercolor**: للألوان المائية

### 3. حدد التفاصيل

```
/imagine prompt: close-up portrait of a woman, blue eyes, curly hair, natural lighting, shallow depth of field, professional photography
```

## أمثلة عملية

### مثال 1: تصميم شعار

```
/imagine prompt: minimalist logo design, coffee shop, modern typography, brown and cream colors, simple, clean --ar 1:1
```

### مثال 2: منظر طبيعي

```
/imagine prompt: serene lake surrounded by mountains, autumn colors, golden hour, reflection in water, peaceful atmosphere --ar 16:9
```

### مثال 3: بورتريه فني

```
/imagine prompt: portrait of a musician playing violin, dramatic lighting, black and white, emotional expression, artistic photography --ar 3:4
```

## الأخطاء الشائعة

### 1. عدم التحديد

❌ "صورة جميلة"
✅ "portrait of a young woman, natural lighting, professional photography"

### 2. استخدام كلمات سلبية

❌ "لا تجعل الصورة مشوشة"
✅ "sharp focus, high detail, clear image"

### 3. عدم استخدام المعاملات

❌ عدم تحديد نسبة العرض إلى الارتفاع
✅ إضافة --ar حسب الحاجة

## نصائح متقدمة

### 1. استخدام الصور المرجعية

```
/imagine prompt: [رابط الصورة] woman in the style of this image --ar 3:4
```

### 2. الدمج بين الأساليب

```
/imagine prompt: cyberpunk city, neon lights, rain, blade runner style, cinematic, highly detailed --ar 16:9 --v 6
```

### 3. التحكم في التركيب

```
/imagine prompt: rule of thirds composition, sunset over ocean, dramatic clouds, vibrant colors --ar 16:9
```

## استخدامات عملية

### 1. المحتوى التسويقي

- صور للمنتجات
- خلفيات للإعلانات
- تصاميم للشبكات الاجتماعية

### 2. التصميم الجرافيكي

- عناصر بصرية
- خلفيات للمواقع
- تصاميم للطباعة

### 3. الفن والإبداع

- استكشاف أفكار جديدة
- إنشاء معارض فنية
- تطوير الأسلوب الشخصي

## خلاصة

Midjourney أداة قوية لإنشاء الصور بالذكاء الاصطناعي. المفاتيح للنجاح:

- **التحديد في الوصف**
- **استخدام المعاملات المناسبة**
- **التجريب المستمر**
- **دراسة الأعمال الناجحة**

ابدأ بأوصاف بسيطة واتجه تدريجياً للأوصاف المعقدة. مع الممارسة، ستصبح قادراً على إنشاء صور مذهلة!

---

*هل جربت Midjourney؟ شاركنا تجربتك في التعليقات!*',
  '',
  'دليل شامل لاستخدام Midjourney لإنشاء صور مذهلة بالذكاء الاصطناعي. تعلم التقنيات المتقدمة والنصائح العملية للحصول على أفضل النتائج.',
  '',
  'دليل شامل لاستخدام Midjourney لإنشاء صور مذهلة بالذكاء الاصطناعي مع تقنيات متقدمة ونصائح عملية ⚡',
  '',
  ARRAY['Midjourney', 'Midjourney بالعربي', 'إنشاء صور بالذكاء الاصطناعي', 'AI art', 'تعلم Midjourney', 'دليل Midjourney', 'صور الذكاء الاصطناعي', 'فن الذكاء الاصطناعي'],
  '770e8400-e29b-41d4-a716-446655440002',
  'سارة المحمدي',
  'advanced-tutorials',
  ARRAY['Midjourney', 'إنشاء الصور', 'الذكاء الاصطناعي', 'التصميم'],
  'إتقان Midjourney',
  1,
  'متوسط',
  15,
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=400&fit=crop',
  2156,
  198,
  67,
  true,
  true,
  '2025-01-07 14:30:00'
),

-- Article 3: AI Tools Comparison
(
  '880e8400-e29b-41d4-a716-446655440003',
  'مقارنة شاملة: ChatGPT vs Claude vs Gemini - أيهما الأفضل؟',
  'Comprehensive Comparison: ChatGPT vs Claude vs Gemini - Which is Best?',
  'chatgpt-vs-claude-vs-gemini-comparison',
  '# مقارنة شاملة: ChatGPT vs Claude vs Gemini - أيهما الأفضل؟

## مقدمة

مع تزايد عدد أدوات الذكاء الاصطناعي، أصبح من الصعب اختيار الأداة المناسبة. في هذا المقال، سنقارن بين ثلاث من أهم أدوات الذكاء الاصطناعي المتاحة حالياً.

## نظرة عامة على الأدوات

### ChatGPT (OpenAI)
- **تاريخ الإطلاق**: نوفمبر 2022
- **الشركة**: OpenAI
- **النموذج**: GPT-4 Turbo
- **التخصص**: محادثة عامة ومساعدة متنوعة

### Claude (Anthropic)
- **تاريخ الإطلاق**: مارس 2023
- **الشركة**: Anthropic
- **النموذج**: Claude 3 Opus
- **التخصص**: أمان عالي وتحليل معمق

### Gemini (Google)
- **تاريخ الإطلاق**: ديسمبر 2023
- **الشركة**: Google
- **النموذج**: Gemini Ultra
- **التخصص**: تكامل مع خدمات Google

## مقارنة تفصيلية

### 1. الأداء في اللغة العربية

#### ChatGPT
- ✅ **ممتاز**: فهم جيد للعربية الفصحى
- ✅ **جيد**: يتعامل مع بعض اللهجات
- ❌ **ضعيف**: أحياناً يخطئ في النحو المعقد

#### Claude
- ✅ **ممتاز**: دقة عالية في القواعد النحوية
- ✅ **جيد**: فهم السياق الثقافي العربي
- ⚠️ **متوسط**: أبطأ قليلاً في الاستجابة

#### Gemini
- ✅ **جيد**: يفهم العربية بشكل جيد
- ✅ **ممتاز**: ترجمة دقيقة من وإلى العربية
- ❌ **ضعيف**: لا يفهم اللهجات المحلية جيداً

### 2. جودة المحتوى

#### ChatGPT
- **نقاط القوة**:
  - سرعة في الاستجابة
  - تنوع في أساليب الكتابة
  - سهولة في الاستخدام

- **نقاط الضعف**:
  - أحياناً يعطي معلومات خاطئة
  - يمكن أن يكرر نفسه
  - قد يفتقر للدقة في التفاصيل

#### Claude
- **نقاط القوة**:
  - دقة عالية في المعلومات
  - تحليل معمق ومنطقي
  - أمان عالي ضد المحتوى الضار

- **نقاط الضعف**:
  - أبطأ في الاستجابة
  - أحياناً يكون حذراً أكثر من اللازم
  - واجهة أقل تطوراً

#### Gemini
- **نقاط القوة**:
  - تكامل مع خدمات Google
  - معلومات محدثة من الإنترنت
  - دعم للصور والملفات

- **نقاط الضعف**:
  - أحياناً يعطي إجابات مختصرة
  - قد يفتقر للإبداع
  - محدود في بعض المناطق

### 3. التسعير

#### ChatGPT
- **مجاني**: GPT-3.5 مع قيود
- **ChatGPT Plus**: $20/شهر
- **ChatGPT Team**: $25/شهر للشخص
- **ChatGPT Enterprise**: تسعير مخصص

#### Claude
- **مجاني**: Claude 3 Haiku مع قيود
- **Claude Pro**: $20/شهر
- **Claude Team**: $25/شهر للشخص
- **Claude Enterprise**: تسعير مخصص

#### Gemini
- **مجاني**: Gemini مع قيود
- **Gemini Advanced**: $20/شهر
- **مدمج مع Google Workspace**: حسب الخطة

### 4. الميزات الإضافية

#### ChatGPT
- 🔌 **الإضافات**: آلاف الإضافات المتاحة
- 📊 **تحليل البيانات**: Code Interpreter
- 🔍 **البحث**: تصفح الإنترنت
- 🎨 **إنشاء الصور**: DALL-E 3

#### Claude
- 📄 **الملفات**: تحليل PDF و Word
- 🔒 **الأمان**: أعلى مستويات الأمان
- 🧠 **التفكير**: قدرات تحليل متقدمة
- 💻 **البرمجة**: ممتاز في كتابة الكود

#### Gemini
- 🔗 **التكامل**: مع جميع خدمات Google
- 📱 **التطبيقات**: متاح على جميع الأجهزة
- 🌐 **المعلومات**: الحصول على معلومات حديثة
- 🎯 **الدقة**: معلومات موثوقة من Google

## حالات الاستخدام

### للطلاب

**الأفضل: ChatGPT**
- سهولة الاستخدام
- مساعدة في الواجبات
- شرح المفاهيم
- كتابة المقالات

### للكتاب والمؤلفين

**الأفضل: Claude**
- دقة عالية في اللغة
- تحليل معمق للنصوص
- مساعدة في التحرير
- احترام حقوق الملكية

### للشركات

**الأفضل: Gemini**
- تكامل مع Gmail و Drive
- أمان مؤسسي
- تحليل البيانات
- دعم متعدد اللغات

### للمطورين

**الأفضل: Claude**
- كتابة كود عالي الجودة
- شرح مفصل للحلول
- مراجعة الكود
- أمان في التطبيقات

## الاختبارات العملية

### اختبار الكتابة الإبداعية

**المهمة**: كتابة قصة قصيرة عن المستقبل

- **ChatGPT**: قصة مسلية وخيالية ✅
- **Claude**: قصة أكثر تماسكاً وعمقاً ✅✅
- **Gemini**: قصة واقعية وبسيطة ✅

### اختبار الترجمة

**المهمة**: ترجمة نص تقني من الإنجليزية للعربية

- **ChatGPT**: ترجمة جيدة مع بعض الأخطاء ✅
- **Claude**: ترجمة دقيقة جداً ✅✅
- **Gemini**: ترجمة ممتازة ومراعية للسياق ✅✅

### اختبار البرمجة

**المهمة**: كتابة برنامج Python لتحليل البيانات

- **ChatGPT**: كود يعمل مع شرح بسيط ✅
- **Claude**: كود محسن مع شرح مفصل ✅✅
- **Gemini**: كود جيد مع أمثلة عملية ✅

## التوصيات

### للمبتدئين
**اختر ChatGPT**
- سهل الاستخدام
- مجتمع كبير
- موارد تعليمية كثيرة

### للمحترفين
**اختر Claude**
- دقة عالية
- تحليل معمق
- أمان متقدم

### للشركات
**اختر Gemini**
- تكامل مع الأدوات
- أمان مؤسسي
- دعم تقني

## الخلاصة

لا توجد أداة "الأفضل" مطلقاً. الاختيار يعتمد على:

1. **احتياجاتك المحددة**
2. **مستوى خبرتك**
3. **ميزانيتك**
4. **أولوياتك (السرعة، الدقة، الأمان)**

### النصيحة الذهبية

جرب الثلاث أدوات بالنسخة المجانية أولاً، ثم اختر الأنسب لك. يمكنك أيضاً استخدام أكثر من أداة لمهام مختلفة.

---

*ما رأيك في هذه المقارنة؟ أي أداة تستخدم وما تجربتك معها؟*',
  '',
  'مقارنة شاملة بين ChatGPT و Claude و Gemini. اكتشف أيهما الأفضل لاحتياجاتك مع تحليل مفصل للمميزات والعيوب والأسعار.',
  '',
  'مقارنة شاملة بين ChatGPT و Claude و Gemini - اكتشف أيهما الأفضل لاحتياجاتك مع تحليل مفصل للمميزات والعيوب ⚡',
  '',
  ARRAY['ChatGPT vs Claude', 'مقارنة أدوات الذكاء الاصطناعي', 'ChatGPT vs Gemini', 'أفضل أداة ذكاء اصطناعي', 'Claude vs Gemini', 'مقارنة AI tools'],
  '770e8400-e29b-41d4-a716-446655440001',
  'د. أحمد الذكي',
  'tool-comparisons',
  ARRAY['مقارنة', 'ChatGPT', 'Claude', 'Gemini', 'أدوات الذكاء الاصطناعي'],
  NULL,
  NULL,
  'متوسط',
  18,
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=400&fit=crop',
  3241,
  289,
  156,
  true,
  true,
  '2025-01-06 11:15:00'
);

-- Update categories with correct article counts
UPDATE public.blog_categories SET article_count = 1 WHERE slug = 'beginner-guide';
UPDATE public.blog_categories SET article_count = 1 WHERE slug = 'advanced-tutorials';
UPDATE public.blog_categories SET article_count = 1 WHERE slug = 'tool-comparisons';

-- Update authors with correct stats
UPDATE public.blog_authors SET 
  article_count = 2,
  total_views = 4088
WHERE id = '770e8400-e29b-41d4-a716-446655440001';

UPDATE public.blog_authors SET 
  article_count = 1,
  total_views = 2156
WHERE id = '770e8400-e29b-41d4-a716-446655440002';

-- Update blog series with correct stats
UPDATE public.blog_series SET 
  completed_parts = 1
WHERE slug = 'chatgpt-complete-guide';

UPDATE public.blog_series SET 
  completed_parts = 1
WHERE slug = 'mastering-midjourney';