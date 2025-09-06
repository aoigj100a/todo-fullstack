// src/app/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Lock, Save, ArrowLeft, Loader2, UserCog, LogOut, AlertTriangle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    email: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 更新表單初始值
  useEffect(() => {
    if (user) {
      setAccountFormData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // 處理未登入情況
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">未登入</CardTitle>
            <CardDescription>請先登入以訪問此頁面</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push('/login')}>前往登入</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 模擬 API 調用，實際應用需改為 API 請求
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新用戶資料
      updateUser({
        name: accountFormData.name,
        email: accountFormData.email,
      });

      toast({
        title: '個人資料已更新',
        description: '您的個人資料已成功更新。',
      });
    } catch (_) {
      toast({
        variant: 'destructive',
        title: '更新失敗',
        description: '無法更新個人資料，請稍後再試。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 密碼驗證
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      toast({
        variant: 'destructive',
        title: '密碼不匹配',
        description: '新密碼和確認密碼不匹配。',
      });
      return;
    }

    if (passwordFormData.newPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: '密碼太短',
        description: '密碼必須至少包含 6 個字符。',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 模擬 API 調用，實際應用需改為 API 請求
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: '密碼已更新',
        description: '您的密碼已成功更改。',
      });

      // 清空密碼表單
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (_) {
      toast({
        variant: 'destructive',
        title: '更新失敗',
        description: '密碼更新失敗，請確認您的當前密碼是否正確。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    setIsLoading(true);

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: '帳號已刪除',
        description: '您的帳號已成功刪除，正在登出...',
      });

      // 登出並重定向
      setTimeout(() => {
        logout();
        router.push('/');
      }, 2000);
    } catch (_) {
      toast({
        variant: 'destructive',
        title: '刪除失敗',
        description: '無法刪除帳號，請稍後再試。',
      });
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center flex-wrap">
        <Button asChild variant="ghost" className="mr-4">
          <Link href="/todos">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Link>
        </Button>
        <h1 className="text-2xl font-bold flex items-center flex-wrap">
          <UserCog className="mr-2 h-6 w-6 text-teal-500 flex-shrink-0" />
          用戶設定
        </h1>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="w-full grid grid-cols-2 h-12 bg-muted rounded-lg">
          <TabsTrigger
            value="account"
            className="text-base py-2 px-2 rounded-md text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground transition-all"
          >
            個人資料
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="text-base py-2 px-2 rounded-md text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground transition-all"
          >
            安全設定
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl flex items-center flex-wrap">
                <User className="mr-2 h-5 w-5 text-teal-500" />
                個人資料
              </CardTitle>
              <CardDescription>更新您的個人資料與聯絡資訊</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-base">
                    用戶名稱
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={accountFormData.name}
                    onChange={e => setAccountFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="輸入您的名稱"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base">
                    電子郵件
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountFormData.email}
                    onChange={e => setAccountFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="輸入您的電子郵件"
                    className="h-12 text-base"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 text-base bg-teal-500 hover:bg-teal-600 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                      儲存中...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      儲存變更
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6 max-w-none">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-teal-500" />
                  變更密碼
                </CardTitle>
                <CardDescription>更新您的密碼以保護帳號安全</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-base">
                      目前密碼
                    </Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordFormData.currentPassword}
                      onChange={e =>
                        setPasswordFormData(prev => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="輸入您的目前密碼"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-base">
                      新密碼
                    </Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordFormData.newPassword}
                      onChange={e =>
                        setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))
                      }
                      placeholder="輸入新密碼"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-base">
                      確認新密碼
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordFormData.confirmPassword}
                      onChange={e =>
                        setPasswordFormData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      placeholder="確認您的新密碼"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 text-base bg-teal-500 hover:bg-teal-600 mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                        更新中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        更新密碼
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="shadow-md border-red-100">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-600 flex-shrink-0" />
                  <span className="break-words">危險操作區域</span>
                </CardTitle>
                <CardDescription className="break-words">
                  此區域的操作可能會導致不可挽回的資料丟失
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showDeleteConfirm ? (
                  <div className="space-y-4">
                    <p className="text-base text-gray-600">
                      刪除帳號將永久移除您的所有資料，此操作無法撤銷。
                    </p>
                    <Button
                      variant="destructive"
                      className="h-12 text-base"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      刪除我的帳號
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="text-lg font-semibold text-red-700">確認刪除</h3>
                    <p className="text-base text-gray-700">
                      您確定要永久刪除您的帳號嗎？所有資料將會丟失且無法恢復。
                    </p>
                    <div className="flex gap-4 mt-4">
                      <Button
                        variant="outline"
                        className="h-12 text-base"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        取消
                      </Button>
                      <Button
                        variant="destructive"
                        className="h-12 text-base"
                        onClick={handleAccountDelete}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-teal-500" />
                            處理中...
                          </>
                        ) : (
                          '確認刪除帳號'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <LogOut className="mr-2 h-5 w-5 text-teal-500" />
                  登出
                </CardTitle>
                <CardDescription>登出您的帳號並結束此次會話</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-base text-gray-600 mb-4">
                  點擊下方按鈕登出您的帳號，您將需要重新登入才能再次訪問系統。
                </p>
                <Button
                  className="h-12 text-base bg-gray-200 text-gray-800 hover:bg-gray-300"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  登出帳號
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
