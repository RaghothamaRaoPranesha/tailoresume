import './rootLayout.css'
import { Link, Outlet } from 'react-router-dom'




const RootLayout = () => {
  return (
        <div className='rootLayout'>
          <header>
            <Link to="/" className='logo'>
              <img src='/logo.png' alt="" />
              <span>Tailor Resume</span>
            </Link>
            <div className="user">

            </div>
          </header>
          <main>
            <Outlet>

            </Outlet>
          </main>
        </div>
  )
}

export default RootLayout