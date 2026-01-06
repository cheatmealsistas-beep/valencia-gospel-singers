'use client';

import { useTranslations } from 'next-intl';
import { Music } from 'lucide-react';
import { FadeIn } from '@/shared/components/magic-ui';
import type { TeamMember } from '@/features/admin/types';

interface AboutTeamProps {
  teamMembers: TeamMember[];
}

export function AboutTeam({ teamMembers }: AboutTeamProps) {
  const t = useTranslations('about.team');

  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-fuchsia-600/5 rounded-full blur-3xl translate-x-1/2" />

      {/* Surcos de vinilo como fondo decorativo */}
      <div className="absolute inset-0 opacity-[0.02]">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white"
            style={{
              width: `${(i + 1) * 10}%`,
              height: `${(i + 1) * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative">
        <FadeIn>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm font-semibold mb-6 tracking-wide uppercase border border-purple-500/20">
              {t('label')}
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              {t('title')}
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              {t('description')}
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <FadeIn key={member.id} delay={index * 0.05}>
              <div className="group flex flex-col items-center text-center">
                {/* Contenedor del vinilo */}
                <div className="relative w-36 h-36 md:w-44 md:h-44 mx-auto mb-4">
                  {/* Vinilo giratorio en hover */}
                  <div
                    className="absolute inset-0 rounded-full transition-transform duration-1000 group-hover:rotate-[360deg]"
                    style={{
                      background: '#111',
                      boxShadow: `
                        inset 0 0 30px rgba(0,0,0,0.8),
                        0 0 20px rgba(168,85,247,0.2),
                        0 0 40px rgba(147,51,234,0.15)
                      `,
                    }}
                  >
                    {/* Surcos del vinilo - círculos concéntricos */}
                    {[60, 70, 80, 90].map((size) => (
                      <div
                        key={`groove-${size}`}
                        className="absolute rounded-full"
                        style={{
                          inset: `${(100 - size) / 2}%`,
                          border: '1px solid rgba(255,255,255,0.06)',
                          boxShadow: 'inset 0 0 1px rgba(168,85,247,0.1)',
                        }}
                      />
                    ))}

                    {/* Brillo iridiscente */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `
                          conic-gradient(from 0deg,
                            transparent 0deg,
                            rgba(168,85,247,0.2) 30deg,
                            rgba(236,72,153,0.15) 60deg,
                            transparent 90deg,
                            transparent 180deg,
                            rgba(139,92,246,0.15) 210deg,
                            rgba(168,85,247,0.12) 240deg,
                            transparent 270deg,
                            transparent 360deg
                          )
                        `,
                      }}
                    />
                  </div>

                  {/* Centro del vinilo - Foto en B/W */}
                  <div
                    className="absolute rounded-full overflow-hidden"
                    style={{
                      inset: '22%',
                      boxShadow: `
                        inset 0 0 10px rgba(0,0,0,0.5),
                        0 0 15px rgba(168,85,247,0.4),
                        0 0 30px rgba(236,72,153,0.2)
                      `,
                    }}
                  >
                    {member.photo_url ? (
                      <div className="relative w-full h-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:scale-110 transition-all duration-500"
                        />
                        {/* Overlay púrpura en hover */}
                        <div className="absolute inset-0 bg-purple-500/30 opacity-0 group-hover:opacity-100 mix-blend-color transition-opacity duration-500" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: `
                            radial-gradient(circle at 30% 30%,
                              #e879f9 0%,
                              #a855f7 40%,
                              #7c3aed 70%,
                              #6d28d9 100%
                            )
                          `,
                        }}
                      >
                        <Music className="w-6 h-6 text-white/70" />
                      </div>
                    )}

                    {/* Borde con degradado */}
                    <div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        border: '2px solid transparent',
                        background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3)) border-box',
                        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                    />
                  </div>

                </div>

                <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors">
                  {member.name.split(' ').slice(0, 2).join(' ')}
                </h3>
                <p className="text-xs text-white/40 mt-1">{member.role}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
