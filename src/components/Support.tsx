import React, { useState } from 'react';
import { ChevronLeft, Phone, Mail, MessageSquare, HelpCircle, ChevronDown, ChevronUp, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportProps {
  onBack: () => void;
}

export const Support: React.FC<SupportProps> = ({ onBack }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    { q: 'How do I book a ticket?', a: 'Simply search for your route using the form on the home page, select a bus, pick your seat, and confirm your booking. You will need to sign in with Google to complete the process.' },
    { q: 'Can I cancel my booking?', a: 'Yes, you can cancel your booking up to 24 hours before departure. Please contact our support team with your Booking ID for assistance.' },
    { q: 'What payment methods are accepted?', a: 'Currently, we support Visa, Mastercard, and EcoCash for online payments. You can also pay at our physical counters in major cities.' },
    { q: 'Do I need to print my ticket?', a: 'No, a digital ticket on your phone is sufficient. You can download your ticket from the "My Bookings" section after a successful booking.' },
    { q: 'What is the baggage allowance?', a: 'Most operators allow up to 20kg of checked baggage and one small carry-on item. Extra baggage may incur additional fees.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-bold text-sm uppercase tracking-wider">Back to Home</span>
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-gray-900">Support Center</h2>
          <p className="text-gray-500 font-medium">We're here to help you with your travel needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* FAQ Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <HelpCircle className="text-orange-600" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={20} className="text-orange-600" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 text-gray-500 text-sm leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900">Send us a message</h3>
              <p className="text-gray-500 font-medium">Have a specific question? Fill out the form below.</p>
            </div>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 p-8 rounded-2xl text-center space-y-4 border border-green-100"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="text-xl font-bold text-green-900">Message Sent!</h4>
                <p className="text-green-700">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input type="text" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                    <input type="email" required className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                  <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                    <option>General Inquiry</option>
                    <option>Booking Issue</option>
                    <option>Payment Problem</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Message</label>
                  <textarea required rows={4} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                  <Send size={18} /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-orange-600 rounded-3xl p-8 text-white space-y-8 shadow-xl shadow-orange-200">
            <h3 className="text-2xl font-black">Contact Info</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg"><Phone size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Call us</p>
                  <p className="font-bold">+263 770 000 000</p>
                  <p className="text-xs text-orange-100">Mon-Fri, 8am-6pm</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Email us</p>
                  <p className="font-bold">support@zimbus.co.zw</p>
                  <p className="text-xs text-orange-100">We reply within 24h</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg"><MessageSquare size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">Live Chat</p>
                  <p className="font-bold">Available 24/7</p>
                  <p className="text-xs text-orange-100">Average response: 5m</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-gray-900">Head Office</h3>
            <div className="space-y-4 text-sm text-gray-500 font-medium">
              <p>123 Samora Machel Avenue</p>
              <p>Harare, Zimbabwe</p>
              <div className="pt-4 border-t border-gray-50">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Social Media</p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors font-bold">Facebook</a>
                  <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors font-bold">Twitter</a>
                  <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors font-bold">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
