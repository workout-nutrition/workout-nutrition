import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Send,
  CheckCircle2,
  MessageCircle,
  Clock,
} from 'lucide-react';

interface ContactFormProps {
  initialGoal?: string;
  initialPlan?: string;
}

export const ContactFormSection: React.FC<ContactFormProps> = ({
  initialGoal = 'General Fitness',
  initialPlan = '',
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState(initialGoal);
  const [message, setMessage] = useState(
    initialPlan
      ? `I am enquiring regarding the ${initialPlan} package.`
      : ''
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Sync if initialGoal changes from external click
  React.useEffect(() => {
    if (initialGoal) {
      setFitnessGoal(initialGoal);
    }
  }, [initialGoal]);

  React.useEffect(() => {
    if (initialPlan) {
      setMessage(
        `I am enquiring regarding the ${initialPlan} membership tier.`
      );
    }
  }, [initialPlan]);

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = 'Please provide a valid 10-digit mobile number.';
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      errs.email = 'Please provide a valid email address.';
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  // Submit enquiry to Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(
        'https://formspree.io/f/xgaoejdk',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            fullName,
            phone,
            email,
            fitnessGoal,
            message,
          }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert(
          'Unable to send enquiry. Please try again.'
        );
      }
    } catch (error) {
      console.error('Form submission error:', error);

      alert(
        'Something went wrong. Please check your internet connection and try again.'
      );
    } finally {
      setIsSending(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Next Level Fitness, I would like to join/enquire.

Name: ${fullName || 'Interested Member'}
Phone: ${phone}
Goal: ${fitnessGoal}
Message: ${
      message || 'Please share membership details'
    }`
  );

  return (
    <section
      id="contact"
      className="py-20 lg:py-28 bg-(--brand-bg) border-b border-(--brand-border) transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />

            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#D91B24]">
              GET IN TOUCH
            </span>

            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            READY TO START?
          </h2>

          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Take the first step toward your fitness transformation.
            Leave your details below and our team will get back to you
            shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">

          {/* LEFT: Quick Contact Information */}
          <div className="lg:col-span-5 text-left">
            <div className="card-theme rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm border border-neutral-200/80 dark:border-neutral-800">

              <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white border-b border-neutral-200/80 dark:border-neutral-800 pb-3 tracking-wide">
                DIRECT CONTACT CHANNELS
              </h3>

              <div className="space-y-4">

                {/* Call Us */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800 text-[#D91B24] flex items-center justify-center shrink-0 border border-red-100 dark:border-neutral-700">
                    <Phone className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                      CALL US
                    </span>

                    <a
                      href="tel:+918264325436"
                      className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white hover:text-[#D91B24] transition-colors mt-0.5 block"
                    >
                      +91-8264325436
                    </a>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                      Available during gym hours: 06:00 AM &ndash; 10:00 PM
                    </p>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                    <MessageCircle className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                      INSTANT CHAT
                    </span>

                    <a
                      href="https://wa.me/918264325436?text=Hello%20Next%20Level%20Fitness%2C%20I%20am%20interested%20in%20joining%20the%20gym."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white hover:text-emerald-500 transition-colors block mt-0.5"
                    >
                      Chat on WhatsApp (+91-8264325436)
                    </a>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                      Quick answers regarding membership packages & walk-in tours
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800 text-[#D91B24] flex items-center justify-center shrink-0 border border-red-100 dark:border-neutral-700">
                    <Mail className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                      EMAIL ADDRESS
                    </span>

                    <a
                      href="mailto:workoutnutrition.inquires@gmail.com"
                      className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:text-[#D91B24] transition-colors inline-block mt-0.5"
                    >
                      workoutnutrition.inquires@gmail.com
                    </a>

                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                      Official enquiries & membership support desk
                    </p>
                  </div>
                </div>

                {/* Training Hours */}
                <div className="flex items-start gap-3.5 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 text-[#D91B24]">
                    <Clock className="w-4 h-4" />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                      TRAINING SCHEDULE
                    </span>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium mt-0.5">
                      Open 7 Days &middot; 06:00 AM to 10:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Walk-in Tours */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-850 border border-neutral-200/80 dark:border-neutral-750 text-left space-y-1">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D91B24] font-heading block">
                  WALK-IN TOURS WELCOME
                </span>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  Visit anytime during gym hours to inspect our machinery,
                  meet our trainers, and experience the workout floor firsthand.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Enquiry Form */}
          <div className="lg:col-span-7 card-theme rounded-2xl p-6 sm:p-8 text-left shadow-sm border border-neutral-200 dark:border-neutral-800">

            {isSubmitted ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">

                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white">
                  ENQUIRY RECEIVED!
                </h3>

                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your enquiry for{' '}
                  <em>{fitnessGoal}</em> has been recorded.
                  Our team will contact you shortly at{' '}
                  <strong>{phone}</strong>.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">

                  <a
                    href={`https://wa.me/918264325436?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BE5C] text-white font-heading text-xs font-bold uppercase tracking-wider shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send details to WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                      setFitnessGoal(initialGoal);
                      setErrors({});
                    }}
                    className="px-5 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-heading text-xs font-bold uppercase tracking-wider hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>

                </div>
              </div>
            ) : (
              <form
                action="https://formspree.io/f/xgaoejdk"
                method="POST"
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-5"
                noValidate
              >

                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                  <h3 className="font-heading text-lg font-semibold text-neutral-900 dark:text-white">
                    SEND AN ENQUIRY
                  </h3>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                    Leave your contact details and our training team will reach out to you.
                  </p>
                </div>

                {/* Name + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-heading block">
                      Full Name <span className="text-[#D91B24]">*</span>
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jaspreet Singh"
                      className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-850 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D91B24] transition-all ${
                        errors.fullName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    />

                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-heading block">
                      Phone Number <span className="text-[#D91B24]">*</span>
                    </label>

                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500 dark:text-neutral-400 font-mono">
                        +91
                      </span>

                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="82643 25436"
                        className={`w-full pl-12 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-850 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D91B24] transition-all ${
                          errors.phone
                            ? 'border-red-500 bg-red-50/20'
                            : 'border-neutral-300 dark:border-neutral-700'
                        }`}
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email + Goal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-heading block">
                      Email Address{' '}
                      <span className="text-neutral-400 font-normal">
                        (Optional)
                      </span>
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.name@example.com"
                      className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-850 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D91B24] transition-all ${
                        errors.email
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-neutral-300 dark:border-neutral-700'
                      }`}
                    />

                    {errors.email && (
                      <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Fitness Goal */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-heading block">
                      Fitness Goal <span className="text-[#D91B24]">*</span>
                    </label>

                    <select
                      name="fitnessGoal"
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D91B24] transition-all cursor-pointer"
                    >
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Building">
                        Muscle Building
                      </option>
                      <option value="Strength">Strength</option>
                      <option value="General Fitness">
                        General Fitness
                      </option>
                      <option value="Cardio">Cardio</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Personal Training">
                        Personal Training
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-heading block">
                    Your Message / Query
                  </label>

                  <textarea
                    name="message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your fitness targets, preferred hours, or ask questions about memberships..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-850 border border-neutral-300 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D91B24] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSending}
                    className={`w-full py-3.5 rounded-xl font-heading text-sm font-bold uppercase tracking-wider text-white bg-[#D91B24] hover:bg-[#B8141D] active:scale-98 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                      isSending
                        ? 'opacity-70 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                  >
                    {isSending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND ENQUIRY</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 text-center">
                  Your information is kept confidential. We will only contact you regarding your fitness enquiry.
                </p>

              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};