import Link from 'next/link'

import { BackToButton } from '@/components/ui/back-to-button'

import { LabLayout } from '@/components/lab-layout'

import {
  AwardIcon,
  BookmarkIcon,
  CodeIcon,
  CpuIcon,
  DogIcon,
  GraduationCapIcon,
  MicroscopeIcon,
  ScaleIcon,
  SparkleIcon,
  TreesIcon,
  UserIcon,
} from 'lucide-react'

export default function AboutPage() {
  return (
    <LabLayout
      title="About"
      icon={<UserIcon className="h-4 w-4" />}
      actions={<BackToButton href="/" label="Home" />}
      description="A little bit about me"
    >
      <main className="prose dark:prose-invert mx-auto">
        <h1 className="mt-24 flex items-center gap-2">
          <UserIcon className="h-8 w-8" /> About Me
        </h1>
        <p>
          I&apos;m Michael, a software engineer with a passion for AI and machine learning. I love
          learning and making new things. This is my corner of the web to share them.
        </p>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <li className="flex items-center">
            <Link
              href="https://www.linkedin.com/in/michael-hurhangee/"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ScaleIcon /> Former Patent Attorney
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://doi.org/10.25560/73366"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCapIcon /> PhD & MSci in Chemistry
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://scholar.google.co.uk/scholar?hl=en&as_sdt=0%2C5&q=michael+hurhangee"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MicroscopeIcon /> 10+ research papers
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://patents.google.com/patent/US11667650B2"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AwardIcon /> 1 granted patent
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://scholar.google.co.uk/scholar?hl=en&as_sdt=0%2C5&q=michael+hurhangee"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BookmarkIcon /> 2000+ citations
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://github.com/mhurhangee"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SparkleIcon /> AI Expert
            </Link>
          </li>
          <li className="flex items-center">
            <Link
              href="https://github.com/mhurhangee"
              className="flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CodeIcon /> Full Stack Dev
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/posts" className="flex items-center gap-2">
              <CpuIcon /> Tech Enthusiast
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/posts" className="flex items-center gap-2">
              <TreesIcon /> Nature Lover
            </Link>
          </li>
          <li className="flex items-center">
            <Link href="/posts" className="flex items-center gap-2">
              <DogIcon /> Whippet Owner
            </Link>
          </li>
        </ul>
      </main>
    </LabLayout>
  )
}
