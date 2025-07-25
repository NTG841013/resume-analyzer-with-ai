import { Link } from "react-router"
import { usePuterStore } from "~/lib/puter"
import { useNavigate } from "react-router"

const Navbar = () => {
  const { auth } = usePuterStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  return (
      <>
          <div className="absolute top-4 left-4">
              <p className="text-2xl font-bold text-white">Vitrae</p>
          </div>
          <nav className="navbar flex items-center justify-center w-auto mx-auto">
              <div className="flex items-center mt-2">
                  <Link to="/upload" className="primary-button">
                      Upload Resume/CV
                  </Link>
              </div>
          </nav>
          <div className="absolute top-4 right-4">
              {auth.isAuthenticated && (
                  <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                  >
                      Log Out
                  </button>)}
          </div>
      </>
  )
}

export default Navbar