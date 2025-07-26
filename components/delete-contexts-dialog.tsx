'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Trash } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'

import { handleErrorClient } from '@/lib/error/client'

import type { ContextsTypes } from '@/types/contexts'

import { VariantProps } from 'class-variance-authority'
import { toast } from 'sonner'

interface DeleteContextsDialogProps {
  contextsId: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
  type: ContextsTypes
  action: (id: string) => Promise<{ error?: string; success?: boolean }>
}

export function DeleteContextsDialog({
  contextsId,
  variant = 'destructive',
  size = 'default',
  className = '',
  type,
  action,
}: DeleteContextsDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await action(contextsId)

      if (result.error) {
        throw handleErrorClient(`Failed to delete ${type}`, result.error)
      }

      if (result.success) {
        toast.success(`${type} deleted`, {
          description: `${type} has been successfully deleted.`,
        })
        router.push(`/${type}`)
        router.refresh()
      }
    } catch (error) {
      throw handleErrorClient(
        `Failed to delete ${type}`,
        error,
        'Unexpected error in DeleteContextsDialog'
      )
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={`${className}`}>
          <Trash className="h-4 w-4" />
          {size !== 'icon' ? `Delete ${type.slice(0, -1).toUpperCase()}` : null}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this{' '}
            {type.slice(0, -1).toUpperCase()} and all of its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault()
              void handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
