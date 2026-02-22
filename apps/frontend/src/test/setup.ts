import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { vi, afterEach } from 'vitest';

// singleThread: true 模式下 @testing-library/react 的 cleanup 不會自動跨檔案執行，需要手動註冊
afterEach(cleanup);

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:5001/api';
