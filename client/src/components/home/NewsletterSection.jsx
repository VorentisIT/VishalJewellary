import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-ivory py-8 sm:py-10 border-b border-warm-border">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-2">
            Be the First to Know
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed font-light">
            Join our community for exclusive previews, special offers, and jewellery stories.
          </p>
        </div>

        {subscribed ? (
          <p className="text-xs font-semibold text-emerald-800 bg-emerald-100 p-3 max-w-md mx-auto border border-emerald-200">
            Thank you for subscribing to AURÉLIA Fine Jewellery.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white border border-warm-border p-3.5 text-xs text-charcoal placeholder:text-charcoal-muted focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#D96B27] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 hover:bg-[#B85517] transition-all shadow-md shadow-[#D96B27]/25 flex-shrink-0"
            >
              SUBSCRIBE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
