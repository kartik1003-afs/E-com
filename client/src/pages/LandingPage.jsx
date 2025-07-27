import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" /></svg>
    ),
    title: 'Vast Selection',
    desc: 'Thousands of products across all categories.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
    ),
    title: 'Secure Shopping',
    desc: 'Your data and payments are always protected.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
    title: 'Fast Delivery',
    desc: 'Get your orders quickly and reliably.'
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M16 3.13a4 4 0 010 7.75M8 3.13a4 4 0 000 7.75" /></svg>
    ),
    title: 'Personalized Experience',
    desc: 'Profiles, order tracking, and more.'
  },
];

const testimonials = [
  {
    name: 'Priya S.',
    text: '“Shopping here is a breeze! The site is fast, secure, and the delivery is always on time.”',
  },
  {
    name: 'Rahul K.',
    text: '“I love the variety and the easy checkout. Highly recommended!”',
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-[90vh] flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center text-center py-20 px-4 bg-gradient-to-br from-blue-600 via-blue-400 to-blue-300 shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515168833906-d2a3b82b1e2e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20 pointer-events-none" />
        <h1 className="relative text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 animate-fade-in">Welcome to Cartify</h1>
        <p className="relative text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in delay-100">India's most trusted online marketplace for all your needs. Shop smart, shop secure, shop fast.</p>
        <div className="relative flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
          <Link to="/login">
            <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-blue-100 hover:scale-105 transition text-lg">Login</button>
          </Link>
          <Link to="/register">
            <button className="px-8 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 hover:scale-105 transition text-lg border border-white">Register</button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition group">
            <div className="mb-3 group-hover:scale-110 transition">{f.icon}</div>
            <h3 className="text-lg font-bold text-blue-700 mb-1">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Testimonials Section */}
      <section className="bg-blue-50 py-12 px-4">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-8">What Our Customers Say</h2>
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
              <svg className="w-8 h-8 text-blue-300 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3 2 3h4a2 2 0 012 2v12a2 2 0 01-2 2z" /></svg>
              <p className="text-gray-700 italic mb-2">{t.text}</p>
              <span className="text-blue-600 font-semibold">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="w-full bg-gradient-to-r from-blue-700 to-blue-500 py-8 text-center mt-auto">
        <h3 className="text-2xl font-bold text-white mb-2">Ready to start shopping?</h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Link to="/login">
            <button className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg shadow hover:bg-blue-100 hover:scale-105 transition text-lg">Login</button>
          </Link>
          <Link to="/register">
            <button className="px-8 py-3 bg-blue-900 text-white font-bold rounded-lg shadow hover:bg-blue-800 hover:scale-105 transition text-lg border border-white">Register</button>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 