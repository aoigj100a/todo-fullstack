export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="rounded-xl bg-white p-8 shadow-2xl">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">Tailwind Test</h1>
        <p className="text-gray-600">If you can see this styled, Tailwind is working!</p>
        <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Click me
        </button>
      </div>
    </div>
  );
}