const Reviews = () => {
  const reviews = [
    "PVMS reduced our valuation time by 70% - Bank of XYZ",
    "The AI accuracy is unmatched! - Valuer Corp",
    "Simple and effective for clients - Property Owners Association",
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Trusted by Industry Leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition duration-300"
            >
              <p className="text-center">"{review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
