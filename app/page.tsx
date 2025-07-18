import { PageContainer } from '@/components/page-container'
import { Header } from '@/components/header'
import { Hero } from './components/hero'

//import { About } from './components/about'
//import { FeaturedProjects } from './components/featured-projects'
//import { AIPlayground } from './components/ai-playground'
//import { PostsSection } from './components/posts-section'

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
    </PageContainer>
  )
}
