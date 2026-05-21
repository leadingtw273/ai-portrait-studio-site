import { Nav } from './sections/Nav'
import { Hero } from './sections/Hero'
import { Demo } from './sections/Demo'
import { Pricing } from './sections/Pricing'
import { AddOns } from './sections/AddOns'
import { FinalCTA } from './sections/FinalCTA'
import { Footer } from './sections/Footer'
import { ScrollToTop } from './sections/ScrollToTop'

export function App() {
  return (
    <div className="min-h-screen bg-bg-base text-white">
      <Nav />
      <main>
        <Hero />
        <Demo />
        <Pricing />
        <AddOns />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}
