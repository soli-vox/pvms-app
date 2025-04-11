const Hero = () => {
  return (
    <section className="pt-24 pb-12 bg-gradient-to-br from-blue-500 to-indigo-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in">
          Property Valuation Made Smart with PVMS
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Leverage AI-powered insights to accurately value properties for banks,
          valuers, and clients. Fast, reliable, and secure.
        </p>
        <button className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-500 transition duration-300 transform hover:scale-105">
          Explore Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
