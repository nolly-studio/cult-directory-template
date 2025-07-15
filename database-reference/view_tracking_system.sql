-- =============================================================================
-- VIEW TRACKING SYSTEM - Accurate View Counting and Analytics
-- =============================================================================

-- Comprehensive view tracking system with proper data consistency
-- Tracks views in both product_views table and products.view_count column

-- =============================================================================
-- TABLE STRUCTURES
-- =============================================================================

-- products.view_count (integer): Cached total view count for quick access
-- product_views table:
-- - id (uuid, PK): Unique identifier for each view
-- - product_id (uuid, FK): References products.id
-- - viewed_at (timestamptz): When the view occurred

-- =============================================================================
-- VIEW TRACKING FUNCTIONS
-- =============================================================================

-- Function to record a new product view
-- Usage: SELECT record_product_view('product-uuid-here');
-- This function:
-- 1. Adds entry to product_views table
-- 2. Increments view_count in products table
-- Example: SELECT record_product_view('f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid);

-- Function to get accurate view count for a product
-- Usage: SELECT get_product_view_count('product-uuid-here');
-- Returns: INTEGER count of views from product_views table

-- Function to sync all view counts (admin maintenance)
-- Usage: SELECT sync_product_view_counts();
-- This ensures products.view_count matches actual records in product_views

-- =============================================================================
-- VIEW ANALYTICS QUERIES
-- =============================================================================

-- Get top viewed products
SELECT 
    codename as "اسم الأداة",
    arabic_name as "الاسم العربي",
    view_count as "عدد المشاهدات",
    categories as "الفئة",
    created_at as "تاريخ الإضافة"
FROM products 
WHERE approved = true
ORDER BY view_count DESC
LIMIT 10;

-- View trends by day (last 30 days)
SELECT 
    DATE(viewed_at) as "التاريخ",
    COUNT(*) as "المشاهدات اليومية",
    COUNT(DISTINCT product_id) as "الأدوات المشاهدة"
FROM product_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(viewed_at)
ORDER BY DATE(viewed_at) DESC;

-- Most popular tools this week
SELECT 
    p.codename as "اسم الأداة",
    p.arabic_name as "الاسم العربي",
    COUNT(pv.id) as "مشاهدات هذا الأسبوع",
    p.view_count as "إجمالي المشاهدات"
FROM products p
LEFT JOIN product_views pv ON p.id = pv.product_id 
    AND pv.viewed_at >= NOW() - INTERVAL '7 days'
WHERE p.approved = true
GROUP BY p.id, p.codename, p.arabic_name, p.view_count
ORDER BY COUNT(pv.id) DESC
LIMIT 10;

-- View statistics by category
SELECT 
    categories as "الفئة",
    COUNT(*) as "عدد الأدوات",
    SUM(view_count) as "إجمالي المشاهدات",
    ROUND(AVG(view_count)) as "متوسط المشاهدات",
    MAX(view_count) as "أعلى مشاهدات"
FROM products 
WHERE approved = true AND categories IS NOT NULL
GROUP BY categories
ORDER BY SUM(view_count) DESC;

-- Monthly view trends
SELECT 
    DATE_TRUNC('month', viewed_at) as "الشهر",
    COUNT(*) as "المشاهدات",
    COUNT(DISTINCT product_id) as "الأدوات المشاهدة",
    COUNT(DISTINCT DATE(viewed_at)) as "الأيام النشطة"
FROM product_views 
GROUP BY DATE_TRUNC('month', viewed_at)
ORDER BY DATE_TRUNC('month', viewed_at) DESC;

-- =============================================================================
-- VIEW CONSISTENCY VERIFICATION
-- =============================================================================

-- Check for any inconsistencies between cached and actual counts
SELECT 
    p.codename as "اسم الأداة",
    p.view_count as "العدد المحفوظ",
    COUNT(pv.id) as "العدد الفعلي",
    (p.view_count - COUNT(pv.id)) as "الفرق",
    CASE 
        WHEN p.view_count = COUNT(pv.id) THEN '✅ متطابق'
        ELSE '❌ غير متطابق'
    END as "الحالة"
FROM products p
LEFT JOIN product_views pv ON p.id = pv.product_id
GROUP BY p.id, p.codename, p.view_count
HAVING p.view_count != COUNT(pv.id)
ORDER BY ABS(p.view_count - COUNT(pv.id)) DESC;

-- Get total view statistics
SELECT 
    'إحصائيات المشاهدات' as "التقرير",
    COUNT(DISTINCT product_id) as "الأدوات المشاهدة",
    COUNT(*) as "إجمالي المشاهدات",
    COUNT(DISTINCT DATE(viewed_at)) as "الأيام النشطة",
    MIN(viewed_at) as "أول مشاهدة",
    MAX(viewed_at) as "آخر مشاهدة"
FROM product_views;

-- =============================================================================
-- POPULAR CONTENT IDENTIFICATION
-- =============================================================================

-- Top performing tools by different metrics
SELECT 
    p.codename as "اسم الأداة",
    p.view_count as "المشاهدات",
    p.arabic_name as "الاسم العربي",
    p.categories as "الفئة",
    p.difficulty_level as "مستوى الصعوبة",
    CASE 
        WHEN p.featured = true THEN '⭐ مميز'
        ELSE ''
    END as "مميز",
    DATE(p.created_at) as "تاريخ الإضافة"
FROM products p
WHERE p.approved = true
ORDER BY p.view_count DESC;

-- Rising stars (tools with high recent activity)
SELECT 
    p.codename as "اسم الأداة",
    p.arabic_name as "الاسم العربي",
    COUNT(pv.id) as "مشاهدات الأسبوع الماضي",
    p.view_count as "إجمالي المشاهدات",
    ROUND((COUNT(pv.id)::decimal / p.view_count) * 100, 2) as "نسبة النشاط %"
FROM products p
LEFT JOIN product_views pv ON p.id = pv.product_id 
    AND pv.viewed_at >= NOW() - INTERVAL '7 days'
WHERE p.approved = true AND p.view_count > 0
GROUP BY p.id, p.codename, p.arabic_name, p.view_count
HAVING COUNT(pv.id) > 0
ORDER BY (COUNT(pv.id)::decimal / p.view_count) DESC
LIMIT 10;

-- Tools needing attention (low views)
SELECT 
    p.codename as "اسم الأداة",
    p.arabic_name as "الاسم العربي",
    p.view_count as "المشاهدات",
    p.categories as "الفئة",
    EXTRACT(DAYS FROM NOW() - p.created_at) as "عمر الأداة بالأيام"
FROM products p
WHERE p.approved = true
ORDER BY p.view_count ASC, p.created_at DESC
LIMIT 10;

-- =============================================================================
-- ADMIN MAINTENANCE QUERIES
-- =============================================================================

-- Sync all view counts (run if you suspect inconsistencies)
-- SELECT sync_product_view_counts();

-- Verify all counts are consistent
SELECT 
    COUNT(*) as "إجمالي الأدوات",
    COUNT(CASE WHEN p.view_count = view_stats.actual_views THEN 1 END) as "متطابقة",
    COUNT(CASE WHEN p.view_count != view_stats.actual_views THEN 1 END) as "غير متطابقة"
FROM products p
LEFT JOIN (
    SELECT 
        product_id,
        COUNT(*) as actual_views
    FROM product_views
    GROUP BY product_id
) view_stats ON p.id = view_stats.product_id;

-- Reset view count for a specific product (emergency use)
-- UPDATE products SET view_count = (
--     SELECT COUNT(*) FROM product_views WHERE product_id = products.id
-- ) WHERE codename = 'tool-name-here';

-- Clean up duplicate views (if any exist)
-- DELETE FROM product_views 
-- WHERE id NOT IN (
--     SELECT MIN(id) 
--     FROM product_views 
--     GROUP BY product_id, DATE_TRUNC('minute', viewed_at)
-- );

-- =============================================================================
-- PERFORMANCE MONITORING
-- =============================================================================

-- View tracking table size and performance
SELECT 
    pg_size_pretty(pg_total_relation_size('product_views')) as "حجم جدول المشاهدات",
    COUNT(*) as "عدد السجلات",
    COUNT(DISTINCT product_id) as "الأدوات المتتبعة",
    MIN(viewed_at) as "أقدم مشاهدة",
    MAX(viewed_at) as "أحدث مشاهدة"
FROM product_views;

-- Daily growth rate
SELECT 
    DATE(viewed_at) as "التاريخ",
    COUNT(*) as "المشاهدات",
    LAG(COUNT(*)) OVER (ORDER BY DATE(viewed_at)) as "اليوم السابق",
    COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE(viewed_at)) as "النمو"
FROM product_views 
WHERE viewed_at >= NOW() - INTERVAL '14 days'
GROUP BY DATE(viewed_at)
ORDER BY DATE(viewed_at) DESC;

-- =============================================================================
-- INTEGRATION WITH OTHER SYSTEMS
-- =============================================================================

-- Tools with high views but no reviews (opportunity for engagement)
SELECT 
    p.codename as "اسم الأداة",
    p.view_count as "المشاهدات",
    COALESCE(ur.user_reviews, 0) as "تقييمات المستخدمين",
    COALESCE(pr.public_reviews, 0) as "التقييمات العامة"
FROM products p
LEFT JOIN (
    SELECT product_id, COUNT(*) as user_reviews 
    FROM user_reviews GROUP BY product_id
) ur ON p.id = ur.product_id
LEFT JOIN (
    SELECT product_id, COUNT(*) as public_reviews 
    FROM product_reviews GROUP BY product_id
) pr ON p.id = pr.product_id
WHERE p.approved = true 
  AND p.view_count > 100
  AND COALESCE(ur.user_reviews, 0) + COALESCE(pr.public_reviews, 0) = 0
ORDER BY p.view_count DESC; 