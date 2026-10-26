import './Hero.css'

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero">
      <div className="hero__inner">
        <h1 className="hero__heading" id="hero-heading">
          Find your next favourite.
        </h1>
        <p className="hero__text">Discover products for everyday life.</p>
        <a className="hero__link" href="#products-heading">
          Explore products
        </a>
      </div>
    </section>
  )
}

export default Hero
