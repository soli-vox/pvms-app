const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "PVMS transformed how our bank assesses collateral values. It's fast and accurate!",
      role: "Bank Manager",
      img: "https://via.placeholder.com/40",
    },
    {
      name: "Michael Lee",
      text: "As a valuer, I rely on PVMS for precise AI-driven insights. Highly recommend!",
      role: "Property Valuer",
      img: "https://via.placeholder.com/40",
    },
    {
      name: "Priya Sharma",
      text: "Checking my property's value as collateral was so easy with PVMS.",
      role: "Borrower",
      img: "https://via.placeholder.com/40",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.img}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-blue-700">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
