import { Outlet, useLocation } from 'react-router'
import Footer from './Footer'
import Header from './Header'

function Layout() {
  const isHomepage = useLocation().pathname === '/'

  return (
    <div className={`app-shell${isHomepage ? ' app-shell--home' : ''}`}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main className="main-content" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
