'use client'

import { Suspense, useEffect, useRef, useState } from 'react'

import { useSearchParams } from 'next/navigation'

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Wand2,
} from 'lucide-react'

import { listContextsByTypeAction } from '@/app/actions/contexts/list-by-type'
import { getParseStatusAction } from '@/app/actions/contexts/parse'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'

import { LabLayout } from '@/components/lab-layout'

import { generateSpeech } from '@/lib/text-to-speech'

import { ContextDB } from '@/types/database'

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy' },
  { value: 'echo', label: 'Echo' },
  { value: 'fable', label: 'Fable' },
  { value: 'onyx', label: 'Onyx' },
  { value: 'nova', label: 'Nova' },
  { value: 'shimmer', label: 'Shimmer' },
]

function TTSPageContent() {
  const searchParams = useSearchParams()
  const preselectedFileId = searchParams.get('fileId')

  const [contexts, setContexts] = useState<ContextDB[]>([])
  const [selectedFileId, setSelectedFileId] = useState<string>(preselectedFileId || '')
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('alloy')
  const [instructions, setInstructions] = useState('')
  const [speed, setSpeed] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Load files on component mount
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true)
      try {
        const result = await listContextsByTypeAction('pdfs')
        if (result.error) {
          setError(result.error)
        } else if (result.results) {
          setContexts(result.results)
        }
      } catch {
        setError('Failed to load files')
      } finally {
        setIsLoading(false)
      }
    }

    void loadFiles()
  }, [])

  // Load parsed content if file is selected
  useEffect(() => {
    if (selectedFileId) {
      const loadParseContent = async () => {
        const result = await getParseStatusAction({ contextId: selectedFileId })
        if (result.success && result.isParsed && result.markdown) {
          setText(result.markdown)
        }
      }
      void loadParseContent()
    }
  }, [selectedFileId])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('Please enter some text')
      return
    }

    setIsGenerating(true)
    setError('')

    // Clear previous audio immediately to show loading state
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setCurrentTime(0)
    setIsPlaying(false)

    try {
      const { audioUrl: newAudioUrl } = await generateSpeech({
        text: text.trim(),
        voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
        instructions: instructions.trim() || undefined,
        speed,
      })

      setAudioUrl(newAudioUrl)
      setCurrentTime(0)
      setIsPlaying(false)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate speech')
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    const newTime = value[0]
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const resetAudio = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const selectedFile = contexts.find(f => f.id === selectedFileId)

  return (
    <LabLayout
      title="Text to Speech"
      pageTitle="Text to Speech"
      description="Convert text to speech using AI-powered voice synthesis."
      icon="volume-2"
      breadcrumb={[{ href: '/text-to-speech', label: 'Text to Speech' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Main TTS Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Text to Speech Generator
            </CardTitle>
            <CardDescription>
              Convert text to speech with customizable voice settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Selection - Compact */}
            {contexts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="file-select" className="text-sm font-medium">
                  Load from Parsed File (Optional)
                </Label>
                <div className="flex gap-2">
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Select value={selectedFileId} onValueChange={setSelectedFileId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choose a parsed file..." />
                      </SelectTrigger>
                      <SelectContent>
                        {contexts.map(context => (
                          <SelectItem key={context.id} value={context.id}>
                            <div className="flex w-full items-center justify-between">
                              <span>{context.name}</span>
                              <Badge variant="secondary" className="ml-2">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Parsed
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {selectedFile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFileId('')
                        setText('')
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-sm font-medium">
                Text to Convert
              </Label>
              <Textarea
                id="text-input"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                className="min-h-[120px] resize-none"
                maxLength={4096}
              />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>{text.length}/4096 characters</span>
                {selectedFile && <span>Loaded from: {selectedFile.name}</span>}
              </div>
            </div>

            {/* Voice Settings - Grid Layout */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="voice-select" className="text-sm font-medium">
                  Voice
                </Label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="speed-slider" className="text-sm font-medium">
                  Speed: {speed}x
                </Label>
                <Slider
                  id="speed-slider"
                  value={[speed]}
                  onValueChange={value => setSpeed(value[0])}
                  min={0.25}
                  max={4}
                  step={0.25}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions-input" className="text-sm font-medium">
                  Instructions (Optional)
                </Label>
                <Input
                  id="instructions-input"
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="e.g., speak like a narrator"
                  maxLength={200}
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerateSpeech}
              disabled={!text.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generate Speech
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Audio Player Card - Only show when there's audio or generating */}
        {(audioUrl || isGenerating) && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Audio Player</CardTitle>
              <CardDescription>
                {isGenerating ? 'Generating your speech...' : 'Listen to your generated speech'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGenerating ? (
                // Loading State
                <div className="flex items-center justify-center py-8">
                  <div className="space-y-3 text-center">
                    <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                    <p className="text-muted-foreground text-sm">
                      Creating your audio with {voice} voice...
                    </p>
                  </div>
                </div>
              ) : audioUrl ? (
                // Audio Player
                <>
                  <audio ref={audioRef} src={audioUrl} preload="metadata" />

                  {/* Compact Controls */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePlayPause}
                      disabled={!audioUrl}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>

                    <Button variant="outline" size="sm" onClick={resetAudio} disabled={!audioUrl}>
                      <RotateCcw className="h-4 w-4" />
                    </Button>

                    {/* Progress Bar */}
                    <div className="flex-1 space-y-1">
                      <Slider
                        value={[currentTime]}
                        onValueChange={handleSeek}
                        max={duration || 100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-muted-foreground flex justify-between text-xs">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={toggleMute}>
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="w-16">
                        <Slider
                          value={[isMuted ? 0 : volume]}
                          onValueChange={handleVolumeChange}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>
    </LabLayout>
  )
}

export default function TTSPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TTSPageContent />
    </Suspense>
  )
}
