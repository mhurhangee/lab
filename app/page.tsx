import { Footer } from './components/footer'
import { Header } from './components/header'
import { Hero } from './components/hero'
import { FeaturedProjects } from './components/featured-projects'
import { AIPlayground } from './components/ai-playground'
import { BlogSection } from './components/blog-section'
import { About } from './components/about'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/*<FeaturedProjects />*/}
        {/*<AIPlayground />*/}
        <BlogSection />
        <About />
      </main>
      <Footer />
    </div>
  )
}
