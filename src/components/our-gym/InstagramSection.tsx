
import React from "react";
import { Instagram, ArrowUpRight, Play } from "lucide-react";

const reels = [
  {
    id: 1,
    video: `${import.meta.env.BASE_URL}videos/reel-1.mp4`,
    instagramUrl: "https://www.instagram.com/reel/DPVhJB0Aa9H/",
  },
  {
    id: 2,
    video: `${import.meta.env.BASE_URL}videos/reel-2.mp4`,
    instagramUrl: "https://www.instagram.com/next_level_fitneses/",
  },
  {
    id: 3,
    video: `${import.meta.env.BASE_URL}videos/reel-3.mp4`,
    instagramUrl: "https://www.instagram.com/next_level_fitneses/",
  },
  {
    id: 4,
    video: `${import.meta.env.BASE_URL}videos/reel-4.mp4`,
    instagramUrl: "https://www.instagram.com/next_level_fitneses/",
  },
];

const PROFILE_URL =
  "https://www.instagram.com/next_level_fitneses/";

interface ReelCardProps {
  video: string;
  instagramUrl: string;
}

const ReelCard = ({ video, instagramUrl }: ReelCardProps) => {
  return (
    <div className="group relative aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl bg-zinc-900 shadow-xl">

      {/* Video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      {/* Dark Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/20" />

      {/* Instagram Badge */}
      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
        <Instagram size={15} />
        Instagram Reel
      </div>

      {/* Play Button */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 group-hover:scale-110">
          <Play
            size={22}
            fill="currentColor"
            className="ml-1"
          />
        </div>
      </div>

      {/* Bottom Text */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pb-4 pt-16">
        <div className="flex items-end justify-between gap-3 text-white">

          <div>
            <p className="text-sm font-semibold">
              Next Level Fitness
            </p>

            <p className="mt-1 text-xs text-white/70">
              Watch more on Instagram
            </p>
          </div>

          <ArrowUpRight size={20} />
        </div>
      </div>

      {/* Clickable Area */}
      <a
        href={instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-30"
        aria-label="Open Instagram Reel"
      />
    </div>
  );
};

export function InstagramSection() {
  return (
    <section
      id="instagram"
      className="relative overflow-hidden bg-black py-20"
    >
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Heading */}
        <div className="mb-12 text-center">

          <div className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
            <Instagram size={18} />
            Follow Our Journey
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            TRAIN. GRIND. REPEAT.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-white/50">
            Follow Next Level Fitness on Instagram for workouts,
            motivation and fitness inspiration.
          </p>

        </div>

        {/* Reel Cards */}
        <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {reels.map((reel) => (
            <ReelCard
              key={reel.id}
              video={reel.video}
              instagramUrl={reel.instagramUrl}
            />
          ))}

        </div>

        {/* Instagram Profile Button */}
        <div className="mt-12 text-center">

          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            <Instagram size={18} />

            @next_level_fitneses

            <ArrowUpRight size={17} />
          </a>

        </div>

      </div>
    </section>
  );
}

