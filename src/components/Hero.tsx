import heroImage from '../assets/images/blacklist-tallinn-sVs-GkBSfuY-unsplash.jpg'
import './Hero.css'

function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="hero">
      <img
        alt="Red sports car driving on a forest road behind another car"
        className="hero__image"
        fetchPriority="high"
        height="1282"
        loading="eager"
        src={heroImage}
        width="1920"
      />
      <h1 className="hero__heading" id="hero-heading">
        For the drive.
      </h1>
      <div aria-label="Scroll to explore" className="hero__scroll-cue">
        <span>Scroll to explore</span>
        <span aria-hidden="true" className="hero__mouse">
          <span className="hero__mouse-wheel" />
        </span>
      </div>
    </section>
  )
}

export default Hero
