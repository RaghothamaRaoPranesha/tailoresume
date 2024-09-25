
import './dashboardLayout.css'
import {Link, Outlet, useNavigate} from 'react-router-dom'


const DashboardLayout = () => {


  return (
    <div className='dashboardLayout'>
        
        <div className="content">
            <Outlet/>
            </div>
    </div>
  )
}

export default DashboardLayout  