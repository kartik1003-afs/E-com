import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-white to-blue-50 px-4">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mt-12 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 drop-shadow">Welcome to E-Com!</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Your one-stop shop for the latest products, seamless shopping, and fast delivery. Discover a new way to shop online with a secure, user-friendly experience.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition">Login</button>
          </Link>
          <Link to="/register">
            <button className="px-6 py-2 bg-white border border-blue-600 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-50 transition">Register</button>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white rounded-xl shadow-lg p-6 md:p-10 max-w-3xl w-full mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Why Shop With Us?</h2>
        <ul className="list-disc list-inside text-gray-700 text-left space-y-2">
          <li>Wide selection of top-quality products</li>
          <li>Secure and easy checkout process</li>
          <li>Fast, reliable shipping</li>
          <li>Personalized user profiles and order tracking</li>
          <li>Admin dashboard for store management</li>
        </ul>
      </section>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-gray-600 mb-2">Already have an account?</p>
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login here</Link>
        <p className="text-gray-600 mt-4 mb-2">New to E-Com?</p>
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register now</Link>
      </div>
    </div>
  );
};

export default HomePage; 