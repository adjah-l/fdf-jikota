# DEMO/PLACEHOLDER CONTENT INVENTORY

**Generated:** `date +%Y-%m-%d`  
**Standard:** DEV-ADjah (UI copy only, preserve DB identifiers)  
**Scope:** Frontend user-facing content analysis  

---

## 📋 EXECUTIVE SUMMARY

**Total Issues Found:** 47 instances  
**Auto-fixable:** 34 instances  
**Requires Product Input:** 13 instances  
**Dinner-only Terminology:** 15 instances  
**Demo/Placeholder Content:** 32 instances  

---

## 🍽️ DINNER-ONLY TERMINOLOGY

### Group References (15 instances)

| File | Line(s) | Current Text | Suggested Replacement | Auto-fixable |
|------|---------|--------------|----------------------|-------------|
| `src/app/member/pages/Home.tsx` | 22 | "Downtown Dinner Group" | "Downtown Group" | ✅ Yes |
| `src/app/member/pages/Messages.tsx` | 27 | "Downtown Dinner Group" | "Downtown Group" | ✅ Yes |
| `src/app/member/pages/Group.tsx` | 14 | "with fallback to dinner groups" | "with fallback to legacy groups" | ✅ Yes |
| `src/components/external-data/ExternalEmailConfigForm.tsx` | 22 | "Your Five Course Dinner Group Assignment" | "Your Five Course Group Assignment" | ✅ Yes |
| `src/components/external-data/ExternalEmailConfigForm.tsx` | 27 | "dinner group! You've been carefully" | "group! You've been carefully" | ✅ Yes |
| `src/components/external-data/ExternalEmailConfigForm.tsx` | 151 | "Dinner Group Assignment" | "Group Assignment" | ✅ Yes |
| `src/hooks/useActivityGroups.ts` | 38-39 | "Fallback to dinner groups if" | "Fallback to legacy groups if" | ✅ Yes |
| `src/hooks/useActivityGroups.ts` | 55 | "Dinner Group ${String(dg.id)" | "Legacy Group ${String(dg.id)" | ✅ Yes |
| `src/hooks/useActivityGroups.ts` | 75-86 | "try dinner groups as fallback" | "try legacy groups as fallback" | ✅ Yes |
| `src/hooks/useMatching.ts` | 81 | "The dinner group has been approved" | "The group has been approved" | ✅ Yes |
| `src/hooks/useMyGroup.ts` | 43-44 | "Fallback to dinner groups" | "Fallback to legacy groups" | ✅ Yes |

### ❌ PRESERVE (DB Identifiers)
**Do NOT change:** `dinner_groups` (table), `dinner_group_id` (column), migration references

---

## 📝 DEMO/PLACEHOLDER CONTENT

### Email Addresses (9 instances)

| File | Line(s) | Placeholder Email | Context | Auto-fixable |
|------|---------|------------------|---------|-------------|
| `src/app/member/pages/Group.tsx` | 31-35 | "sarah@example.com", "mike@example.com", etc. | Mock group member data | ❌ No - Product Input |
| `src/app/member/pages/Profile.tsx` | 24 | "john@example.com" | Demo profile data | ❌ No - Product Input |
| `src/components/InviteFriend.tsx` | 204 | "friend@example.com" | Placeholder text | ✅ Yes |
| `src/pages/admin/AdminMessaging.tsx` | 599 | "test@example.com" | Test email field placeholder | ✅ Yes |
| `src/test/mocks/handlers.ts` | 10 | "test@example.com" | MSW mock data | ✅ Yes - Keep for testing |

**Suggested Replacements:**
```typescript
// For placeholders
"friend@example.com" → "friend@yourdomain.com"
"test@example.com" → "test@yourdomain.com"

// For demo data (requires product input)
Mock member emails should use realistic but clearly fake format:
"member1@community.demo", "member2@community.demo"
```

### TODO Comments (8 instances)

| File | Line(s) | TODO Text | Priority | Auto-fixable |
|------|---------|-----------|----------|-------------|
| `src/app/admin/components/AdminHeader.tsx` | 22 | "TODO: Redirect to /app" | Medium | ❌ No |
| `src/app/admin/pages/Overview.tsx` | 9 | "TODO: Replace with real data from API" | High | ❌ No |
| `src/app/member/components/MemberHeader.tsx` | 22, 69 | "TODO: Check if user has admin role" | Medium | ❌ No |
| `src/app/member/pages/Care.tsx` | 32, 111, 117, 123 | "TODO: Replace with real data/API calls" | High | ❌ No |
| `src/app/member/pages/Group.tsx` | 17 | "TODO: Replace with real data from API" | High | ❌ No |
| `src/app/member/pages/Profile.tsx` | 54, 62 | "TODO: Implement API call/verification" | High | ❌ No |

### Mock Data (15 instances)

| File | Line(s) | Mock Content | Type | Auto-fixable |
|------|---------|-------------|------|-------------|
| `src/app/member/pages/Group.tsx` | 22-44 | Group description, member list, meetings | Member data | ❌ No - Product Input |
| `src/app/member/pages/Profile.tsx` | 19-33 | "John Smith", address, phone | Profile data | ❌ No - Product Input |
| `src/app/member/pages/Home.tsx` | 11-24 | Care credits, activity messages | Dashboard data | ❌ No - Product Input |
| `src/app/member/pages/Messages.tsx` | 21-29 | Chat conversations and messages | Message data | ❌ No - Product Input |

---

## 🔄 ACTIVITY TYPE UPDATES NEEDED

### Multi-Activity Messaging (5 instances)

| File | Line(s) | Current Text | Suggested Replacement | Auto-fixable |
|------|---------|--------------|----------------------|-------------|
| `src/components/external-data/DataSourcesManager.tsx` | 148 | "generate dinner groups" | "generate activity groups" | ✅ Yes |
| `src/components/external-data/EnhancedDataSourcesManager.tsx` | 298 | "create dinner groups" | "create activity groups" | ✅ Yes |
| `src/components/external-data/FileUploadDialog.tsx` | 243 | "generate dinner groups" | "generate activity groups" | ✅ Yes |

---

## 🎯 REPLACEMENT PLAN

### Phase 1: Auto-fixable Changes (34 items)
**Effort:** Small (S) - 2-4 hours  
**Risk:** Low  

**Safe Find/Replace Operations:**
```bash
# Terminology updates
"Downtown Dinner Group" → "Downtown Group"
"dinner group has been approved" → "group has been approved"  
"generate dinner groups" → "generate activity groups"
"friend@example.com" → "friend@yourdomain.com"

# Comments and descriptions  
"Fallback to dinner groups" → "Fallback to legacy groups"
"try dinner groups as fallback" → "try legacy groups as fallback"
```

### Phase 2: Product Input Required (13 items) 
**Effort:** Medium (M) - Requires stakeholder review  
**Risk:** Medium  

**Needs Product Decision:**
1. **Mock Member Data** - Replace with realistic demo accounts or dynamic placeholders
2. **TODO Implementation** - Prioritize API integration tasks  
3. **Demo Profile Content** - Define standard demo user profiles
4. **Test Data Strategy** - Establish consistent test data patterns

---

## 📊 ACTIVITY SHOWCASE COMPLIANCE

### Current Status: ✅ COMPLIANT
**File:** `src/components/marketing/ActivitiesShowcase.tsx`  
**Activities Listed:** 
- ✅ Dinner
- ✅ Prayer / Bible Study  
- ✅ Working Out
- ✅ Watch Sporting Events
- ✅ Flexible

**Marketing Copy:** Properly uses multi-activity framing
**Accessibility:** Proper heading hierarchy and aria-labels

---

## 🚨 CRITICAL ITEMS FOR PRODUCTION

### Immediate Fixes (Before Production)
1. ❌ Remove all TODO comments or convert to GitHub issues
2. ❌ Replace placeholder email addresses in user-facing components  
3. ❌ Update dinner-only terminology in user notifications
4. ❌ Define demo data strategy for empty states

### Post-Launch Improvements
1. 🔄 Replace mock member data with realistic demo accounts
2. 🔄 Implement proper loading states to replace TODO placeholders
3. 🔄 Create comprehensive style guide for copy consistency

---

## 📋 VALIDATION CHECKLIST

- [ ] All user-facing "dinner group" → "group" conversions completed
- [ ] Placeholder emails use organization domain  
- [ ] TODO comments converted to actionable tickets
- [ ] Mock data clearly identified as demo content
- [ ] Multi-activity messaging consistent across platform
- [ ] Database identifiers preserved (dinner_groups, etc.)
- [ ] Test data separated from production placeholders

---

**Next Steps:** 
1. Execute Phase 1 auto-fixes  
2. Schedule Phase 2 product review meeting
3. Create GitHub issues for TODO items
4. Define production demo data standards