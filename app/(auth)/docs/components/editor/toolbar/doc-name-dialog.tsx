'use client'

import { useRef, useState } from 'react'

import { updateContextAction } from '@/app/actions/contexts/update'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'

import { handleErrorClient } from '@/lib/error/client'

import { toast } from 'sonner'

interface DocNameDialogProps {
  name: string
  id: string
  setName: (name: string) => void
}

export const DocNameDialog = ({ name, id, setName }: DocNameDialogProps) => {
  const [newValue, setNewValue] = useState(name)
  const [isSaving, setIsSaving] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const result = await updateContextAction({ id: id, name: newValue })

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success('Document name updated')
      setIsSaving(false)
      // Close dialog after save
      closeRef.current?.click()
      setName(newValue)
    } catch (error) {
      handleErrorClient('Failed to update context', error as Error)
      setIsSaving(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="max-w-[150px]">
          <h1 className="truncate text-sm font-bold">{name}</h1>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Document Name</DialogTitle>
          <DialogDescription>Change the name of the document.</DialogDescription>
        </DialogHeader>
        <Input type="text" value={newValue} onChange={e => setNewValue(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader /> : 'Save'}
          </Button>
          {/* Hidden DialogClose for programmatic close */}
          <DialogClose asChild>
            <button ref={closeRef} style={{ display: 'none' }} />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
