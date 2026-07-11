import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  unit?: string
  icon: LucideIcon
  iconBg?: string
  iconColor?: string
  trend?: number
  trendLabel?: string
  subtitle?: string
  highlight?: boolean
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  trend,
  trendLabel,
  subtitle,
  highlight,
}: StatCardProps) {
  const trendIcon = trend === undefined ? null :
    trend > 0 ? <TrendingUp size={14} /> :
    trend < 0 ? <TrendingDown size={14} /> :
    <Minus size={14} />

  const trendColor = trend === undefined ? '' :
    trend > 0 ? 'text-green-600' :
    trend < 0 ? 'text-red-600' :
    'text-gray-500'

  return (
    <div className={cn(
      'bg-white rounded-xl border p-5 hover:shadow-md transition-shadow',
      highlight ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('p-2.5 rounded-xl', iconBg)}>
          <Icon size={20} className={iconColor} />
        </div>
        {trend !== undefined && (
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            {trendIcon}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        {trendLabel && <p className="text-xs text-gray-400 mt-1">{trendLabel}</p>}
      </div>
    </div>
  )
}
