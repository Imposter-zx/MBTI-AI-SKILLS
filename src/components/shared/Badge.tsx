import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'cyan' | 'purple' | 'green' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
  className?: string;
}

const colorMap = {
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  green: 'bg-green-500/10 text-green-400 border-green-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function Badge({ children, color = 'cyan', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
