'use client';

import NavigatorWidget from '../components/NavigatorWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <NavigatorWidget />
      </div>
    </div>
  );
}
