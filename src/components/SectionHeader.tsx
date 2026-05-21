import { Badge } from './Badge'

type Props = {
  badge?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeader({ badge, title, subtitle, className }: Props) {
  return (
    <div className={`text-center ${className ?? ''}`.trim()}>
      {badge && (
        <div className="mb-4">
          <Badge>{badge}</Badge>
        </div>
      )}
      <h2 className="text-3xl tablet:text-4xl desktop:text-5xl font-bold text-white mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-300 text-base tablet:text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
