import { Link } from 'react-router'

function NotFound() {
  return (
    <>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to the home page</Link>
    </>
  )
}

export default NotFound
