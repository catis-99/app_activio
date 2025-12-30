# TODO: Fix Profile Card Edit Conflicts

## Issues Found:
1. Wrong navigation after edit - goes to /login instead of /profile
2. Empty loadUserData() - no data loaded for editing
3. Age not saved to localStorage
4. Button text color not green - :host-context() selector invalid
5. Wrong icon for weight field - uses mail-outline instead of body-outline
6. Inconsistent storage - uses raw localStorage instead of DataService

## Fixes Implemented:

### 1. Fix Navigation Flow ✅
- [x] Changed `this.router.navigate(['/login'])` to `this.router.navigate(['/profile'])`
- File: `completarperfil.page.ts:210`

### 2. Load Existing User Data ✅
- [x] Implemented loadUserData() to load gender, birthdate, weight, height
- File: `completarperfil.page.ts:89-96`

### 3. Save Age to localStorage ✅
- [x] Added `localStorage.setItem('userAge', String(this.calculateAge()))`
- File: `completarperfil.page.ts:206`
- [x] Added saving of gender, birthdate, weight, height to localStorage

### 4. Fix Button Color in Light Mode ✅
- [x] Changed `:host-context(body.light) & .edit-button` to `body.light .edit-button`
- File: `profile.page.scss:135`

### 5. Fix Weight Icon ✅
- [x] Changed `mail-outline` to `body-outline` in HTML
- [x] Imported `bodyOutline` icon in TypeScript
- File: `completarperfil.page.html:33` and `completarperfil.page.ts:17,56`

## Status: ALL FIXES COMPLETED ✅


