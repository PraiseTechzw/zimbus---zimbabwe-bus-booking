import React, { useRef } from 'react';
import { CheckCircle2, MapPin, Calendar, Clock, User, Bus as BusIcon, Download, Share2, Loader2 } from 'lucide-react';
import { Bus } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BRAND_NAME } from '../constants';

interface BookingConfirmationProps {
  bus: Bus;
  seat: string;
  onDone: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ bus, seat, onDone }) => {
  const bookingId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${BRAND_NAME.replace(/\s+/g, '-')}-Ticket-${bookingId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-100">
          <CheckCircle2 size={48} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-900">Booking Confirmed!</h2>
          <p className="text-gray-500 font-medium">Your ticket has been booked successfully.</p>
        </div>
      </div>

      <div ref={ticketRef} className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-200 relative overflow-hidden">
        {/* Ticket decoration */}
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-r-2 border-dashed border-gray-200" />
        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-l-2 border-dashed border-gray-200" />

        <div className="grid grid-cols-2 gap-8 text-left">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking ID</p>
            <p className="text-lg font-black text-gray-900">#{bookingId}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Operator</p>
            <p className="text-lg font-black text-orange-600">{bus.operator}</p>
          </div>

          <div className="col-span-2 flex items-center gap-4 py-4 border-y border-gray-200 border-dashed">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">From</p>
              <p className="text-xl font-black text-gray-900">{bus.from}</p>
            </div>
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100">
              <BusIcon size={20} className="text-orange-500" />
            </div>
            <div className="flex-1 text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">To</p>
              <p className="text-xl font-black text-gray-900">{bus.to}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</p>
            <div className="flex items-center gap-2 text-gray-900 font-bold">
              <Calendar size={14} className="text-orange-500" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
            <div className="flex items-center gap-2 justify-end text-gray-900 font-bold">
              <Clock size={14} className="text-orange-500" />
              <span>{bus.departureTime}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seat</p>
            <p className="text-2xl font-black text-orange-600">{seat}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
            <p className="text-2xl font-black text-gray-900">${bus.price}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isDownloading ? 'Generating...' : 'Download Ticket'}
        </button>
        <button className="flex-1 bg-white text-gray-900 border-2 border-gray-100 py-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
          <Share2 size={18} /> Share
        </button>
      </div>

      <button
        onClick={onDone}
        className="w-full text-gray-400 font-bold text-sm uppercase tracking-widest hover:text-gray-600 transition-colors"
      >
        Back to Home
      </button>
    </div>
  );
};
