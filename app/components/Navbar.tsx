import { Link, Links } from "react-router"


const Navbar = () => {
  return (
    <nav className="navbar">
        <Link to="/">
        <p className="text-2xl font-bold text-gradient">Vitrae</p>
        </Link>
        <Link to="/upload" className="primary-button w-fit">
        Upload Resume/CV
        
        </Link>

    </nav>
  )
}

export default Navbar