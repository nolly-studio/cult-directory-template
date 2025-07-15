# Database Reference

This folder contains comprehensive information about our Supabase database structure, including table schemas, relationships, and commonly used SQL queries.

## Table Overview

Our database contains the following main tables:

- **users** - User profiles and authentication data
- **products** - AI tools and applications (main content)
- **categories** - Tool categories for organization
- **tags** - Tagging system for products
- **labels** - Additional labeling system
- **user_favorites** - User's favorite products
- **product_views** - View tracking for products
- **user_reviews** - User-generated reviews (authenticated)
- **product_reviews** - Public reviews with email
- **tutorials** - Educational content in Arabic/English
- **ai_news** - News articles about AI
- **newsletter_subscribers** - Email newsletter subscriptions
- **site_settings** - Site configuration and settings
- **email_campaigns** - Newsletter campaign management
- **admin_activity_logs** - Audit trail for administrative actions

## File Structure

Each table has its own file containing:
- Complete table schema with column types and constraints
- Primary keys and foreign key relationships
- Common SELECT queries for typical operations
- Advanced queries for analytics and reporting

### Additional Reference Files:
- **site-management.sql** - Site settings and email campaigns
- **admin_activity_logs.sql** - Admin activity tracking and audit trails
- **view_tracking_system.sql** - View counting and analytics system
- **common-analytics.sql** - Cross-table insights and reports
- **quick-reference.sql** - Essential commands and connection info

## Database Info

- **Project ID**: tarkomdsckzhhhkmeqpw
- **Database Engine**: PostgreSQL 15
- **Region**: us-east-2
- **Status**: ACTIVE_HEALTHY

## Quick Reference

### Most Important Tables
1. `products` - Core AI tools data with Arabic/English support
2. `users` - User management with role-based access
3. `tutorials` - Bilingual educational content
4. `ai_news` - News content with multi-language support

### Key Features
- Row Level Security (RLS) enabled on all tables
- Multi-language support (Arabic/English)
- User authentication integration
- View counting and analytics
- Review and rating system
- Site configuration management
- Email campaign system
- Admin dashboard functions 