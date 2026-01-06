import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import Image from 'next/image';
import { Music } from 'lucide-react';
import { FadeIn, Marquee } from '@/shared/components/magic-ui';
import { getActiveCollaborators, getActiveTeamMembers } from '@/features/admin/admin.query';
import { HeroTagline } from './hero-tagline';
import { MiniVinyl } from './mini-vinyl';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'landing' });
  const [collaborators, teamMembers] = await Promise.all([
    getActiveCollaborators(),
    getActiveTeamMembers(),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          ESTILO "VIBRANTE MODERNO" - Púrpura + Ondas de sonido + Dinámico
      ═══════════════════════════════════════════════════════════════════ */}

      {/* HERO - Layout asimétrico con vinilo a la derecha */}
      <section className="relative min-h-[100vh] flex items-center">
        {/* Fondo base oscuro */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* VINILO - Posicionado a la derecha, parcialmente visible */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Vinilo grande en el lado derecho - grupo para hover */}
          <div
            className="group/vinyl absolute top-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] xl:w-[1000px] xl:h-[1000px] cursor-default"
            style={{ right: '-15%' }}
          >

            {/* Ondas de sonido emanando del vinilo */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`wave-${i}`}
                className="absolute inset-0 rounded-full border border-purple-500/30"
                style={{
                  animation: `vinyl-wave 5s ease-out infinite`,
                  animationDelay: `${i * 1}s`,
                }}
              />
            ))}

            {/* Vinilo principal - Base negra sólida como un disco real */}
            <div
              className="absolute inset-[5%] rounded-full transition-shadow duration-700 group-hover/vinyl:shadow-[inset_0_0_100px_rgba(0,0,0,0.8),0_0_100px_rgba(168,85,247,0.5),0_0_180px_rgba(147,51,234,0.4)]"
              style={{
                background: '#111',
                boxShadow: `
                  inset 0 0 100px rgba(0,0,0,0.8),
                  0 0 60px rgba(168,85,247,0.25),
                  0 0 120px rgba(147,51,234,0.15)
                `,
                animation: 'vinyl-spin 20s linear infinite',
              }}
            >
              {/* Surcos del vinilo - círculos concéntricos visibles */}
              {[20, 28, 36, 44, 52, 60, 68, 76, 84, 90].map((size) => (
                <div
                  key={`groove-${size}`}
                  className="absolute rounded-full"
                  style={{
                    inset: `${(100 - size) / 2}%`,
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 0 2px rgba(168,85,247,0.15)',
                  }}
                />
              ))}

              {/* Brillo iridiscente animado - gira en sentido contrario al vinilo */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    conic-gradient(from 0deg,
                      transparent 0deg,
                      rgba(168,85,247,0.35) 15deg,
                      rgba(236,72,153,0.25) 40deg,
                      rgba(139,92,246,0.2) 65deg,
                      transparent 100deg,
                      transparent 180deg,
                      rgba(168,85,247,0.25) 195deg,
                      rgba(236,72,153,0.18) 220deg,
                      rgba(139,92,246,0.12) 250deg,
                      transparent 290deg,
                      transparent 360deg
                    )
                  `,
                  animation: 'iridescent-sweep 12s linear infinite',
                }}
              />
              {/* Segunda capa de brillo - más sutil, gira más lento */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    conic-gradient(from 120deg,
                      transparent 0deg,
                      rgba(236,72,153,0.15) 30deg,
                      rgba(168,85,247,0.1) 60deg,
                      transparent 90deg,
                      transparent 360deg
                    )
                  `,
                  animation: 'iridescent-sweep 18s linear infinite reverse',
                }}
              />
              {/* Brillo de barrido intenso - aparece en hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover/vinyl:opacity-100 transition-opacity duration-700"
                style={{
                  background: `
                    conic-gradient(from 0deg,
                      transparent 0deg,
                      rgba(168,85,247,0.5) 15deg,
                      rgba(236,72,153,0.4) 40deg,
                      rgba(139,92,246,0.35) 70deg,
                      transparent 110deg,
                      transparent 180deg,
                      rgba(168,85,247,0.4) 195deg,
                      rgba(236,72,153,0.3) 225deg,
                      transparent 270deg,
                      transparent 360deg
                    )
                  `,
                  animation: 'iridescent-sweep 6s linear infinite',
                }}
              />

              {/* Centro del vinilo - etiqueta colorida */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: '38%',
                  background: `
                    radial-gradient(circle at 30% 30%,
                      #fff 0%,
                      #e879f9 10%,
                      #a855f7 40%,
                      #7c3aed 70%,
                      #6d28d9 100%
                    )
                  `,
                  boxShadow: `
                    inset 0 0 20px rgba(0,0,0,0.3),
                    0 0 30px rgba(168,85,247,0.6),
                    0 0 60px rgba(236,72,153,0.4)
                  `,
                }}
              >
                {/* Agujero central del vinilo */}
                <div
                  className="absolute rounded-full bg-[#0a0a0a]"
                  style={{
                    inset: '42%',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.9)',
                  }}
                />
              </div>
            </div>

            {/* Reflejo de luz estático (no gira) */}
            <div
              className="absolute inset-[5%] rounded-full overflow-hidden pointer-events-none"
              style={{
                background: `
                  linear-gradient(135deg,
                    rgba(255,255,255,0.2) 0%,
                    rgba(255,255,255,0.08) 15%,
                    transparent 40%,
                    transparent 100%
                  )
                `,
              }}
            />
          </div>
        </div>

        {/* Estilos para animaciones del vinilo */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes vinyl-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes vinyl-wave {
            0% {
              transform: scale(0.9);
              opacity: 0.5;
            }
            100% {
              transform: scale(1.4);
              opacity: 0;
            }
          }
          @keyframes iridescent-sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes vinyl-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(0deg); }
            }
            @keyframes vinyl-wave {
              0%, 100% { transform: scale(1); opacity: 0.3; }
            }
            @keyframes iridescent-sweep {
              from { transform: rotate(0deg); }
              to { transform: rotate(0deg); }
            }
          }
        `}} />

        {/* Glow ambiental desde la derecha */}
        <div className="absolute top-1/2 right-0 translate-x-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-600/20 via-fuchsia-900/10 to-transparent blur-[100px]" />

        {/* Overlay para contraste del texto en móvil */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent md:via-[#0a0a0a]/80 md:to-transparent pointer-events-none" />

        {/* Contenido - Alineado a la izquierda */}
        <div className="container relative z-10 py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-purple-500/10 backdrop-blur-sm border border-purple-500/20 mb-10">
                {/* Mini ecualizador en el badge */}
                <div className="flex items-end gap-0.5 h-4">
                  {[0.4, 0.7, 1, 0.6, 0.8].map((h, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-purple-400 rounded-full animate-pulse"
                      style={{
                        height: `${h * 100}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-purple-300 text-sm font-medium">{t('hero.location')}</span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <HeroTagline />
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/40 mb-16 leading-relaxed max-w-2xl">
                {t('hero.description')}
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row items-start gap-6">
              <Button
                size="lg"
                className="group text-lg px-10 py-7 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] text-white font-semibold hover:bg-right shadow-2xl shadow-purple-600/30 transition-all duration-500"
                asChild
              >
                <Link href={`/${locale}/contacto`}>
                  {t('hero.ctaContact')}
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-lg px-10 py-7 rounded-full text-white/70 hover:text-white hover:bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all"
                asChild
              >
                <Link href={`/${locale}/eventos`}>
                  {t('hero.ctaEvents')}
                </Link>
              </Button>
            </div>
          </FadeIn>
          </div>
        </div>

      </section>

      {/* PRÓXIMO EVENTO */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-[#0a0a0a] to-purple-950/30" />

        <div className="container relative">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              {/* Indicador de "en vivo" */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium tracking-wider uppercase">
                  {t('nextEvent.badge')}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                {t('nextEvent.titleStart')}{' '}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                  {t('nextEvent.titleHighlight')}
                </span>
              </h2>
              <p className="text-xl text-white/40 mb-12 max-w-xl mx-auto">
                {t('nextEvent.description')}
              </p>

              <Button
                size="lg"
                className="rounded-full px-12 py-7 text-lg bg-white text-black font-semibold hover:bg-purple-100 transition-all shadow-2xl shadow-white/10"
                asChild
              >
                <Link href={`/${locale}/eventos`}>
                  {t('nextEvent.cta')}
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* NUESTRA ESENCIA - Minimalista con acentos */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="container max-w-5xl relative">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold">
                {t('mission.title')}{' '}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                  {t('mission.titleHighlight')}
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-12">
            {['connect', 'enrich', 'cultivate'].map((key, index) => (
              <FadeIn key={key} delay={0.1 + index * 0.15}>
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <MiniVinyl size="md" index={index} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    {t(`mission.${key}.title`)}
                  </h3>
                  <p className="text-white/40 leading-relaxed">
                    {t(`mission.${key}.description`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/10 via-transparent to-fuchsia-950/10" />

        <div className="container relative max-w-4xl">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">{t('values.title')}</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6">
            {['community', 'learning', 'fun', 'authenticity'].map((key, index) => (
              <FadeIn key={key} delay={0.1 + index * 0.1}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 transition-all">
                  <div className="flex items-start gap-4">
                    <MiniVinyl size="sm" index={index} />
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-white">
                        {t(`values.${key}.title`)}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed">
                        {t(`values.${key}.description`)}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* EL CORO */}
      {teamMembers.length > 0 && (
        <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
          {/* Surcos de vinilo como fondo decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-[0.02] pointer-events-none">
            {[15, 25, 35, 45, 55, 65, 75, 85, 95].map((size) => (
              <div
                key={`team-groove-${size}`}
                className="absolute rounded-full border border-white"
                style={{ inset: `${(100 - size) / 2}%` }}
              />
            ))}
          </div>

          <div className="container relative">
            <FadeIn>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('team.title')}</h2>
                <p className="text-xl text-white/40 max-w-2xl mx-auto">
                  {t('team.subtitle')}
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
      )}

      {/* COLABORADORES */}
      {collaborators.length > 0 && (
        <section className="py-20 border-y border-white/5 bg-[#0a0a0a]">
          <div className="container mb-12">
            <FadeIn>
              <div className="text-center">
                <p className="text-sm text-white/30 uppercase tracking-widest font-medium">
                  {t('collaborators.title')}
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}>
            <Marquee pauseOnHover className="[--duration:40s] [--gap:6rem]">
              {collaborators.map((collaborator) => (
                <a
                  key={collaborator.id}
                  href={collaborator.website_url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-8 opacity-30 hover:opacity-80 transition-opacity duration-300"
                >
                  {collaborator.logo_url && (
                    <Image
                      src={collaborator.logo_url}
                      alt={collaborator.name}
                      width={140}
                      height={50}
                      className="h-10 md:h-12 w-auto object-contain brightness-0 invert"
                    />
                  )}
                </a>
              ))}
            </Marquee>
          </FadeIn>
        </section>
      )}

      {/* SERVICIOS - Qué ofrecemos (antes del CTA) */}
      <section className="py-32 relative bg-[#0a0a0a]">
        <div className="container relative max-w-5xl">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                {t('features.title')}{' '}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                  {t('features.titleHighlight')}
                </span>
              </h2>
              <p className="text-xl text-white/40 max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </div>
          </FadeIn>

          {/* Cards con efecto de onda */}
          <div className="grid md:grid-cols-2 gap-6">
            {['concerts', 'weddings', 'events', 'celebrations'].map((key, index) => (
              <FadeIn key={key} delay={0.1 + index * 0.1}>
                <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 hover:border-purple-500/30 transition-all duration-500 overflow-hidden">
                  {/* Onda en hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  {/* Glow sutil */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="mb-6">
                      <MiniVinyl size="sm" index={index} />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {t(`features.${key}.title`)}
                    </h3>
                    <p className="text-white/40 leading-relaxed">
                      {t(`features.${key}.description`)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        {/* Glow de fondo sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-purple-600/15 to-transparent rounded-full blur-3xl" />

        {/* Partículas musicales sutiles - eco del hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { x: 10, y: 30, size: 5, delay: 0 },
            { x: 90, y: 25, size: 6, delay: 4 },
            { x: 20, y: 70, size: 4, delay: 8 },
            { x: 80, y: 65, size: 5, delay: 12 },
            { x: 50, y: 20, size: 7, delay: 2 },
            { x: 30, y: 80, size: 4, delay: 6 },
            { x: 70, y: 75, size: 5, delay: 10 },
            { x: 15, y: 50, size: 4, delay: 14 },
          ].map((particle, i) => (
            <div
              key={`cta-particle-${i}`}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: `radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(168,85,247,0.3) 40%, transparent 70%)`,
                boxShadow: `0 0 ${particle.size * 3}px rgba(168,85,247,0.5)`,
                animation: `particle-beat-ambient 16s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="container relative">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
                {t('cta.title')}{' '}
                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_auto]" style={{ WebkitBackgroundClip: 'text' }}>
                  {t('cta.titleHighlight')}
                </span>?
              </h2>
              <p className="text-xl text-white/40 mb-14 max-w-xl mx-auto">
                {t('cta.subtitle')}
              </p>

              <Button
                size="lg"
                className="text-lg px-14 py-8 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-purple-600 bg-[length:200%_auto] text-white font-semibold hover:bg-right shadow-2xl shadow-purple-600/30 transition-all duration-500"
                asChild
              >
                <Link href={`/${locale}/contacto`}>
                  {t('cta.button')}
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

    </main>
  );
}
