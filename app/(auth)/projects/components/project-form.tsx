'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { createProjectAction } from '@/app/actions/projects/create'
import { updateProjectAction } from '@/app/actions/projects/update'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { handleErrorClient } from '@/lib/error/client'

import { ProjectDB } from '@/types/database'

import { toast } from 'sonner'

interface ProjectFormProps {
  project?: ProjectDB
  isEdit?: boolean
}

export function ProjectForm({ project, isEdit = false }: ProjectFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState(project?.title || '')
  const [description, setDescription] = useState(project?.description || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEdit && project) {
        const result = await updateProjectAction({
          id: project.id,
          title,
          description,
        })

        if ('error' in result) {
          handleErrorClient('Failed to update project', result.error)
          return
        }

        toast.success('Project updated', {
          description: 'Your project has been updated successfully.',
        })
        router.push(`/projects/${project.id}`)
        router.refresh()
      } else {
        const result = await createProjectAction({
          title,
          description,
        })

        if ('error' in result) {
          handleErrorClient('Failed to create project', result.error)
          return
        }

        toast.success('Project created', {
          description: 'Your new project has been created successfully.',
        })
        router.push(`/projects/${result.id}`)
        router.refresh()
      }
    } catch (err) {
      handleErrorClient(
        isEdit ? 'Failed to update project' : 'Failed to create project',
        err,
        'Unexpected error in ProjectForm'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={e => void handleSubmit(e)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-destructive">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Project title"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Project description (optional)"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Project' : 'Create Project'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
