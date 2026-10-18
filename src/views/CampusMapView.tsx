import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Calendar,
  Compass,
  Check,
  X,
  MessageSquare,
  Clock,
  Globe,
  Truck,
  Navigation,
  Layers,
  Sparkles,
  Search
} from 'lucide-react';
import { CountryInfo } from '../data/countries';

interface CampusMapViewProps {
  userCountry?: CountryInfo;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({ userCountry }) => {
  const [activeTab, setActiveTab] = useState<'campus_map' | 'global_delivery' | 'coaches'>('campus_map');
  const [selectedSpot, setSelectedSpot] = useState<string | null>('spot1');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCoach, setSelectedCoach] = useState<any | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const campusHotspots = [
    {
      id: 'spot1',
      name: 'Varsity Recreation Center',
      category: 'gym',
      type: 'Indoor Barbell Gym',
      distance: '3 min walk from Quad',
      currentOccupancy: '42% (Quiet)',
      amenities: ['12 Power Cages', 'Olympic Platforms', 'Dumbbells up to 120lbs', 'Locker Showers'],
      openHours: '6:00 AM – 11:00 PM',
      x: 35,
      y: 45,
      color: '#10b981',
    },
    {
      id: 'spot2',
      name: 'Campus Calisthenics & Street Park',
      category: 'calisthenics',
      type: 'Outdoor Arena',
      distance: '5 min walk near North Lawn',
      currentOccupancy: '18% (Open)',
      amenities: ['Parallel Dip Bars', 'Multi-Height Pull-up Bars', 'Swedish Wall', 'Turf Sprint Zone'],
      openHours: '24/7 Open Access',
      x: 68,
      y: 32,
      color: '#06b6d4',
    },
    {
      id: 'spot3',
      name: 'Olympic 400m Stadium Track',
      category: 'track',
      type: 'Running Track & Bleachers',
      distance: '8 min walk near Sports Complex',
      currentOccupancy: '55% (Moderate)',
      amenities: ['8-Lane All-Weather Track', 'Bleacher Sprint Stairs', 'Infield Turf', 'Timing Sensors'],
      openHours: '5:30 AM – 10:00 PM',
      x: 25,
      y: 72,
      color: '#f59e0b',
    },
    {
      id: 'spot4',
      name: 'Zen Mobility & Sun Salutation Lawn',
      category: 'recovery',
      type: 'Outdoor Grass',
      distance: '2 min walk behind Science Quad',
      currentOccupancy: '12% (Peaceful)',
      amenities: ['Shaded Pine Trees', 'Soft Bermuda Grass', 'Quiet Zone for Breathing & Yoga'],
      openHours: 'Sunrise to Sunset',
      x: 78,
      y: 68,
      color: '#a855f7',
    },
    {
      id: 'spot5',
      name: 'ZYRO Nutrition Hub & Protein Bar',
      category: 'nutrition',
      type: 'Campus Dining Depot',
      distance: '1 min walk from Student Union',
      currentOccupancy: '30% (Smooth)',
      amenities: ['Fresh Whey Isolate Shakes', 'Whole Meal Prep Bowls', 'Electrolyte Refill Station'],
      openHours: '7:00 AM – 9:00 PM',
      x: 50,
      y: 52,
      color: '#10b981',
    },
    {
      id: 'spot6',
      name: 'Global Express Logistics Depot',
      category: 'logistics',
      type: 'Worldwide Courier Terminal',
      distance: 'Campus Gate West',
      currentOccupancy: 'Active Dispatch',
      amenities: ['Worldwide Tracked Dispatch', 'COD Cashier Counter', 'Dorm Parcel Lockers'],
      openHours: '8:00 AM – 8:00 PM',
      x: 18,
      y: 28,
      color: '#ec4899',
    },
  ];

  const globalDeliveryHubs = [
    { continent: 'Asia & Middle East', hubs: ['Mumbai Central', 'Dubai Air Terminal', 'Tokyo Haneda', 'Singapore Changi'], transit: '2-4 days' },
    { continent: 'North America', hubs: ['Chicago Central', 'New York JFK Hub', 'Los Angeles Air', 'Toronto Gateway'], transit: '1-3 days' },
    { continent: 'Europe & UK', hubs: ['Frankfurt Cargo', 'London Heathrow Express', 'Paris Charles de Gaulle', 'Amsterdam Schiphol'], transit: '2-3 days' },
    { continent: 'South America', hubs: ['São Paulo Guarulhos', 'Buenos Aires Transit', 'Bogota Gateway'], transit: '3-6 days' },
    { continent: 'Africa', hubs: ['Lagos Air Terminal', 'Johannesburg OR Tambo', 'Cairo Cargo Express'], transit: '3-6 days' },
    { continent: 'Oceania', hubs: ['Sydney Air Freight', 'Melbourne Hub', 'Auckland Depot'], transit: '3-5 days' },
  ];

  const verifiedCoaches = [
    {
      id: 'c1',
      name: 'Marcus Vance',
      year: 'Senior • Kinesiology & Biomechanics',
      specialty: 'Barbell Form, Powerlifting & Hip Mobility',
      rating: 4.9,
      reviews: 64,
      hourlyRate: 'Free Student Peer Buddy',
      verifiedCredentials: 'CSCS Candidate & Campus Lead Trainer',
      bio: 'Helping students build bulletproof squat depth and injury-free deadlifts without sacrificing GPA.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'c2',
      name: 'Elena Rostova',
      year: 'Junior • Exercise Physiology',
      specialty: 'Calisthenics, Dorm Workouts & Core Strength',
      rating: 5.0,
      reviews: 48,
      hourlyRate: 'Free Student Peer Buddy',
      verifiedCredentials: 'Certified Gymnastics Instructor',
      bio: 'Master your bodyweight! Doorway pullups, pistol squats, and handstands in 20 minutes a day.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const activeSpotData = campusHotspots.find((s) => s.id === selectedSpot) || campusHotspots[0];

  const filteredSpots = campusHotspots.filter((s) => {
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#121915] via-[#101412] to-[#0a0f0c] border border-emerald-500/30 p-4 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
                Campus & Global Map
              </h1>
              <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Neat & Clean Topography
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Interactive high-contrast vector map of all training grounds, nutrition depots, and worldwide express shipping network delivering to every part of the world.
            </p>
          </div>

          {userCountry && (
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#141b16] border border-emerald-500/30 text-xs text-gray-200">
              <Truck size={14} className="text-emerald-400" />
              <span>
                Active Delivery to: <strong>{userCountry.name} {userCountry.flag}</strong>
              </span>
            </div>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="flex p-1 bg-black/40 rounded-2xl border border-white/5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('campus_map')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'campus_map' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Clean Campus Training Map
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('global_delivery')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'global_delivery' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Worldwide Delivery (Every Country)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coaches')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'coaches' ? 'bg-emerald-500 text-black shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Peer Coaches & Form Spotters
          </button>
        </div>
      </div>

      {activeTab === 'campus_map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Clean Vector SVG Interactive Map (Col 7) */}
          <div className="lg:col-span-7 bg-[#0c100d] border border-emerald-500/30 rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/5 text-xs">
              <div className="flex items-center gap-2">
                <Compass size={15} className="text-emerald-400" />
                <span className="font-black text-white uppercase tracking-wider">
                  Varsity Quad Vector Stage
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live GPS Sensor Network Active</span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { id: 'all', label: 'All Zones' },
                { id: 'gym', label: 'Gyms' },
                { id: 'calisthenics', label: 'Calisthenics' },
                { id: 'track', label: 'Tracks' },
                { id: 'nutrition', label: 'Nutrition' },
                { id: 'logistics', label: 'Logistics' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFilter(f.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                    selectedFilter === f.id
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* High-Contrast Crisp Vector SVG Stage */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#080c09] border border-emerald-950/80 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Aesthetic Grid lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="campusGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.08" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#campusGrid)" />

                {/* Campus Paths & Lawns */}
                <path
                  d="M 50 100 Q 50 50 90 20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeOpacity="0.15"
                  strokeLinecap="round"
                />
                <path
                  d="M 10 50 Q 50 50 90 80"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeOpacity="0.15"
                  strokeLinecap="round"
                />

                {/* Central Circle Plaza */}
                <circle cx="50%" cy="50%" r="45" fill="#10b981" fillOpacity="0.04" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 4" />
                <circle cx="50%" cy="50%" r="12" fill="#10b981" fillOpacity="0.1" />

                {/* Track Oval vector representation */}
                <ellipse cx="25%" cy="72%" rx="35" ry="18" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeOpacity="0.3" strokeDasharray="3 3" />
              </svg>

              {/* Hotspot Pins */}
              {filteredSpots.map((spot) => {
                const isSelected = selectedSpot === spot.id;

                return (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setSelectedSpot(spot.id)}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 cursor-pointer focus:outline-none"
                  >
                    <div
                      className={`relative flex items-center justify-center transition-all ${
                        isSelected ? 'scale-125' : 'hover:scale-110'
                      }`}
                    >
                      {/* Outer pulse */}
                      <span
                        className="absolute w-8 h-8 rounded-full animate-ping opacity-30"
                        style={{ backgroundColor: spot.color }}
                      />
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-black font-black text-xs shadow-lg border-2 border-white/80"
                        style={{ backgroundColor: spot.color }}
                      >
                        <MapPin size={12} className="text-black fill-black" />
                      </div>
                    </div>

                    {/* Tooltip Label */}
                    <div
                      className={`absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap shadow-md pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-white text-black font-black opacity-100'
                          : 'bg-black/80 text-gray-300 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {spot.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>Click any pin to inspect occupancy & equipment</span>
              <span className="text-emerald-400 font-bold">100% Student Verified</span>
            </div>
          </div>

          {/* Hotspot Info Panel (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#101411] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                    {activeSpotData.type}
                  </span>
                  <h3 className="text-lg font-black text-white">{activeSpotData.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">Occupancy</span>
                  <span className="text-xs font-black text-emerald-400">{activeSpotData.currentOccupancy}</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-emerald-400" /> Operating Hours:
                  </span>
                  <span className="font-bold text-white">{activeSpotData.openHours}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-gray-400 flex items-center gap-1.5">
                    <Navigation size={13} className="text-cyan-400" /> Distance from Quad:
                  </span>
                  <span className="font-bold text-white">{activeSpotData.distance}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-200 block">Equipment & Amenities Available:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeSpotData.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#141b16] border border-emerald-950 text-xs text-gray-300 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => alert(`Starting turn-by-turn navigation to ${activeSpotData.name}...`)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Navigation size={14} />
                <span>Start Walking Navigation</span>
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === 'global_delivery' ? (
        /* Global Worldwide Delivery Network */
        <div className="space-y-5">
          <div className="bg-[#0f1411] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 pb-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Worldwide Delivery to Every Single Part of the World</h3>
                <p className="text-xs text-gray-400">
                  Guaranteed air courier dispatch with full customs clearance and Cash on Delivery across 240+ countries and territories.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {globalDeliveryHubs.map((hub, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      {hub.continent}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded-full">
                      {hub.transit}
                    </span>
                  </div>

                  <div className="text-xs text-gray-300 space-y-1">
                    <span className="text-[11px] text-gray-500 block">Major Distribution Hubs:</span>
                    <div className="flex flex-wrap gap-1">
                      {hub.hubs.map((h, hIdx) => (
                        <span key={hIdx} className="bg-[#141c16] px-2 py-0.5 rounded-md text-[10px] text-white">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <Check size={13} />
                    <span>COD & Tracked Doorstep Delivery Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Coaches View */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {verifiedCoaches.map((coach) => (
            <div
              key={coach.id}
              className="p-5 rounded-3xl bg-[#111612] border border-emerald-900/40 space-y-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coach.avatar}
                  alt={coach.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-emerald-500/30"
                />
                <div>
                  <h4 className="text-base font-bold text-white">{coach.name}</h4>
                  <span className="text-xs text-gray-400 block">{coach.year}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                    <Star size={12} className="fill-amber-400" /> {coach.rating} ({coach.reviews} student sessions)
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">{coach.bio}</p>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-black text-emerald-400">{coach.hourlyRate}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCoach(coach);
                    setBookingSuccess(true);
                    setTimeout(() => setBookingSuccess(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-colors cursor-pointer"
                >
                  {bookingSuccess && selectedCoach?.id === coach.id ? 'Requested!' : 'Book Free Buddy'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
