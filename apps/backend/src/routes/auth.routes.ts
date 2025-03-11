// backend/src/routes/auth.routes.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { register, login } from '../controllers/auth.controller';

const router = Router();

// 固定測試帳號
const TEST_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  password: 'demo1234', // 實際應用中應該加密儲存
  name: 'Demo User',
};

router.post('/register', register);
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // 檢查是否匹配測試帳號
  if (email === TEST_USER.email && password === TEST_USER.password) {
    // 生成 JWT
    const token = jwt.sign(
      { id: TEST_USER.id, email: TEST_USER.email },
      process.env.JWT_SECRET || 'your-development-secret-key',
      { expiresIn: '24h' },
    );

    return res.json({
      success: true,
      token,
      user: {
        id: TEST_USER.id,
        email: TEST_USER.email,
        name: TEST_USER.name,
      },
    });
  }

  // 如果不是測試帳號，則使用正常的登入流程
  return login(req, res);
});

export default router;
