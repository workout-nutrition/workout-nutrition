import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase';
import { usePageSEO } from '../../utils/seo';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  HeartHandshake,
  Dumbbell,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  usePageSEO({
    title: 'About Us – Workout Nutrition | India\'s Authentic Supplement Store',
    description:
      'Learn about Workout Nutrition – India\'s trusted sports supplement store. Authentic, lab-tested products from certified brands. Founded on transparency, quality, and fitness education.',
    keywords: 'about workout nutrition, authentic supplements india, sports nutrition brand, workout nutrition founder',
  });

  const values = [
    { title: 'Authenticity', desc: '100% authorized manufacturer imports with intact holographic verification seals on every unit.' },
    { title: 'Quality', desc: 'Strict climate-controlled warehousing preventing heat degradation of sensitive proteins and peptides.' },
    { title: 'Transparency', desc: 'Real lot numbers, verifiable importer details, and public NABL third-party certificate testing.' },
    { title: 'Customer First', desc: 'Same-day express dispatch, 7-day hassle-free damage replacements, and fair pricing.' },
    { title: 'Fitness Education', desc: 'Evidence-based supplementation advice free of pseudoscience and misleading medical claims.' },
    { title: 'Trust', desc: 'Over 25,000 athletes, powerlifters, and fitness coaches across India trust our daily shipments.' },
  ];

  const whyChooseUsPoints = [
    { title: 'Authentic Products', desc: 'Scratch-code verified on official brand portals.' },
    { title: 'Trusted Brands', desc: 'Optimum Nutrition, MuscleTech, Dymatize, MuscleBlaze, Wellcore & more.' },
    { title: 'Quality Formulations', desc: 'Clinically proven dosages and macro purity.' },
    { title: 'Secure Checkout', desc: '256-bit encrypted payments with UPI & COD support.' },
    { title: 'Fast Delivery', desc: '24–48 hours delivery across Indian metro regions.' },
    { title: 'Customer Support', desc: 'Real sports nutritionists available via WhatsApp and phone.' },
    { title: 'Fitness Guidance', desc: 'Practical supplementation advice suited for your specific goals.' },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 font-body">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">About Workout Nutrition</span>
        </div>

        {/* 1. ABOUT WORKOUT NUTRITION (Brand Story) */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-block bg-red-50 text-red-600 font-body font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
            OUR STORY
          </div>
          <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-zinc-950 uppercase tracking-wide">
            ABOUT WORKOUT NUTRITION
          </h1>
          <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
            Workout Nutrition was established with a singular, uncompromising mandate: to eliminate counterfeit and adulterated sports nutrition supplements from the Indian fitness landscape.
          </p>
          <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
            In an industry frequently saturated by unauthorized parallel imports and diluted proteins, Workout Nutrition operates on a zero-compromise supply chain model. We procure exclusively through authorized national brand representatives, providing genuine, fresh-batch supplements to athletes across India.
          </p>
        </div>

        {/* 2. OUR FOUNDER */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Founder Visual */}
            <div className="md:col-span-5 relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                  alt="Vikramaditya Singhania, Founder"
                  className="w-full h-full object-cover grayscale contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-3 -right-3 bg-red-600 text-white font-body font-semibold text-[10px] px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                FOUNDER & ADVISOR
              </div>
            </div>

            {/* Founder Story */}
            <div className="md:col-span-7 space-y-3">
              <div className="text-xs font-semibold text-red-600 uppercase tracking-wider font-body">
                LEADERSHIP & VISION
              </div>
              <h2 className="font-display font-normal text-3xl sm:text-4xl text-zinc-950 uppercase tracking-wide">
                VIKRAMADITYA SINGHANIA
              </h2>
              <div className="text-xs font-semibold text-zinc-500 font-body">
                Founder & Head of Sports Science
              </div>
              <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed pt-2">
                A former competitive powerlifter and sports nutrition researcher with an MSc in Exercise Physiology, Vikramaditya founded Workout Nutrition in 2019 after witnessing fellow athletes suffer from fraudulent, low-grade imported supplements.
              </p>
              <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                "Our guiding philosophy is simple: if a product cannot be verified with 100% manufacturer traceability and genuine batch testing, it will never enter a Workout Nutrition warehouse."
              </p>
            </div>
          </div>
        </div>

        {/* 3. OUR VALUES */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
              OUR CORE VALUES
            </h2>
            <p className="font-body text-xs sm:text-sm text-zinc-500 font-normal mt-1 leading-relaxed">
              The fundamental principles that govern our brand relationships and operations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/70 hover:border-red-600/40 hover:bg-white transition-all space-y-1.5"
              >
                <div className="font-body font-semibold text-sm text-zinc-900 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>{val.title}</span>
                </div>
                <p className="font-body text-xs text-zinc-600 font-normal leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. OUR MISSION */}
        <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-black text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-[10px] uppercase font-body font-semibold text-red-400 tracking-wider bg-red-600/20 px-2.5 py-1 rounded-full border border-red-500/30">
              OUR MISSION
            </span>
            <h2 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wide">
              FUELING INDIA’S STRONGEST GENERATION
            </h2>
            <p className="font-body text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
              We exist to democratize access to world-class sports nutrition across India. By offering direct manufacturer pricing, zero counterfeit risk, and science-grounded education, we empower lifters, athletes, and fitness enthusiasts to reach their peak physiological potential.
            </p>
          </div>
        </div>

        {/* 5. WHY CHOOSE US? */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <h2 className="font-display font-normal text-3xl sm:text-4xl text-zinc-950 uppercase tracking-wide mb-6">
            WHY CHOOSE WORKOUT NUTRITION?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyChooseUsPoints.map((pt, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-50 border border-zinc-150 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-body font-semibold text-xs text-zinc-900 uppercase">
                    {pt.title}
                  </h4>
                  <p className="font-body text-[11px] text-zinc-500 font-normal mt-0.5 leading-snug">
                    {pt.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. COMMUNITY & TRAINING INTEGRITY - TRUSTED BY NEXT LEVEL FITNESS */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Unified Premium Framed Facility Visual with Embedded Partner Badges */}
            <div className="lg:col-span-6 h-full flex flex-col justify-center">
              <div className="group relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200/90 bg-zinc-950 min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-5 sm:p-6 card-hover cursor-pointer">
                {/* Full Background Facility Image */}
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85"
                  alt="Next Level Fitness gym facility"
                  className="absolute inset-0 w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30 pointer-events-none" />

                {/* Top Overlay: Facility Location & Verification Pill */}
                <div className="relative z-10 flex items-center justify-between text-white text-[11px] gap-2">
                  <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="font-semibold tracking-wide">Sector 119, Balongi, Mohali</span>
                  </div>
                  <span className="bg-red-600/95 backdrop-blur-md text-white font-bold text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                    Verified Facility
                  </span>
                </div>

                {/* Bottom Overlay: Integrated Premium Partner Trust Card */}
                <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-zinc-950/85 backdrop-blur-xl text-white border border-white/15 shadow-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-600/40">
                      <Dumbbell className="w-5 h-5 -rotate-45" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-sm tracking-wider uppercase text-white truncate">
                        NEXT LEVEL FITNESS
                      </div>
                      <div className="text-[11px] text-zinc-300 font-medium">
                        Official Supplement &amp; Nutrition Partner
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-3.5 border-l border-zinc-700/80">
                    <div className="text-xs font-black text-emerald-400 font-mono tracking-tight">100% PURE</div>
                    <div className="text-[10px] text-zinc-400 uppercase font-mono">Tested Batches</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Partnership Details */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wider font-body mb-1.5">
                  COMMUNITY &amp; TRAINING INTEGRITY
                </div>
                <h2 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide leading-none">
                  TRUSTED BY NEXT LEVEL FITNESS
                </h2>
                <p className="font-body text-xs sm:text-sm font-semibold text-zinc-700 mt-1">
                  The Premier Training Facility &amp; Athletic Community
                </p>
              </div>

              <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">
                WORKOUT NUTRITION is proudly associated with and trusted by Next Level Fitness, a leading Indian strength and conditioning gym facility. Next Level Fitness coaches, competitive athletes, and fitness enthusiasts rely on WORKOUT NUTRITION for 100% verified authentic supplements with zero compromises on batch purity.
              </p>

              {/* 4 Bullet Points */}
              <ul className="space-y-2 text-xs text-zinc-700 font-body">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-normal">State-of-the-art powerlifting, bodybuilding &amp; functional training environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-normal">Coach-guided nutrition protocols for members and competing powerlifters</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-normal">Authentic supplement testing and batch inspection before shelf recommendation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="font-normal">Community of dedicated athletes pushing boundaries every single day</span>
                </li>
              </ul>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('shop')}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-semibold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all shadow-md shadow-red-600/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>SHOP FITNESS NUTRITION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigate('contact')}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all cursor-pointer"
                >
                  PARTNERSHIP INQUIRIES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { addToast, navigate } = useStore();
  const [activeView, setActiveView] = useState<'channels' | 'form'>('channels');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  usePageSEO({
    title: 'Contact Us – Workout Nutrition | Supplements Support & Inquiries',
    description:
      'Contact Workout Nutrition for product authenticity queries, order support, wholesale inquiries, or expert supplement stack consultation. Reach us via WhatsApp, email, or phone.',
    keywords: 'contact workout nutrition, supplement support india, authenticity verification, order tracking support',
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'Authenticity & Batch Scratch Code Verification',
    contactMethod: 'WhatsApp',
    orderNumber: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const { data, error } = await supabase.functions.invoke(
      'send-contact-email',
      {
        body: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          inquiry_type: formData.inquiryType,
          preferred_contact_method: formData.contactMethod,
          order_number: formData.orderNumber,
          message: formData.message,
        },
      }
    );

    if (error) {
      console.error('Contact submission error:', error);
      throw new Error('Unable to submit your inquiry. Please try again.');
    }

    if (!data?.success || !data?.saved || !data?.ticket_id) {
      console.error('Unexpected function response:', data);
      throw new Error(
        data?.message || 'Your inquiry could not be saved. Please try again.'
      );
    }

    // Use the actual ticket ID generated by the server
    setTicketId(data.ticket_id);
    setSubmitted(true);

    addToast(
      'Inquiry Submitted',
      data.emailSent
        ? 'Your inquiry has been saved and email notification sent.'
        : 'Your inquiry has been saved, but the email notification failed.',
      'success'
    );
  } catch (err) {
    console.error('Contact form error:', err);

    addToast(
      'Submission Failed',
      err instanceof Error
        ? err.message
        : 'Please try again later.',
      'error'
    );
  }
};
  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-body">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">Contact / Inquiries</span>
        </div>

        {/* 1. Header Card with View Switcher Tabs */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
                CONTACT &amp; BUSINESS INQUIRIES
              </h1>
              <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal mt-2 leading-relaxed">
                Have a question about a product stack, order tracking, bulk procurement, or batch authenticity? Reach our certified nutritionists and support desk.
              </p>
            </div>

            {/* View Switcher: Contact Directory vs. Dedicated Inquiry Form */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-zinc-100 border border-zinc-200 self-start md:self-auto shrink-0 shadow-2xs">
              <button
                onClick={() => setActiveView('channels')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'channels'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-zinc-700 hover:text-black hover:bg-white/60'
                }`}
              >
                Official Contact List
              </button>
              <button
                onClick={() => setActiveView('form')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeView === 'form'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-zinc-700 hover:text-black hover:bg-white/60'
                }`}
              >
                Inquiry Ticket Form
              </button>
            </div>
          </div>
        </div>

        {/* 2. Standalone Contact List Card (Displayed exclusively when activeView === 'channels') */}
        {activeView === 'channels' && (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1 font-body">
                  DIRECT ASSISTANCE
                </div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-zinc-950 uppercase tracking-tight">
                  OFFICIAL CONTACT CHANNELS
                </h2>
              </div>
              <span className="text-[11px] text-zinc-500 font-medium bg-zinc-50 border border-zinc-200/80 px-3 py-1 rounded-full self-start sm:self-auto">
                Direct Contact Directory
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-zinc-700">
              {/* Phone Support */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3.5 hover:border-red-600/40 hover:bg-white transition-all card-hover">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-[13px]">Phone Support</div>
                  <div className="text-zinc-900 mt-0.5 font-bold text-sm">+91-8264325436</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Toll-free customer hotline</div>
                  <a
                    href="tel:+918264325436"
                    className="inline-block mt-2 text-[11px] font-bold text-red-600 hover:text-red-700 underline"
                  >
                    Call Now →
                  </a>
                </div>
              </div>

              {/* Email Address */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3.5 hover:border-red-600/40 hover:bg-white transition-all card-hover">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-[13px]">Email Address</div>
                  <div className="text-zinc-900 mt-0.5 font-bold truncate">workoutnutrition.inquires@gmail.com</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Replies within 4 business hours</div>
                  <a
                    href="mailto:workoutnutrition.inquires@gmail.com"
                    className="inline-block mt-2 text-[11px] font-bold text-red-600 hover:text-red-700 underline"
                  >
                    Send Email →
                  </a>
                </div>
              </div>

              {/* WhatsApp Helpdesk */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3.5 hover:border-emerald-600/40 hover:bg-white transition-all card-hover">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <MessageCircle className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-zinc-900 text-[13px]">WhatsApp Helpdesk</div>
                  <div className="text-zinc-900 mt-0.5 font-bold text-sm">+91-8264325436</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Direct Nutritionist Chat (Fastest)</div>
                  <a
                    href="https://wa.me/918264325436"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Open Chat →
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3.5 hover:border-red-600/40 hover:bg-white transition-all card-hover">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[13px]">Business Hours</div>
                  <div className="text-zinc-800 mt-0.5 font-bold">Monday – Saturday</div>
                  <div className="text-[10.5px] text-zinc-500 mt-0.5">10:00 AM – 8:00 PM IST</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Support Desk Currently Active</span>
                  </div>
                </div>
              </div>

              {/* Registered Shop & Dispatch Address */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-start gap-3.5 hover:border-red-600/40 hover:bg-white transition-all card-hover md:col-span-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-[13px]">Registered Shop &amp; Dispatch Address</div>
                  <div className="text-zinc-800 mt-0.5 font-medium leading-relaxed">
                    PMHW+3RX, Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055
                  </div>
                  <a
                    href="https://maps.google.com/?q=Sector+119+Balongi+Punjab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-[11px] font-bold text-red-600 hover:text-red-700 underline"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Urgent Stack Advice WhatsApp Callout Banner */}
            <div className="p-4 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950 text-xs sm:text-sm">Need urgent stack advice?</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Chat with our certified sports nutritionist on WhatsApp right now</div>
                </div>
              </div>
              <a
                href="https://wa.me/918264325436?text=Hi%20Workout%20Nutrition,%20I%20need%20urgent%20supplement%20advice"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 text-center"
              >
                WhatsApp Chat
              </a>
            </div>

            {/* Switch to Separated Inquiry Form Prompt */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-50/80 p-4 rounded-2xl">
              <div>
                <div className="font-bold text-xs text-zinc-900">Looking to file an official verification ticket?</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Submit batch codes, order claims, or wholesale inquiries via our dedicated form.</div>
              </div>
              <button
                onClick={() => setActiveView('form')}
                className="bg-zinc-900 hover:bg-black text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                Open Inquiry Ticket Form →
              </button>
            </div>
          </div>
        )}

        {/* 3. Separated Inquiry & Batch Verification Form (Only displayed when activeView === 'form') */}
        {activeView === 'form' && (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-zinc-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1 font-body">
                  ONLINE INQUIRIES
                </div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-zinc-950 uppercase tracking-tight">
                  SEND AN INQUIRY OR BATCH VERIFICATION REQUEST
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Fill out the form below and our team will get back to you with detailed resolution and guidance.
                </p>
              </div>
              <button
                onClick={() => setActiveView('channels')}
                className="text-xs font-bold text-red-600 hover:text-red-700 underline self-start sm:self-auto cursor-pointer"
              >
                ← Back to Contact Directory
              </button>
            </div>

            <div>
              {submitted ? (
                <div className="p-8 bg-emerald-50/80 border border-emerald-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
                      TICKET {ticketId}
                    </span>
                    <h3 className="font-heading font-bold text-xl text-zinc-950 uppercase mt-3">
                      Your inquiry has been logged successfully
                    </h3>
                    <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed mt-2">
                      Our certified sports nutritionists and support desk have received your request for <strong>{formData.fullName}</strong>. A specialist will contact you via <strong>{formData.contactMethod}</strong> within 2 to 4 business hours.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/918264325436?text=Hi%20Workout%20Nutrition,%20I%20have%20inquiry%20ticket%20${ticketId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                    >
                      Instant WhatsApp Chat
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full sm:w-auto text-xs font-bold text-zinc-600 hover:text-black py-3 px-4 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs max-w-3xl">
                  <div>
                    <label className="font-semibold text-zinc-800 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white text-zinc-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-zinc-800 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@example.com"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white text-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-800 block mb-1">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91-8264325436"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white text-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-zinc-800 block mb-1">Inquiry Category *</label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white font-medium text-zinc-900"
                      >
                        <option value="Authenticity & Batch Scratch Code Verification">Authenticity &amp; Batch Scratch Code</option>
                        <option value="Certified Nutritionist Stack Consultation">Nutritionist Stack Consultation</option>
                        <option value="Order Status & Express Tracking">Order Tracking &amp; Dispatch</option>
                        <option value="Gym / Academy Bulk Procurement & Wholesale">Gym / Trainer Bulk Procurement</option>
                        <option value="Next Level Fitness Partnership">Next Level Fitness Partnership</option>
                        <option value="Return, Transit Damage or Replacement Claim">Damage or Replacement Claim</option>
                        <option value="General Inquiries">General Inquiries</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-zinc-800 block mb-1">Preferred Contact Method</label>
                      <select
                        name="contactMethod"
                        value={formData.contactMethod}
                        onChange={handleChange}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white font-medium text-zinc-900"
                      >
                        <option value="WhatsApp">WhatsApp (Fastest Response)</option>
                        <option value="Direct Call">Direct Phone Call</option>
                        <option value="Email">Email Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-800 block mb-1">Product Name or Order ID (Optional)</label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      placeholder="e.g. Optimum Gold Whey 2kg or Order IF-89241"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-800 block mb-1">Message Details *</label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your stack requirement, batch verification request, or wholesale inquiry in detail..."
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 outline-none focus:border-red-600 focus:bg-white text-zinc-900"
                    />
                  </div>

                  {/* Guaranteed SLA Note */}
                  <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl text-[11px] text-zinc-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <span>⚡ Certified sports nutritionists typically reply in under 2 hours during active business hours.</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
                    >
                      SUBMIT INQUIRY
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('channels')}
                      className="w-full sm:w-auto text-zinc-600 hover:text-black font-semibold text-xs py-3.5 px-4 cursor-pointer"
                    >
                      Cancel &amp; View Contact Numbers
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  usePageSEO({
    title: 'FAQs – Workout Nutrition | Supplement Authenticity, Delivery & Returns',
    description:
      'Get answers to frequently asked questions about product authenticity verification, delivery timelines, Cash on Delivery, returns, and banned substance testing at Workout Nutrition.',
    keywords: 'workout nutrition faq, supplement authenticity questions, delivery india, return policy supplements',
  });

  const faqs = [
    {
      q: 'How can I verify the authenticity of supplements bought on IronForge?',
      a: 'Every tub and bottle has an intact scratch code hologram from official authorized Indian importers (such as Glanbia India, MuscleTech India, Bright Commodities). You can scratch and verify the code on the official importer website or via automated SMS.',
    },
    {
      q: 'What are the delivery timelines across India?',
      a: 'We deliver within 24 to 48 hours in tier-1 metro cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai). Tier-2 and tier-3 locations are reached within 3 to 5 business days via Delhivery Express or BlueDart.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across 19,000+ PIN codes in India. You can pay cash or scan the courier’s UPI QR upon receiving your parcel.',
    },
    {
      q: 'What is your return and refund policy?',
      a: 'If a product is received damaged or with a broken seal, we provide an immediate free replacement or 100% full refund within 7 days of delivery.',
    },
    {
      q: 'Are your supplements batch tested for banned substances?',
      a: 'Yes. Brands in our catalog such as Optimum Nutrition, Dymatize, and Applied Nutrition carry Informed-Choice or Informed-Sport certifications testing against WADA banned compounds.',
    },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-zinc-950 uppercase tracking-tight mb-2">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-sm text-zinc-600 mb-6">
            Find fast answers regarding shipping, scratch verification, and quality assurances.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-zinc-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-4 text-left font-heading font-bold text-sm text-zinc-900 flex items-center justify-between gap-4 bg-zinc-50/60 hover:bg-zinc-100/60 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform ${
                      openIndex === idx ? 'rotate-180 text-red-600' : ''
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="p-4 text-xs sm:text-sm text-zinc-600 leading-relaxed bg-white border-t border-zinc-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{ type: 'shipping' | 'return' | 'terms' }> = ({ type }) => {
  const pageSEO = {
    shipping: {
      title: 'Shipping & Delivery Policy – Workout Nutrition | Pan-India Fast Delivery',
      description: 'Workout Nutrition ships all orders within 24 hours. Free shipping on orders above ₹999. Delivered via Delhivery, BlueDart & DTDC across India.',
      keywords: 'workout nutrition shipping policy, free delivery india, supplement delivery time',
    },
    return: {
      title: 'Returns & Authenticity Guarantee – Workout Nutrition | 7-Day Returns',
      description: 'Workout Nutrition guarantees 100% product authenticity. Damaged or tamper-evident seal broken products replaced free within 7 days of delivery.',
      keywords: 'workout nutrition return policy, supplement authenticity guarantee, damaged product return',
    },
    terms: {
      title: 'Terms of Service & Privacy Policy – Workout Nutrition India',
      description: 'Read Workout Nutrition\'s terms of service and privacy policy. Your personal data is safe, payments are secure, and we do not sell your information.',
      keywords: 'workout nutrition terms, privacy policy supplements india',
    },
  };

  usePageSEO(pageSEO[type]);

  return (
    <div className="bg-zinc-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
          {type === 'shipping' && (
            <>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 uppercase">
                SHIPPING & DELIVERY POLICY
              </h1>
              <p>
                All orders are processed and dispatched within 24 hours from our climate-controlled fulfillment facilities in New Delhi and Mumbai.
              </p>
              <h3 className="font-heading font-bold text-base text-zinc-900">Free Shipping Threshold</h3>
              <p>
                Orders with a subtotal of ₹999 or higher qualify for Free Express Shipping Pan-India. Orders below ₹999 incur a flat ₹99 logistics fee.
              </p>
              <h3 className="font-heading font-bold text-base text-zinc-900">Courier Partners</h3>
              <p>We work exclusively with Tier-1 logistics partners including Delhivery, BlueDart, and DTDC.</p>
            </>
          )}

          {type === 'return' && (
            <>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 uppercase">
                AUTHENTICITY GUARANTEE & RETURNS
              </h1>
              <p>
                At IronForge Nutrition, authenticity is non-negotiable. Every supplement is shipped with manufacturer tamper-evident seals intact.
              </p>
              <h3 className="font-heading font-bold text-base text-zinc-900">7-Day Transit Damage Returns</h3>
              <p>
                If your tub or shaker arrives damaged or unsealed, notify us within 7 days of delivery with parcel photos. A free replacement will be dispatched within 24 hours.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-zinc-950 uppercase">
                TERMS OF SERVICE & PRIVACY
              </h1>
              <p>
                Welcome to IronForge Nutrition India. By accessing our platform or purchasing products, you agree to our fair terms of use and secure transaction agreements.
              </p>
              <h3 className="font-heading font-bold text-base text-zinc-900">Privacy Assurance</h3>
              <p>
                We do not sell, rent, or trade your personal email, phone number, or delivery addresses with third-party advertisers. All payment gateways are PCI-DSS Level 1 compliant.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
