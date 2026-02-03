'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useUser();
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text">
            Music24
          </h1>
          <p className="text-xl md:text-2xl text-gray-300">
            Where the Golden Era Lives On
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A community for true hip hop and R&B heads. If you grew up with the
            sounds of the 80s, 90s, and 00s, this is your digital home.
          </p>
        </div>

        {/* Era Tags */}
        <div className="flex flex-wrap justify-center gap-4">
          {['80s Classics', '90s Golden Era', '00s Bangers'].map((era) => (
            <span
              key={era}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-amber-600/80 rounded-full text-sm font-semibold"
            >
              {era}
            </span>
          ))}
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/forums"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors w-full sm:w-auto"
          >
            Explore Forums
          </Link>
          {!isSignedIn && (
            <Link
              href="/sign-up"
              className="px-8 py-3 border border-blue-600 hover:bg-blue-600/10 rounded-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Join the Lounge
            </Link>
          )}
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-12">
          <div className="forum-card text-left">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold mb-2">Old School Forums</h3>
            <p className="text-gray-400 text-sm">
              No algorithms, no likes. Just real conversations about the music we love.
            </p>
          </div>
          <div className="forum-card text-left">
            <div className="text-3xl mb-3">🎵</div>
            <h3 className="text-lg font-semibold mb-2">Era-Based Topics</h3>
            <p className="text-gray-400 text-sm">
              Dive deep into specific decades, artists, and the culture that defined them.
            </p>
          </div>
          <div className="forum-card text-left">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold mb-2">Real Community</h3>
            <p className="text-gray-400 text-sm">
              Connect with people who remember when hip hop and R&B ruled the airwaves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
