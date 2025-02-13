export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* 標題區塊 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todo App
          </h1>
          <p className="text-lg text-gray-600">
            Manage your tasks efficiently
          </p>
        </div>

        {/* 功能展示區 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 卡片 1 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Task Management
            </h2>
            <p className="text-gray-600">
              Create, organize, and track your tasks with ease
            </p>
          </div>

          {/* 卡片 2 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Progress Tracking
            </h2>
            <p className="text-gray-600">
              Monitor your progress and stay on top of deadlines
            </p>
          </div>

          {/* 卡片 3 */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Team Collaboration
            </h2>
            <p className="text-gray-600">
              Work together efficiently with team features
            </p>
          </div>
        </div>

        {/* 開始使用按鈕 */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}