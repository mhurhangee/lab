'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { cn } from '@/lib/utils'

import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

export interface EntityAttribute {
  id: string
  label: string
  value: string | number
  icon?: IconName
  className?: string
  formatter?: (value: string | number) => string
}

export interface EntityBadge {
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export interface EntityTag {
  label: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
}

export interface EntityCardProps {
  // Core entity info
  title: string
  description?: string
  icon?: IconName
  iconClassName?: string

  // Attributes (can be any number)
  attributes: EntityAttribute[]

  // Optional elements
  badges?: EntityBadge[]
  tags?: EntityTag[]
  actionButtons?: React.ReactNode

  // Layout options
  attributesPerRow?: {
    mobile?: number
    tablet?: number
    desktop?: number
    large?: number
  }

  // Styling
  className?: string
  headerClassName?: string
  contentClassName?: string

  // Interactions
  onClick?: () => void
}

const defaultAttributesPerRow = {
  mobile: 2,
  tablet: 3,
  desktop: 4,
  large: 6,
}

export function EntityCard({
  title,
  description,
  icon,
  iconClassName,
  attributes,
  badges = [],
  tags = [],
  attributesPerRow = defaultAttributesPerRow,
  className,
  headerClassName,
  contentClassName,
  onClick,
  actionButtons,
}: EntityCardProps) {
  const gridCols = {
    mobile: attributesPerRow.mobile || defaultAttributesPerRow.mobile,
    tablet: attributesPerRow.tablet || defaultAttributesPerRow.tablet,
    desktop: attributesPerRow.desktop || defaultAttributesPerRow.desktop,
    large: attributesPerRow.large || defaultAttributesPerRow.large,
  }

  const getGridClassName = () => {
    const gridColsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10',
      11: 'grid-cols-11',
      12: 'grid-cols-12',
    }

    const smGridColsMap = {
      1: 'sm:grid-cols-1',
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-3',
      4: 'sm:grid-cols-4',
      5: 'sm:grid-cols-5',
      6: 'sm:grid-cols-6',
      7: 'sm:grid-cols-7',
      8: 'sm:grid-cols-8',
      9: 'sm:grid-cols-9',
      10: 'sm:grid-cols-10',
      11: 'sm:grid-cols-11',
      12: 'sm:grid-cols-12',
    }

    const lgGridColsMap = {
      1: 'lg:grid-cols-1',
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
      5: 'lg:grid-cols-5',
      6: 'lg:grid-cols-6',
      7: 'lg:grid-cols-7',
      8: 'lg:grid-cols-8',
      9: 'lg:grid-cols-9',
      10: 'lg:grid-cols-10',
      11: 'lg:grid-cols-11',
      12: 'lg:grid-cols-12',
    }

    const xlGridColsMap = {
      1: 'xl:grid-cols-1',
      2: 'xl:grid-cols-2',
      3: 'xl:grid-cols-3',
      4: 'xl:grid-cols-4',
      5: 'xl:grid-cols-5',
      6: 'xl:grid-cols-6',
      7: 'xl:grid-cols-7',
      8: 'xl:grid-cols-8',
      9: 'xl:grid-cols-9',
      10: 'xl:grid-cols-10',
      11: 'xl:grid-cols-11',
      12: 'xl:grid-cols-12',
    }

    const baseClass = 'grid gap-4'
    const mobileClass = gridColsMap[gridCols.mobile as keyof typeof gridColsMap] || 'grid-cols-2'
    const tabletClass =
      smGridColsMap[gridCols.tablet as keyof typeof smGridColsMap] || 'sm:grid-cols-3'
    const desktopClass =
      lgGridColsMap[gridCols.desktop as keyof typeof lgGridColsMap] || 'lg:grid-cols-4'
    const largeClass =
      xlGridColsMap[gridCols.large as keyof typeof xlGridColsMap] || 'xl:grid-cols-6'

    return cn(baseClass, mobileClass, tabletClass, desktopClass, largeClass)
  }

  return (
    <Card
      className={cn(
        'bg-background my-6 w-full transition-all duration-200 hover:shadow-md',
        onClick && 'cursor-pointer hover:shadow-lg',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className={cn('pb-3', headerClassName)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {icon && (
              <div className="flex-shrink-0">
                <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg">
                  <DynamicIcon
                    name={icon}
                    className={cn('text-muted-foreground h-8 w-8', iconClassName)}
                  />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="truncate text-4xl font-semibold">{title}</h1>
                {badges.map((badge, index) => (
                  <Badge
                    key={index}
                    variant={badge.variant || 'secondary'}
                    className={cn('text-xs', badge.className)}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
              {description && (
                <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
              )}
            </div>
          </div>

          {actionButtons && (
            <div className="flex-shrink-0">
              <div className="flex items-center gap-1">{actionButtons}</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('pt-0', contentClassName)}>
        {/* Attributes Grid - Dynamic based on number of attributes */}
        {attributes.length > 0 && (
          <div className={cn(getGridClassName(), 'mb-4')}>
            {attributes.map(attr => {
              const formattedValue = attr.formatter
                ? attr.formatter(attr.value)
                : attr.value.toString()

              return (
                <div key={attr.id} className="flex min-w-0 items-center gap-2">
                  {attr.icon && (
                    <DynamicIcon
                      name={attr.icon}
                      className="text-muted-foreground h-4 w-4 flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-muted-foreground truncate text-xs">{attr.label}</p>
                    <p
                      className={cn('truncate text-sm font-medium', attr.className)}
                      title={formattedValue}
                    >
                      {formattedValue}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant={tag.variant || 'outline'}
                className={cn('text-xs', tag.className)}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
