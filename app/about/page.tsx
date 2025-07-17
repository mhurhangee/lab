import Link from 'next/link'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageContainer } from '@/components/page-container'
import { AwardIcon, BookmarkIcon, Code, CodeIcon, CpuIcon, DogIcon, GraduationCapIcon, MicroscopeIcon, ScaleIcon, SparkleIcon, TreesIcon, UserIcon } from 'lucide-react'
import { app } from '@/lib/app'

export default function AboutPage() {
    return (
        <PageContainer>
            <Header />
            <main className="mx-auto min-h-screen w-full max-w-screen-lg px-4 py-20 sm:px-6 lg:px-8 prose dark:prose-invert">
                <h1 className="mt-2 flex items-center gap-2"><app.icon className="h-8 w-8" /> About Superfier</h1>
                <p>
                    Superfier is my laboratory for AI experiments, learning, and insights. It's a place where I explore
                    new technologies, share my thoughts, and document my journey in the world of AI and development.
                </p>

                <h1 className="mt-24 flex items-center gap-2"><UserIcon className="h-8 w-8" /> About Me</h1>
                <p>
                    I'm Michael, a software engineer with a passion for AI and machine learning. I love learning and making new things. This is my place to <Link href="/experiments" className="hover:text-primary">share them</Link>.</p>
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
                        <Link
                            href="/posts"
                            className="flex items-center gap-2"
                        >
                            <CpuIcon /> Tech Enthusiast
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link
                            href="/posts"
                            className="flex items-center gap-2"
                        >
                            <TreesIcon />  Nature Lover
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <Link
                            href="/posts"
                            className="flex items-center gap-2"
                        >
                            <DogIcon />  Whippet Owner
                        </Link>
                    </li>
                </ul>
            </main>
            <Footer />
        </PageContainer>
    );
}
