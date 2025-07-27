'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

import { listContextsByTypeAction } from '@/app/actions/contexts/list-by-type'
import { listContextsByTypeByProjectAction } from '@/app/actions/contexts/list-by-type-by-project'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorAlert } from '@/components/ui/error-alert'

import { getContextIcon } from '@/lib/context-to-icon'
import { formatDate } from '@/lib/date'
import { handleErrorClient } from '@/lib/error/client'
import { formatFileSize } from '@/lib/file-size'

import { ContextsTypes } from '@/types/contexts'
import type { ContextDB } from '@/types/database'

interface GenericWidgetProps {
  type: ContextsTypes
  limit?: number
  icon?: IconName
  projectId?: string
}

export function GenericWidget({ type, limit = 3, icon = 'layers', projectId }: GenericWidgetProps) {
  const [items, setItems] = useState<ContextDB[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        let result: { results?: ContextDB[]; error?: string } = { results: [] }
        if (projectId) {
          result = await listContextsByTypeByProjectAction({ projectId, type })
        } else {
          result = await listContextsByTypeAction(type)
        }

        if (result.error) {
          setError(result.error)
          handleErrorClient(result.error, 'Failed to load files')
        } else {
          // If limit is 0, return all results, otherwise return the limit
          setItems(limit > 0 ? result.results?.slice(0, limit) || [] : result.results || [])
        }
      } catch (err) {
        setError('Failed to load files')
        handleErrorClient('Failed to load files', err)
      } finally {
        setLoading(false)
      }
    }

    void fetchFiles()
  }, [projectId, type, limit])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {[1, 2, limit].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
              <div className="bg-muted h-3 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )
    }

    if (error) {
      return <ErrorAlert error={error} />
    }

    if (items.length === 0) {
      return (
        <div className="text-muted-foreground text-sm">
          No {type} yet. <Link href={`/${type}/new`}>Add some {type}</Link> to get started.
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {items.map(item => (
          <Link key={item.id} href={`/${type}/${item.id}`}>
            <div className="group hover:bg-muted/50 cursor-pointer rounded-lg p-2 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <DynamicIcon
                    name={getContextIcon(type)}
                    className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="group-hover:text-primary truncate text-sm font-medium">
                      {item.name}
                    </h4>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(item.size)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <DynamicIcon name="clock" className="mr-1 h-3 w-3" />
                        {formatDate(item.updatedAt)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-1 text-sm font-medium">
          <DynamicIcon name={icon} className="h-4 w-4" />
          Recent<span className="uppercase">{type}</span>
        </CardTitle>
        <Link href={`/${type}`}>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}
