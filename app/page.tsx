'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Crimson_Pro, Lora } from 'next/font/google';

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '700'], // Changed to include 700 weight
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['500', '600'], // Changed to include heavier weights
});

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/landing.jpeg"
        alt="Peaceful journaling scene"
        fill
        priority
        className="object-cover object-center brightness-[0.85] transform scale-105" // Lightened the image
      />

      {/* Lighter gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Content wrapper remains the same */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-20 p-8 md:p-12">
        {/* Text content remains the same */}
        <div className="space-y-4 text-center">
          <h1
            className={`text-5xl md:text-7xl ${crimson.className} text-white tracking-wide font-bold drop-shadow-lg`}
          >
            Memento
          </h1>
          <p
            className={`text-2xl md:text-4xl ${lora.className} text-stone-100 font-medium drop-shadow-lg`}
          >
            Mindful journaling with AI
          </p>
        </div>

        {/* Updated translucent button */}
        <button
          onClick={() => router.push('/home')}
          className={`
            px-8 md:px-12 py-4
            bg-white/80 backdrop-blur-sm
            text-gray-900 
            rounded-full 
            transition-all
            hover:scale-105 
            duration-300 
            text-lg md:text-xl
            font-semibold
            tracking-wide 
            ${lora.className}
          `}
        >
          Start Writing
        </button>
      </div>
    </div>
  );
}
