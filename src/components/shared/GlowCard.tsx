import { type ReactNode, type ElementType } from 'react';
import clsx from 'clsx';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  color?: 'cyan' | 'purple' | 'green' | 'amber' | 'rose';
  hover?: boolean;
  onClick?: () => void;
  as?: ElementType;
}

const colorMap = {
  cyan: 'hover:border-cyan-500/40 hover:shadow-cyan-500/10',
  purple: 'hover:border-purple-500/40 hover:shadow-purple-500/10',
  green: 'hover:border-green-500/40 hover:shadow-green-500/10',
  amber: 'hover:border-amber-500/40 hover:shadow-amber-500/10',
  rose: 'hover:border-rose-500/40 hover:shadow-rose-500/10',
};

export function GlowCard({
  children,
  className,
  color = 'cyan',
  hover = true,
  onClick,
  as: Component = 'div',
}: GlowCardProps) {
  return (
    <Component
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-white/6 bg-[#111827]/80 backdrop-blur-sm transition-all duration-300',
        hover && [
          'hover:shadow-lg',
          colorMap[color],
        ],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </Component>
  );
}
