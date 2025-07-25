'use client'

import { Suspense, useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { Textarea } from '@/components/ui/textarea'

import { LabLayout } from '@/components/lab-layout'

import {
  AlertCircle,
  FileAudio,
  Loader2,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Square,
  Upload,
  Wand2,
} from 'lucide-react'

const LANGUAGE_OPTIONS = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'hi', label: 'Hindi' },
]

const MODEL_OPTIONS = [
  { value: 'whisper-1', label: 'Whisper-1 (Standard)' },
  { value: 'gpt-4o-mini-transcribe', label: 'GPT-4o Mini Transcribe' },
  { value: 'gpt-4o-transcribe', label: 'GPT-4o Transcribe' },
]

interface TranscriptResult {
  text: string
  language?: string
  duration?: number
  segments?: Array<{
    text: string
    start: number
    end: number
  }>
  warnings?: string[]
}

function STTPageContent() {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState('')
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null)

  // Settings
  const [language, setLanguage] = useState('auto')
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('whisper-1')

  // Audio playback
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Audio playback event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }
    const handleEnded = () => setIsPlaying(false)
    const handleLoadedData = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('loadeddata', handleLoadedData)
    audio.addEventListener('canplaythrough', updateDuration)
    audio.addEventListener('ended', handleEnded)

    // Force load the audio
    audio.load()

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('loadeddata', handleLoadedData)
      audio.removeEventListener('canplaythrough', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  // Recording timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const file = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)

        setAudioFile(file)
        setAudioUrl(url)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      setError('')
    } catch (error) {
      setError('Failed to access microphone. Please check permissions.')
      console.error('Recording error:', error)
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    }
  }

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!file.type.startsWith('audio/')) {
        setError('Please select an audio file')
        return
      }

      // Check file size (25MB limit for OpenAI)
      if (file.size > 25 * 1024 * 1024) {
        setError('File size must be less than 25MB')
        return
      }

      setAudioFile(file)
      const url = URL.createObjectURL(file)
      setAudioUrl(url)
      setError('')
      setTranscript(null)
    }
  }

  const handleTranscribe = async () => {
    if (!audioFile) {
      setError('Please record audio or upload a file')
      return
    }

    setIsTranscribing(true)
    setError('')
    setTranscript(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('model', model)

      if (language && language !== 'auto') {
        formData.append('language', language)
      }

      if (prompt.trim()) {
        formData.append('prompt', prompt.trim())
      }

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to transcribe audio')
      }

      const result = await response.json()
      setTranscript(result)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to transcribe audio')
    } finally {
      setIsTranscribing(false)
    }
  }

  const clearAll = () => {
    setAudioFile(null)
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }
    setTranscript(null)
    setError('')
    setRecordingTime(0)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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

  const resetAudio = () => {
    if (!audioRef.current) return
    audioRef.current.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
  }

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    return formatTime(seconds)
  }

  return (
    <LabLayout
      title="Speech to Text"
      description="Convert speech to text using AI-powered transcription."
      icon="mic"
      breadcrumb={[{ href: '/speech-to-text', label: 'Speech to Text' }]}
      backTo={{ href: '/dashboard', label: 'Dashboard' }}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Main STT Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Speech to Text Transcription
            </CardTitle>
            <CardDescription>
              Record audio or upload a file to transcribe speech to text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recording Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Audio Recording</Label>
                {isRecording && (
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    {formatTime(recordingTime)}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!isRecording ? (
                  <Button onClick={startRecording} variant="outline">
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <>
                    {isPaused ? (
                      <Button onClick={resumeRecording} variant="outline">
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    ) : (
                      <Button onClick={pauseRecording} variant="outline">
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={stopRecording} variant="destructive">
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Or Upload Audio File</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Browse
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Supported formats: MP3, WAV, M4A, etc. Max size: 25MB
              </p>
            </div>

            {/* Audio Preview */}
            {audioUrl && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Audio Preview</Label>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <audio ref={audioRef} src={audioUrl} preload="metadata" />

                  <Button variant="outline" size="sm" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <Button variant="outline" size="sm" onClick={resetAudio}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>

                  <div className="flex-1">
                    <div className="text-muted-foreground text-xs">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Transcription Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="model-select" className="text-sm font-medium">
                  Model
                </Label>
                <Select value={model} onValueChange={setModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODEL_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language-select" className="text-sm font-medium">
                  Language
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt-input" className="text-sm font-medium">
                  Prompt (Optional)
                </Label>
                <Input
                  id="prompt-input"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Guide the transcription style..."
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

            {/* Transcribe Button */}
            <Button
              onClick={handleTranscribe}
              disabled={!audioFile || isTranscribing}
              className="w-full"
              size="lg"
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Transcribe Audio
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Transcript Results */}
        {transcript && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileAudio className="h-5 w-5" />
                Transcription Results
              </CardTitle>
              <CardDescription>
                {transcript.language && `Detected language: ${transcript.language}`}
                {transcript.duration && ` • Duration: ${formatDuration(transcript.duration)}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Transcript</Label>
                <Textarea
                  value={transcript.text}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                  placeholder="Transcribed text will appear here..."
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>{transcript.text.length} characters</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(transcript.text)}
                  >
                    Copy Text
                  </Button>
                </div>
              </div>

              {/* Segments */}
              {transcript.segments && transcript.segments.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Segments</Label>
                  <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
                    {transcript.segments.map((segment, index) => (
                      <div key={index} className="text-sm">
                        <div className="text-muted-foreground text-xs">
                          {formatTime(segment.start)} - {formatTime(segment.end)}
                        </div>
                        <div>{segment.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {transcript.warnings && transcript.warnings.length > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Warnings: {transcript.warnings.join(', ')}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </LabLayout>
  )
}

export default function STTPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <STTPageContent />
    </Suspense>
  )
}
