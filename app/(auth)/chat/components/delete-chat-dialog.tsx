'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { Trash } from 'lucide-react'

import { deleteChatAction } from '@/app/actions/chats/delete'

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

import { toast } from 'sonner'

interface DeleteChatDialogProps {
  chatId: string
  size?: 'default' | 'icon'
  className?: string
  fullWidth?: boolean
  variant?: 'button' | 'menu-item'
}

export function DeleteChatDialog({
  chatId,
  size = 'default',
  className = '',
  fullWidth = false,
  variant = 'button',
}: DeleteChatDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteChatAction({ id: chatId })

      if ('error' in result) {
        handleErrorClient('Failed to chat project', result.error)
        return
      }

      toast.success('Chat deleted', {
        description: 'The chat has been successfully deleted.',
      })
      router.push('/chat')
      router.refresh()
    } catch (error) {
      handleErrorClient('Failed to delete prchat', error, 'Unexpected error in DeleteChatDialog')
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
            {size !== 'icon' ? 'Delete Chat' : null}
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
            This action cannot be undone. This will permanently delete the chat and all of its
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
