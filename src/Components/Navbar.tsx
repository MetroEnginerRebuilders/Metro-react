function Navbar() {
    return (
        <div>
            <nav className="fixed top-0 left-0 w-full bg-[#3A5795] shadow-md z-50">
  <div className="max-w-7xl px-16 py-3 flex items-center justify-between">

    
    {/* Left: Logo */}
    <div className="flex items-center pl-16">
      <img
        src="/Images/logo.png"
        alt="Logo"
        className="h-10 w-auto object-contain"
      />
    </div>

    {/* Right: Name & Description */}
    <div className=" text-white pr-16">
      <h1 className="text-lg font-semibold text-[#00ffff]">
        METRO
      </h1>
      <p className="text-sm leading-tight opacity-90 text-[#bce1f9]">
        Engine Rebuilders
      </p>
    </div>

  </div>
</nav>

        </div>
    )
}

export default Navbar
