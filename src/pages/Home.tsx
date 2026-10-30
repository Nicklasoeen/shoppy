import { useEffect } from 'react'
import { useLocation } from 'react-router'
import Hero from '../components/Hero'
import ProductSection from '../components/ProductSection'

function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    }
  }, [hash])

  return (
    <>
      <Hero />
      <ProductSection />
    </>
  )
}

export default Home
