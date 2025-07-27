'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Trash } from 'lucide-react'

import { deleteProjectAction } from '@/app/actions/projects/delete'

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

import { handleErrorClient } from '@/lib/error/client'

import { mutateProjectsGlobally } from '@/providers/project'

import { toast } from 'sonner'

interface DeleteProjectDialogProps {
  projectId: string
  size?: 'default' | 'icon'
  className?: string
  fullWidth?: boolean
  variant?: 'button' | 'menu-item'
}

export function DeleteProjectDialog({
  projectId,
  size = 'default',
  className = '',
  fullWidth = false,
  variant = 'button',
}: DeleteProjectDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteProjectAction({ id: projectId })

      if ('error' in result) {
        handleErrorClient('Failed to delete project', result.error)
        return
      }

      toast.success('Project deleted', {
        description: 'The project has been successfully deleted.',
      })
      // Refresh projects list immediately
      mutateProjectsGlobally()
      router.push('/projects')
      router.refresh()
    } catch (error) {
      handleErrorClient(
        'Failed to delete project',
        error,
        'Unexpected error in DeleteProjectDialog'
      )
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {variant === 'button' ? (
          <Button
            variant="ghost"
            size={size}
            className={`${className} ${fullWidth ? 'w-full justify-start' : ''}`}
          >
            <Trash className="h-4 w-4" />
            {size !== 'icon' ? 'Delete Project' : null}
          </Button>
        ) : (
          <div className="flex cursor-pointer items-center gap-2">
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </div>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project and all of its
            associated data.
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
