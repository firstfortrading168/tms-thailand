import { cn } from '@/lib/utils'

interface BadgeProps {
  label: string
  colorClass?: string
  size?: 'sm' | 'md'
}

export default function Badge({ label, colorClass = 'bg-gray-100 text-gray-700', size = 'md' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
      colorClass
    )}>
      {label}
    </span>
  )
}
