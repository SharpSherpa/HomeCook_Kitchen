
import React from 'react';
import { MenuItem, ContactInfo } from '../../types.ts';
import Button from '../Button.tsx';
import MenuItemCard from '../MenuItemCard.tsx';

interface HomePageProps {
  onOrderNow: () => void;
  featuredItems: MenuItem[];
  contactInfo: ContactInfo;
}

const HomePage: React.FC<HomePageProps> = ({ onOrderNow, featuredItems, contactInfo }) => {
  
  const handleDummyItemClick = () => {};

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/id/1060/1920/1080')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-up">Taste of Home, Delivered.</h1>
            <p className="text-lg md:text-xl mb-8 animate-slide-up [animation-delay:0.2s]">Authentic, delicious, and lovingly prepared meals just for you.</p>
            <div className="animate-slide-up [animation-delay:0.4s]">
                <Button onClick={onOrderNow} className="text-lg">
                Order Now
                </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Items Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Our Bestsellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredItems.map(item => (
              <MenuItemCard key={item.id} item={item} onItemClick={handleDummyItemClick} />
            ))}
          </div>
        </div>
      </section>

       {/* About Us Section */}
      <section id="about-us" className="py-16 bg-orange-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">About HomeCook</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in a small kitchen with a big heart, HomeCook started with a simple mission: to share the joy of authentic, homemade food with our community. We believe that good food brings people together, and every dish we prepare is a testament to our passion for quality, flavor, and the warmth of a home-cooked meal.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                We use only the freshest, locally-sourced ingredients, and our recipes have been passed down through generations. Thank you for letting us be a part of your mealtime.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
                <img src="https://picsum.photos/id/237/600/400" alt="About HomeCook" className="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location Section */}
      <section id="contact" className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">Find Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <iframe
                src={contactInfo.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-xl">
              <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Phone:</strong> {contactInfo.phone}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>WhatsApp:</strong> {contactInfo.whatsapp}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-2"><strong>Email:</strong> {contactInfo.email}</p>
              <p className="text-gray-600 dark:text-gray-400"><strong>Address:</strong> {contactInfo.address}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;