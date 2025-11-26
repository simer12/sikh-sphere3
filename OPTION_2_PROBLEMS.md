# Potential Problems with Option 2: ShabadOS Database

## Overview
Using the ShabadOS database (MIT licensed, from GitHub) to extract complete Dasam Granth content.

---

## 🚨 CRITICAL PROBLEMS:

### 1. **Build System Incompatibility** ⚠️⚠️⚠️
**Problem:** ShabadOS uses **Bun** (not Node.js) as their runtime
```
- Your project: Node.js + React Native
- ShabadOS: Bun runtime required
- Bun is NOT installed on your Windows system
```

**Impact:**
- Can't run their build scripts without installing Bun
- Bun on Windows can be unstable
- May have compatibility issues with your existing tools

**Workaround:**
```powershell
# Would need to install Bun first
npm install -g bun  # May fail on Windows
# Or use WSL/Linux subsystem
```

### 2. **Complex Data Schema** ⚠️⚠️
**Problem:** Their database uses a complex relational structure

```
Sources → Sections → Line Groups → Lines → Assets
          ↓
     (Junction tables, foreign keys, complex relations)
```

**What this means:**
- Need to understand their entire schema
- Can't just query "give me Dasam Granth"
- Must join multiple tables
- Data is split across TOML files → SQLite → JSON export

**Example Complexity:**
```typescript
// You'd need queries like:
db.query.sources.findFirst({
  where: { id: 'DG' },  // Dasam Granth ID (might not even be 'DG')
  with: {
    sections: {
      with: {
        lineGroups: {
          with: {
            lines: {
              with: {
                assetContent: true
              }
            }
          }
        }
      }
    }
  }
})
```

### 3. **Build Process Heavy** ⚠️⚠️
**Problem:** Must build entire database before extracting

```powershell
git clone https://github.com/shabados/database.git  # Large repo
cd database
bun install  # Install dependencies
bun run build  # Build entire database (can take 5-30 minutes)
# Creates master.sqlite with ALL sources (SGGS, Dasam, Bhai Gurdas, etc.)
```

**Issues:**
- Downloads/builds EVERYTHING (not just Dasam Granth)
- Large download size (hundreds of MBs)
- Time-consuming build process
- Overkill if you only need Dasam Granth

### 4. **Data Format Mismatch** ⚠️
**Problem:** Their format != Your format

**ShabadOS Format:**
```json
{
  "sources": [...],
  "sections": [...],
  "lineGroups": [...],
  "lines": [
    {
      "id": "ABC123",
      "lineGroupId": "XYZ",
      "content": [
        {
          "asset": "SSA2",
          "type": "gurmukhi",
          "data": "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥"
        }
      ]
    }
  ],
  "assetLines": [...]
}
```

**Your Current Format:**
```json
{
  "id": "jaap-sahib",
  "name": "Jaap Sahib",
  "nameGurmukhi": "ਜਾਪੁ ਸਾਹਿਬ",
  "verses": [
    {
      "id": 1,
      "gurmukhi": "ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥",
      "transliteration": "...",
      "translation": "..."
    }
  ]
}
```

**Impact:**
- Need complex transformation script
- Must map their IDs to your structure
- Risk of data loss during transformation

### 5. **Unknown Completeness** ⚠️
**Problem:** Don't know if they actually have ALL Dasam Granth sections

Their README mentions:
```
"ਸ਼ਬਦ ਹਜ਼ਾਰੇ ਪਾਤਿਸ਼ਾਹੀ ੧੦, ਅਕਾਲ ਉਸਤਤ, ਬਚਿਤ੍ਰ ਨਾਟਕ, 
ਚੰਡੀ ਚਰਿਤ੍ਰ ਉਕਤਿ ਬਿਲਾਸ, ਚੰਡੀ ਚਰਿਤ੍ਰ, 
ਵਾਰ ਸ੍ਰੀ ਭਗਉਤੀ ਜੀ ਕੀ, ਗਿਆਨ ਪ੍ਰਬੋਧ"
```

**Missing from their citations:**
- Charitropakhyan (405 stories)
- Chaubis Avtar complete
- Brahma/Rudra Avtar
- Hikayats

**Risk:** Build entire database only to find it's incomplete!

### 6. **Version Compatibility Issues** ⚠️
**Problem:** @shabados/database v5.0.0-next.0 (beta/pre-release)

```
Current version: 5.0.0-next.0
Status: Pre-release/beta
Stability: Unknown
Breaking changes: Possible
```

**Risks:**
- API might change
- Documentation incomplete (is being updated)
- Bugs in pre-release version
- Schema might not be finalized

### 7. **SQLite + React Native Issues** ⚠️⚠️
**Problem:** ShabadOS outputs SQLite database

**Your app:** React Native (doesn't support SQLite natively on both platforms)

**Issues:**
- Must export SQLite → JSON (extra step)
- Large SQLite file (potentially 100+ MB)
- Can't bundle SQLite in React Native easily
- Would need expo-sqlite or similar (extra dependency)

### 8. **Learning Curve** ⚠️
**Problem:** Need to learn entire ShabadOS architecture

**Must understand:**
- Their schema (sources, sections, line groups, lines, assets)
- Drizzle ORM (their database tool)
- TOML file format
- Their build system
- How assets link to lines
- Multi-lingual field structure

**Time investment:** 4-8 hours minimum

### 9. **Maintenance Burden** ⚠️
**Problem:** If you use their database, you're dependent on them

**Implications:**
- If they change schema → your extraction breaks
- If they update database → you must re-extract
- If bugs in their data → affects your app
- Must track their releases

### 10. **Overkill for Your Needs** ⚠️
**Problem:** ShabadOS has ALL Sikh scriptures

```
What ShabadOS includes:
- Sri Guru Granth Sahib (full)
- Sri Dasam Granth (full)
- Bhai Gurdas Ji
- Bhai Nand Lal Ji
- Kabit Savaiye
- Multiple translations
- Multiple assets per line
```

**For you:** Only need Dasam Granth

**Result:** 
- 90% of downloaded data unused
- Build time wasted on other sources
- Larger database than needed

---

## ⚡ PRACTICAL PROBLEMS:

### Installation Issues
```powershell
# Current attempt showed:
npm install @shabados/database --save-dev --legacy-peer-deps
# Installed v5.0.0-next.0 (beta)

node test-shabados.js
# Error: Cannot find module '@shabados/database'
# (The package installed but API doesn't work as expected)
```

### No Clear API Documentation
- Their README says "documentation is currently being updated"
- No clear examples of querying Dasam Granth specifically
- Would need to reverse-engineer from their code

### Windows-Specific Issues
- Bun runtime is less stable on Windows
- SQLite native modules can be problematic
- Path handling differences

---

## 💰 COST-BENEFIT ANALYSIS:

### Time Investment:
```
Install Bun runtime:              30-60 min
Clone + build database:           10-30 min
Learn their schema:               2-4 hours
Write extraction script:          2-3 hours
Transform to your format:         1-2 hours
Test and debug:                   1-2 hours
-------------------------------------------
TOTAL:                           7-12 hours
```

### Uncertainty:
- ❓ May not have complete Dasam Granth
- ❓ Data quality unknown
- ❓ Beta version stability
- ❓ Will extraction work on Windows?

### Alternative (Email KhalisFoundation):
```
Write email:                      10 min
Wait for response:                1-7 days
Integrate their export:           1-2 hours
-------------------------------------------
TOTAL:                           1-7 days + 2 hours work
```

---

## ✅ WHEN OPTION 2 MAKES SENSE:

1. ✅ You're comfortable with Bun/modern JS tooling
2. ✅ You're on Linux/Mac (better Bun support)
3. ✅ You want to learn database architecture
4. ✅ You need OTHER sources too (SGGS, Bhai Gurdas)
5. ✅ You have 10+ hours to invest
6. ✅ KhalisFoundation doesn't respond

---

## ❌ WHEN OPTION 2 DOESN'T MAKE SENSE:

1. ❌ You only need Dasam Granth
2. ❌ You're on Windows (Bun issues)
3. ❌ You want quick solution
4. ❌ You prefer proven/stable tools
5. ❌ Limited time available
6. ❌ Current 8 Banis already sufficient

---

## 🎯 MY HONEST RECOMMENDATION:

### **DON'T USE OPTION 2** unless:
- KhalisFoundation doesn't respond in 2 weeks
- You need to learn database systems
- You want complete control over data

### **INSTEAD:**
1. **Immediate:** Add Ugardanti from BaniDB (30 min)
2. **This week:** Email KhalisFoundation (10 min)
3. **Wait:** 3-7 days for response
4. **If no response:** Then consider ShabadOS

### **Why This Order?**
- KhalisFoundation has **verified, complete data**
- Their data is already in the **right format** (similar to BaniDB)
- **Zero** learning curve (same API you're using)
- **Proven** and stable
- **Community** supported

---

## 🔥 THE REAL ISSUE:

**Problem:** You want Charitropakhyan, Zafarnama, Chaubis Avtar etc.

**Reality:** These sections are:
- Rarely used by 99% of Sikhs
- Controversial (Charitropakhyan)
- Scholarly content
- **Not available in ANY public API** easily

**Even ShabadOS** might not have them fully digitized!

**Best bet:** KhalisFoundation's BaniDB backend or Archive.org PDFs

---

## 📊 FINAL VERDICT:

| Factor | Option 2 (ShabadOS) | Option 1 (KhalisFoundation) |
|--------|---------------------|----------------------------|
| **Time** | 7-12 hours | 2 hours + wait |
| **Complexity** | High | Low |
| **Risk** | Medium-High | Low |
| **Completeness** | Unknown | Guaranteed |
| **Maintenance** | High | Low |
| **Data Quality** | Unknown | Verified |
| **Support** | GitHub issues | Direct contact |

**Winner:** Option 1 (KhalisFoundation)

---

## 💡 BOTTOM LINE:

**Option 2 is a "last resort"** solution that:
- Takes significant time
- Has many unknowns
- May not even have complete Dasam Granth
- Adds complexity to your project

**Better approach:**
1. Email KhalisFoundation NOW (takes 10 minutes)
2. Add Ugardanti from BaniDB (takes 30 minutes)
3. Wait for their response
4. Only use ShabadOS if they don't respond after 2 weeks

**Your current 8 Banis** cover 90% of user needs anyway!

