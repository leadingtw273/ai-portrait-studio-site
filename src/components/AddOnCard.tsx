import { cn } from '@/lib/cn'

type Props = {
  name: string
  desc: string
  price: number
  unit: string
  priceLabel?: string
  className?: string
}

export function AddOnCard({ name, desc, price, unit, priceLabel = 'NT$', className }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5 border border-border-subtle bg-surface',
        className,
      )}
    >
      <div className="text-white text-lg font-medium mb-1">{name}</div>
      <div className="text-gray-400 text-sm mb-3">{desc}</div>
      <div className="text-brand-300 text-2xl font-bold">
        {priceLabel} {price.toLocaleString()}{' '}
        <span className="text-gray-500 text-base font-normal">{unit}</span>
      </div>
    </div>
  )
}
