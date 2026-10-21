import { NavLink } from 'react-router'
import vyreLogo from '../assets/download.svg'

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="site-logo" to="/" aria-label="VYRE home">
          <img src={vyreLogo} alt="" />
        </NavLink>
        <nav aria-label="Main navigation" className="site-navigation">
          <NavLink end to="/">
            Home
          </NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/cart">Cart</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
