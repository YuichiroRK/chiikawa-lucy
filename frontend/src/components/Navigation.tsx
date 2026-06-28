// ═══════════════════════════════════════════════
// 🧭 CHIIKAWA TAMAGOTCHI - Navigation
// Barra de navegación inferior (móvil) / lateral
// ═══════════════════════════════════════════════

import Link from 'next/link';
import { useRouter } from 'next/router';
import { NAV_ITEMS } from '@/utils/gameData';

interface NavigationProps {
  newContentCount?: Record<string, number>;
}

export default function Navigation({ newContentCount = {} }: NavigationProps) {
  const router = useRouter();

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 glass-nav md:hidden nav-height"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="flex items-center justify-around h-full px-2 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              router.pathname === item.href ||
              (item.href !== '/' && router.pathname.startsWith(item.href));
            const badgeCount = newContentCount[item.id] || 0;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`
                  relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl
                  transition-all duration-300
                  ${
                    isActive
                      ? 'text-deep-pink scale-110'
                      : 'text-text-soft hover:text-kawaii-pink'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--color-kawaii-pink), var(--color-deep-pink))',
                    }}
                  />
                )}

                {/* Icon */}
                <span className={`text-xl ${isActive ? 'animate-bounce-soft' : ''}`}>
                  {item.icon}
                </span>

                {/* Label */}
                <span
                  className="text-[10px] font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.label}
                </span>

                {/* Badge */}
                {badgeCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] text-white font-bold flex items-center justify-center animate-pulse"
                    style={{ background: 'var(--color-deep-pink)' }}
                  >
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Side Nav */}
      <nav
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 w-20 flex-col items-center py-8 gap-4 glass-nav"
        style={{ borderTop: 'none', borderRight: '1px solid rgba(255,255,255,0.6)' }}
        role="navigation"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <div className="mb-4 text-2xl animate-float">🌸</div>

        {NAV_ITEMS.map((item) => {
          const isActive =
            router.pathname === item.href ||
            (item.href !== '/' && router.pathname.startsWith(item.href));
          const badgeCount = newContentCount[item.id] || 0;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                relative flex flex-col items-center gap-1 p-2 rounded-xl
                transition-all duration-300 w-16
                ${
                  isActive
                    ? 'text-deep-pink bg-white/40 shadow-kawaii'
                    : 'text-text-soft hover:text-kawaii-pink hover:bg-white/20'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
              title={item.label}
            >
              <span className={`text-xl ${isActive ? 'animate-bounce-soft' : ''}`}>
                {item.icon}
              </span>
              <span
                className="text-[9px] font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.label}
              </span>

              {badgeCount > 0 && (
                <span
                  className="absolute top-0 right-1 w-4 h-4 rounded-full text-[9px] text-white font-bold flex items-center justify-center animate-pulse"
                  style={{ background: 'var(--color-deep-pink)' }}
                >
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
