import { PageContainer } from '@/components/page-container'

import { Footer } from '../components/footer'
import { Header } from '../components/header'
import { About } from './components/about'
import { Hero } from './components/hero'
//import { FeaturedProjects } from './components/featured-projects'
//import { AIPlayground } from './components/ai-playground'
import { PostsSection } from './components/posts-section'

export default function Home() {
  return (
    <PageContainer>
      <Header />
      <main className="flex-1">
        <Hero />
        {/*<FeaturedProjects />*/}
        {/*<AIPlayground />*/}
        {/*<PostsSection />*/}
        {/*<About />*/}
      </main>
      <Footer />
    </PageContainer>
  )
}
