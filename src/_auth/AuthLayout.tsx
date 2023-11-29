import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const isAuthenticated = false

  return (
    <>
      { isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className="flex flex-1 justify-center items-center py-10">
            <Outlet />
          </section>

          {/* remember to replace this image */}
          <img 
            src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden md:block h-screen w-1/2 object-cover bg-no-repeat"
          />
        </>
      ) }
    </>
  )
}

export default AuthLayout