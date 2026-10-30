import { NavLink } from 'react-router'
import shoppyLogo from '../assets/shoppy-logo.svg'
import { useCart } from '../hooks/useCart'

function Header() {
  const { itemCount } = useCart()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="site-logo" to="/" aria-label="Shoppy home">
          <img src={shoppyLogo} alt="" />
        </NavLink>
        <nav aria-label="Main navigation" className="site-navigation">
          <NavLink end to="/">
            Home
          </NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink
            aria-label={`Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            to="/cart"
          >
            Cart <span className="site-navigation__count">{itemCount}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
