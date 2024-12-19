'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Crimson_Pro, Lora } from 'next/font/google';
import { motion } from 'framer-motion';

const crimson = Crimson_Pro({
  subsets: ['latin'],
  weight: ['400', '800'],
});

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600'],
});

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/home.jpeg"
        alt="Peaceful journaling scene"
        fill
        priority
        className="object-cover object-center brightness-[0.85] transform scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      <div className="absolute inset-0 flex flex-col items-center justify-start pt-60 sm:pt-32 md:pt-52 gap-10 sm:gap-8 px-6 sm:px-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="space-y-4 text-center w-full max-w-[95%] sm:max-w-full"
        >
          <h1
            className={`text-6xl sm:text-7xl md:text-8xl ${crimson.className} text-white font-bold`}
          >
            Memento
          </h1>
          <p
            className={`text-2xl sm:text-3xl md:text-4xl ${lora.className} text-stone-100 font-light drop-shadow-lg`}
          >
            Mindful journaling with AI
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.4, 0, 0.2, 1], // Use cubic bezier for smoother motion
            delay: 0.2,
          }}
          whileHover={{
            backgroundColor: 'rgba(120, 53, 15, 0.3)',
            transition: { duration: 0.1 },
          }}
          onClick={() => router.push('/home')}
          className={`
            px-8 sm:px-10 md:px-10 
            py-4 sm:py-4
            bg-amber-900/20
            border border-stone-200/30
            text-stone-100
            rounded-lg
            text-md sm:text-md
            font-medium
            tracking-wide
            backdrop-blur-sm
            w-fit
            ${lora.className}
          `}
        >
          Start Writing
        </motion.button>
      </div>
    </div>
  );
}
