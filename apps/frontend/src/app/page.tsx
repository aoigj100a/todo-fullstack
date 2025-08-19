// apps/frontend/src/app/page.tsx
'use client';

import { CheckCircle, Clock, List, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        {/* 語言切換器 */}
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              <span className="text-teal-600">{t('todos.title')}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">{t('hero.subtitle')}</p>

            <div className="flex gap-4 pt-4">
              <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
                <Link href="/login">{t('login.button')}</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/register">{t('button.createAccount')}</Link>
              </Button>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="relative overflow-hidden rounded-lg bg-gray-50 p-6">
                {/* Stylized Todo List UI Example */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Complete homepage design</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Clock className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Implement user authentication</span>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center text-white">
                      <List className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Design dashboard UI components</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            {t('features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-teal-100 text-teal-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.taskManagement')}</h3>
              <p className="text-gray-600">{t('features.taskManagement.desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.progressTracking')}</h3>
              <p className="text-gray-600">{t('features.progressTracking.desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="bg-purple-100 text-purple-700 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <List className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('features.multipleViews')}</h3>
              <p className="text-gray-600">{t('features.multipleViews.desc')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>{t('footer.copyright')}</p>
        </footer>
      </div>
    </main>
  );
}
