'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

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

import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { deleteFileAction } from '@/app/actions/files/delete'

interface DeleteFileDialogProps {
  fileId: string
  size?: 'default' | 'icon'
  className?: string
  fullWidth?: boolean
  variant?: 'button' | 'menu-item'
}

export function DeleteFileDialog({
  fileId,
  size = 'default',
  className = '',
  fullWidth = false,
  variant = 'button',
}: DeleteFileDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteFileAction({ id: fileId })

      if ('error' in result) {
        handleErrorClient('Failed to delete file', result.error)
        return
      }

      toast.success('File deleted', {
        description: 'The file has been successfully deleted.',
      })
      router.push('/files')
      router.refresh()
    } catch (error) {
      handleErrorClient('Failed to delete file', error, 'Unexpected error in DeleteFileDialog')
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
            className={`${className} ${fullWidth ? 'w-full' : ''}`}
          >
            <Trash className="h-4 w-4" />
            {size !== 'icon' ? 'Delete File' : null}
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
            This action cannot be undone. This will permanently delete the file and all of its
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault()
              handleDelete()
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
