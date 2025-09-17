import { useState } from 'react';

const fiveCsData = [
  {
    id: 'commitment',
    title: 'Commitment',
    description: 'We commit to showing up and being present.',
    icon: (
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Shield background */}
          <path
            d="M32 8L20 14v12c0 7.5 5.5 14.5 12 16 6.5-1.5 12-8.5 12-16V14L32 8z"
            fill="currentColor"
            className="text-primary"
          />
          {/* Heart in center */}
          <path
            d="M32 36c-1.5-1.5-4-4-4-6.5 0-1.5 1-2.5 2.5-2.5s2 1 2.5 1.5c.5-.5 1-1.5 2.5-1.5s2.5 1 2.5 2.5c0 2.5-2.5 5-6 6.5z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    )
  },
  {
    id: 'communication',
    title: 'Communication',
    description: 'We practice open, honest, and caring dialogue.',
    icon: (
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* First speech bubble - outlined */}
          <path
            d="M18 32c0-6 5-11 11-11h8c6 0 11 5 11 11s-5 11-11 11h-4l-6 4v-4c-5-1-9-5-9-11z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-primary"
          />
          {/* Second speech bubble - filled */}
          <path
            d="M16 24c0-6 5-11 11-11h8c6 0 11 5 11 11s-5 11-11 11h-4l-6 4v-4c-5-1-9-5-9-11z"
            fill="currentColor"
            className="text-accent"
          />
        </svg>
      </div>
    )
  },
  {
    id: 'connection',
    title: 'Connection',
    description: 'We build real bonds that go deeper than surface.',
    icon: (
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Chain links */}
          <circle cx="24" cy="24" r="8" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary" />
          <circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" strokeWidth="4" className="text-accent" />
          {/* Connecting link */}
          <path
            d="M30 30l8 8"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary"
          />
        </svg>
      </div>
    )
  },
  {
    id: 'crisis',
    title: 'Crisis',
    description: 'We step in and support each other when life gets hard.',
    icon: (
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Lifebuoy ring */}
          <circle 
            cx="32" 
            cy="32" 
            r="20" 
            fill="currentColor" 
            className="text-primary"
          />
          <circle 
            cx="32" 
            cy="32" 
            r="12" 
            fill="currentColor" 
            className="text-background"
          />
          {/* Cross pattern */}
          <rect x="30" y="16" width="4" height="32" fill="currentColor" className="text-accent" />
          <rect x="16" y="30" width="32" height="4" fill="currentColor" className="text-accent" />
        </svg>
      </div>
    )
  },
  {
    id: 'celebration',
    title: 'Celebration',
    description: 'We honor milestones, wins, and everyday joys.',
    icon: (
      <div className="relative w-16 h-16">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Central spark */}
          <circle cx="32" cy="32" r="4" fill="currentColor" className="text-primary" />
          {/* Radiating rays */}
          <path d="M32 8v12M32 44v12M8 32h12M44 32h12M14.1 14.1l8.5 8.5M41.4 41.4l8.5 8.5M14.1 49.9l8.5-8.5M41.4 22.6l8.5-8.5" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round" 
                className="text-accent" 
          />
        </svg>
      </div>
    )
  }
];

export function FiveCsSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The 5Cs of Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proven framework for building lasting relationships and belonging through mutual care and commitment.
          </p>
        </div>

        {/* 5Cs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {fiveCsData.map((item, index) => (
            <div
              key={item.id}
              className={`group relative bg-card border border-border rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                hoveredCard === item.id ? 'shadow-2xl' : 'shadow-soft'
              }`}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className={`mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center transition-all duration-300 ${
                  hoveredCard === item.id ? 'shadow-lg scale-110' : ''
                }`}>
                  <div className={`transition-all duration-300 ${
                    hoveredCard === item.id 
                      ? 'animate-pulse' 
                      : ''
                  }`}>
                    {item.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                hoveredCard === item.id 
                  ? 'bg-gradient-to-r from-accent/20 to-primary/20' 
                  : ''
              }`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">
            Experience the power of the 5Cs in your own community group
          </p>
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Join a Group Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}