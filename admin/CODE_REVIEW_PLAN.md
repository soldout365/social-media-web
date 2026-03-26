# Code Review Fix Plan - Admin Dashboard

## Tổng quan

Dựa trên kết quả code review, có **22 vấn đề** cần được giải quyết, được chia thành các mức độ ưu tiên:

| Mức độ            | Số lượng |
| ----------------- | -------- |
| 🔴 Cao (Security) | 3        |
| 🟠 Trung bình     | 8        |
| 🟡 Thấp           | 6        |
| 🔵 Cải thiện      | 5        |

---

## 🔴 Phase 1: Security Fixes ( Cao )

### 1.1 Thêm Environment Variables cho API URL

**Files:** `src/lib/axios.ts`

```
# Tạo .env.example
VITE_API_URL=http://localhost:3000/api
```

```typescript
// src/lib/axios.ts
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
```

### 1.2 Thêm Axios Interceptors cho Error Handling

**Files:** `src/lib/axios.ts`

- Thêm request interceptor để attach CSRF token
- Thêm response interceptor để handle 401 (token expired)

### 1.3 Implement proper logout với API call

**Files:** `src/apis/user.api.ts`, `src/components/Navbar.tsx`

---

## 🟠 Phase 2: Code Quality Fixes

### 2.1 Fix Unused Import

**Files:** `src/pages/home/product/components/ArchiveOSHeader.tsx:1`

```diff
- import { motion } from "framer-motion";
```

### 2.2 Xóa các eslint-disable directives không cần thiết

**Files:**

- `src/pages/home/dashboard/Dashboard.tsx` (lines 32, 34, 42)
- `src/pages/home/dashboard/components/ActivityStream.tsx` (line 90)
- `src/pages/home/dashboard/components/Inventory.tsx` (line 13)
- `src/pages/home/dashboard/components/theme.ts` (line 3)

### 2.3 Fix hardcoded fallback name trong Navbar

**Files:** `src/components/Navbar.tsx:139`

```diff
- {displayName || "Nguyễn Dũng"}
+ {displayName || "Admin"}
```

### 2.4 Fix magic number trong ProtectedRoute

**Files:** `src/components/auth/ProtectedRoute.tsx:9`

Thay thế 50ms timeout bằng cách check localStorage ngay lập tức

### 2.5 Add Error Boundary cho App

**Files:** `src/App.tsx`

Tạo Error Boundary component để catch React rendering errors

### 2.6 Add Toast Notifications thay vì console.error

**Files:** All mutation hooks

Thêm error handling với toast notifications cho user

### 2.7 Fix ProtectedRoute auth logic

**Files:** `src/components/auth/ProtectedRoute.tsx`

Loại bỏ artificial delay, check auth ngay lập tức

### 2.8 Thêm loading spinner toàn app

**Files:** `src/App.tsx`

Global loading indicator cho initial auth check

---

## 🟡 Phase 3: TypeScript Fixes

### 3.1 Fix typo `visiable` → `visible`

**Files:**

- `src/types/common.type.ts:41` (ImageType)
- `src/types/common.type.ts:52` (TModal)

```diff
- visiable: boolean
+ visible: boolean
```

### 3.2 Fix inconsistent types `hasPrevPage` / `hasNextPage`

**Files:** `src/types/common.type.ts:11-12`

```diff
- hasPrevPage: number | boolean
- hasNextPage: number | boolean
+ hasPrevPage: boolean
+ hasNextPage: boolean
```

---

## 🔵 Phase 4: Improvements (Optional)

### 4.1 Add React Query staleTime config

**Files:** `src/main.tsx`

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});
```

### 4.2 Thêm form validation

**Files:** Form components (ProductPageDrawer, etc.)

Sử dụng React Hook Form hoặc Zod validation

### 4.3 Add rate limiting UI cho login

**Files:** `src/pages/auth/Login.tsx`

Hiển thị countdown khi login thất bại nhiều lần

### 4.4 Thêm skeleton loading states

**Files:** Table components

Thay loading spinner bằng skeleton UI

### 4.5 Tối ưu re-renders trong Navbar

**Files:** `src/components/Navbar.tsx`

Loại bỏ forceUpdate không cần thiết

---

## Execution Order

```
Phase 1 (Security)
  ├── 1.1 Environment Variables
  ├── 1.2 Axios Interceptors
  └── 1.3 Proper Logout

Phase 2 (Code Quality)
  ├── 2.1 Fix unused import
  ├── 2.2 Remove unused eslint-disable
  ├── 2.3 Fix hardcoded name
  ├── 2.4 Fix magic number
  ├── 2.5 Add Error Boundary
  ├── 2.6 Add Toast Notifications
  ├── 2.7 Fix ProtectedRoute
  └── 2.8 Global Loading

Phase 3 (TypeScript)
  ├── 3.1 Fix visiable typo
  └── 3.2 Fix hasPrev/NextPage types

Phase 4 (Improvements)
  ├── 4.1 React Query staleTime
  ├── 4.2 Form validation
  ├── 4.3 Rate limiting UI
  ├── 4.4 Skeleton loading
  └── 4.5 Optimize Navbar
```

---

## Notes

- **Backup** trước khi thay đổi
- **Test** các functionality sau mỗi phase
- **Priority**: Security fixes → Code Quality → TypeScript → Improvements
