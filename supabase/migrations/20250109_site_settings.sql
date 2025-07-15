-- Create site_settings table for storing configuration
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    description TEXT,
    category VARCHAR(100) NOT NULL DEFAULT 'general',
    is_sensitive BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index for faster lookups
CREATE INDEX idx_site_settings_key ON site_settings(key);
CREATE INDEX idx_site_settings_category ON site_settings(category);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read site settings
CREATE POLICY "Admins can read site settings" ON site_settings
    FOR SELECT
    USING (check_is_admin());

-- Policy: Only admins can update site settings
CREATE POLICY "Admins can update site settings" ON site_settings
    FOR UPDATE
    USING (check_is_admin());

-- Policy: Only admins can insert site settings
CREATE POLICY "Admins can insert site settings" ON site_settings
    FOR INSERT
    WITH CHECK (check_is_admin());

-- Policy: Only admins can delete site settings
CREATE POLICY "Admins can delete site settings" ON site_settings
    FOR DELETE
    USING (check_is_admin());

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.updated_by = auth.uid();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at timestamp
CREATE TRIGGER site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

-- Insert default settings
INSERT INTO site_settings (key, value, description, category) VALUES
    ('site_name', '"TheAIArab"', 'اسم الموقع / Site name', 'general'),
    ('site_name_ar', '"ذا إيه آي عرب"', 'اسم الموقع بالعربية / Site name in Arabic', 'general'),
    ('site_description', '"Discover the best AI tools in Arabic"', 'وصف الموقع / Site description', 'general'),
    ('site_description_ar', '"اكتشف أفضل أدوات الذكاء الاصطناعي بالعربية"', 'وصف الموقع بالعربية / Site description in Arabic', 'general'),
    ('contact_email', '"support@arabie.ai"', 'البريد الإلكتروني للتواصل / Contact email', 'contact'),
    ('social_twitter', '"@theaiarab"', 'حساب تويتر / Twitter handle', 'social'),
    ('social_linkedin', '"theaiarab"', 'حساب لينكد إن / LinkedIn handle', 'social'),
    ('analytics_enabled', 'true', 'تفعيل التحليلات / Enable analytics', 'features'),
    ('newsletter_enabled', 'true', 'تفعيل النشرة البريدية / Enable newsletter', 'features'),
    ('reviews_enabled', 'true', 'تفعيل التقييمات / Enable reviews', 'features'),
    ('auto_approve_products', 'false', 'الموافقة التلقائية على المنتجات / Auto-approve products', 'features'),
    ('maintenance_mode', 'false', 'وضع الصيانة / Maintenance mode', 'features'),
    ('items_per_page', '20', 'عدد العناصر في كل صفحة / Items per page', 'display'),
    ('default_language', '"ar"', 'اللغة الافتراضية / Default language', 'display'),
    ('smtp_host', '""', 'خادم SMTP / SMTP host', 'email'),
    ('smtp_port', '587', 'منفذ SMTP / SMTP port', 'email'),
    ('smtp_user', '""', 'مستخدم SMTP / SMTP user', 'email'),
    ('smtp_from_email', '"noreply@arabie.ai"', 'البريد المرسل / From email', 'email'),
    ('smtp_from_name', '"TheAIArab"', 'اسم المرسل / From name', 'email')
ON CONFLICT (key) DO NOTHING;

-- Create email_campaigns table for newsletter management
CREATE TABLE IF NOT EXISTS email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for email_campaigns
CREATE INDEX idx_email_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_email_campaigns_created_by ON email_campaigns(created_by);
CREATE INDEX idx_email_campaigns_scheduled_for ON email_campaigns(scheduled_for);

-- Enable RLS for email_campaigns
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Policies for email_campaigns
CREATE POLICY "Admins can manage email campaigns" ON email_campaigns
    FOR ALL
    USING (check_is_admin());

-- Function to update email_campaigns updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for email_campaigns
CREATE TRIGGER email_campaigns_updated_at
    BEFORE UPDATE ON email_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_email_campaigns_updated_at();