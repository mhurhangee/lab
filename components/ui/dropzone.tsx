'use client'

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

import { UploadIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { formatFileSize } from '@/lib/file-size'
import { cn } from '@/lib/utils'

import type { DropEvent, DropzoneOptions, FileRejection } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'

type DropzoneContextType = {
  src?: File[]
  accept?: DropzoneOptions['accept']
  maxSize?: DropzoneOptions['maxSize']
  minSize?: DropzoneOptions['minSize']
  maxFiles?: DropzoneOptions['maxFiles']
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

export type DropzoneProps = Omit<DropzoneOptions, 'onDrop'> & {
  src?: File[]
  className?: string
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
  children?: ReactNode
}
export const Dropzone = ({
  accept,
  maxFiles = 1,
  maxSize,
  minSize,
  onDrop,
  onError,
  disabled,
  src,
  className,
  children,
  ...props
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    maxSize,
    minSize,
    onError,
    disabled,
    onDrop: (acceptedFiles, fileRejections, event) => {
      if (fileRejections.length > 0) {
        const message = fileRejections.at(0)?.errors.at(0)?.message
        onError?.(new Error(message))
        return
      }
      onDrop?.(acceptedFiles, fileRejections, event)
    },
    ...props,
  })
  return (
    <DropzoneContext.Provider
      key={JSON.stringify(src)}
      value={{ src, accept, maxSize, minSize, maxFiles }}
    >
      <Button
        className={cn(
          'relative h-auto w-full flex-col overflow-hidden p-8',
          isDragActive && 'ring-ring ring-1 outline-none',
          className
        )}
        disabled={disabled}
        type="button"
        variant="outline"
        {...getRootProps()}
      >
        <input {...getInputProps()} disabled={disabled} />
        {children}
      </Button>
    </DropzoneContext.Provider>
  )
}
const useDropzoneContext = () => {
  const context = useContext(DropzoneContext)
  if (!context) {
    throw new Error('useDropzoneContext must be used within a Dropzone')
  }
  return context
}
export type DropzoneContentProps = {
  children?: ReactNode
  className?: string
}
const maxLabelItems = 3
export const DropzoneContent = ({ children, className }: DropzoneContentProps) => {
  const { src } = useDropzoneContext()
  if (!src) {
    return null
  }
  if (children) {
    return children
  }
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
        <UploadIcon size={16} />
      </div>
      <p className="my-2 w-full truncate text-sm font-medium">
        {src.length > maxLabelItems
          ? `${new Intl.ListFormat('en').format(
              src.slice(0, maxLabelItems).map(file => file.name)
            )} and ${src.length - maxLabelItems} more`
          : new Intl.ListFormat('en').format(src.map(file => file.name))}
      </p>
      <p className="text-muted-foreground w-full text-xs text-wrap">
        Drag and drop or click to replace
      </p>
    </div>
  )
}
export type DropzoneEmptyStateProps = {
  children?: ReactNode
  className?: string
}
export const DropzoneEmptyState = ({ children, className }: DropzoneEmptyStateProps) => {
  const { src, accept, maxSize, minSize, maxFiles } = useDropzoneContext()
  if (src) {
    return null
  }
  if (children) {
    return children
  }
  let caption = ''
  if (accept) {
    caption += 'Accepts '
    caption += new Intl.ListFormat('en').format(Object.keys(accept))
  }
  if (minSize && maxSize) {
    caption += ` between ${formatFileSize(minSize)} and ${formatFileSize(maxSize)}`
  } else if (minSize) {
    caption += ` at least ${formatFileSize(minSize)}`
  } else if (maxSize) {
    caption += ` less than ${formatFileSize(maxSize)}`
  }
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
        <UploadIcon size={16} />
      </div>
      <p className="my-2 w-full truncate text-sm font-medium text-wrap">
        Upload {maxFiles === 1 ? 'a file' : 'files'}
      </p>
      <p className="text-muted-foreground w-full truncate text-xs text-wrap">
        Drag and drop or click to upload
      </p>
      {caption && <p className="text-muted-foreground text-xs text-wrap">{caption}.</p>}
    </div>
  )
}
