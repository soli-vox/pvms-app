const Features = () => {
  const features = [
    {
      title: "AI-Powered Valuation",
      desc: "Our advanced AI models deliver precise property valuations in seconds.",
      icon: "🧠",
    },
    {
      title: "Role-Based Access",
      desc: "Custom dashboards for Banks, Valuers, Staff, and Clients.",
      icon: "👥",
    },
    {
      title: "Real-Time Insights",
      desc: "Get instant updates on property values and market trends.",
      icon: "📊",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Why Choose PVMS?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
