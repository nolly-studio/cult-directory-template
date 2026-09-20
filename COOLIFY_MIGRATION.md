# Coolify Migration Checklist

> **Purpose**: Step-by-step guide for migrating from Railway to Coolify  
> **Status**: Template - Customize for your specific migration needs

This document provides a migration checklist for moving your application from Railway to Coolify, typically triggered by:
- Free tier limits exceeded on Railway
- Need for self-hosted deployment
- Cost optimization requirements

---

## Pre-Migration Checklist

### 1. Infrastructure Preparation

- [ ] **Coolify Server Setup**
  - [ ] Provision server (VPS/dedicated)
  - [ ] Install Docker and Docker Compose
  - [ ] Install Coolify (https://coolify.io/docs/installation)
  - [ ] Configure SSL certificates
  - [ ] Set up domain DNS records

- [ ] **Hostinger VPN (Optional)**
  - [ ] Configure VPN access to server
  - [ ] Test connectivity through VPN tunnel
  - [ ] Document network topology

### 2. Data Backup

- [ ] **Database Backup**
  - [ ] Export Supabase database (if applicable)
  - [ ] Backup any local storage/uploads
  - [ ] Document current data schema

- [ ] **Configuration Backup**
  - [ ] Export Railway environment variables
  - [ ] Save current deployment configuration
  - [ ] Document any custom build settings

### 3. Secret Migration

- [ ] **Review `.agents` File**
  - [ ] Verify all required secrets are documented
  - [ ] Update `master.secrets.json` with production values
  - [ ] Prepare secrets for Coolify secret management

- [ ] **Environment Variables**
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` - Ready for transfer
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Ready for transfer
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` - Ready for transfer (if used)
  - [ ] AI API Keys (if applicable) - Ready for transfer

---

## Migration Steps

### Phase 1: Coolify Setup

```bash
# 1. Clone repository to Coolify server or connect via Git
# 2. Create new application in Coolify dashboard
# 3. Configure build settings:
#    - Build Pack: Nixpacks or Docker
#    - Build Command: pnpm install && pnpm run build
#    - Start Command: pnpm start
```

- [ ] Create application in Coolify
- [ ] Connect Git repository
- [ ] Configure build settings
- [ ] Set up environment variables in Coolify

### Phase 2: Configuration Transfer

- [ ] **Copy Environment Variables**
  - Transfer all variables from Railway to Coolify
  - Verify variable names match exactly
  - Test with placeholder values first

- [ ] **Apply Docker/Compose Configuration**
  - Customize `docker-compose.coolify.yml` from COOLIFY_SUPPORT.md
  - Verify Dockerfile is production-ready
  - Test local Docker build

### Phase 3: DNS & Domain Setup

- [ ] **Update DNS Records**
  - Point domain to Coolify server IP
  - Configure SSL/TLS certificates
  - Set up redirects if needed

- [ ] **Test Domain Resolution**
  - Verify SSL certificate is valid
  - Test HTTPS access
  - Check for mixed content issues

### Phase 4: Deployment

```bash
# Trigger deployment in Coolify
# Monitor build logs for errors
# Verify application starts successfully
```

- [ ] Trigger initial deployment
- [ ] Monitor build logs
- [ ] Verify application health check passes
- [ ] Test all critical functionality

### Phase 5: Validation

- [ ] **Functional Testing**
  - [ ] Homepage loads correctly
  - [ ] Authentication works (if applicable)
  - [ ] Database connections are functional
  - [ ] All API endpoints respond
  - [ ] Static assets load properly

- [ ] **Performance Testing**
  - [ ] Response times are acceptable
  - [ ] No memory leaks observed
  - [ ] CPU usage is within limits

---

## Post-Migration Tasks

### Railway Cleanup

- [ ] **Decommission Railway Service**
  - [ ] Verify Coolify deployment is stable (wait 24-48 hours)
  - [ ] Export final Railway logs
  - [ ] Delete Railway deployment
  - [ ] Remove Railway project (optional)

### Documentation Update

- [ ] Update deployment documentation
- [ ] Update README.md with new deployment info
- [ ] Notify team members of migration
- [ ] Archive Railway-specific configurations

---

## Rollback Plan

If migration fails:

1. **Immediate**: Railway service should still be paused (not deleted)
2. **Quick Recovery**: Redeploy maintenance.html on Railway
3. **Full Rollback**: Restore Railway environment variables and redeploy

```bash
# To restore Railway deployment:
# 1. Navigate to Railway dashboard
# 2. Remove maintenance mode environment variables
# 3. Trigger new deployment
# 4. Update DNS to point back to Railway
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check pnpm-lock.yaml is committed, verify Node version |
| Environment variables missing | Double-check Coolify env var configuration |
| Database connection fails | Verify Supabase URLs and keys are correct |
| Static assets 404 | Check public folder is included in build |
| SSL errors | Verify certificate configuration in Coolify |

### Getting Help

- Coolify Documentation: https://coolify.io/docs
- Coolify Discord: https://discord.gg/coolify
- Supabase Support: https://supabase.com/docs

---

## Cost Comparison Notes

| Resource | Railway (Free) | Coolify (Self-Hosted) |
|----------|---------------|----------------------|
| Monthly Cost | $5 credit | VPS cost only (~$5-20/mo) |
| Execution Hours | ~500 hrs | Unlimited |
| Memory | Limited | Based on VPS |
| Scaling | Pay as you go | Manual/VPS upgrade |
| Maintenance | None | Self-managed |

---

*Generated by Railway Zero-Secrets Bootstrapper*  
*Last Updated: Auto-generated during deployment preparation*
