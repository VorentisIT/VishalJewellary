import React from 'react';
import { ShieldCheck, Truck, Gift, RefreshCw, Headset } from 'lucide-react';
import { motion } from 'framer-motion';

const promises = [
  { icon: ShieldCheck, title: 'Hallmarked Gold', subtitle: 'Certified purity' },
  { icon: Truck, title: 'Insured Delivery', subtitle: 'Safe and secure' },
  { icon: Gift, title: 'Luxury Packaging', subtitle: 'For memorable moments' },
  { icon: RefreshCw, title: 'Lifetime Exchange', subtitle: 'Hassle-free' },
  { icon: Headset, title: 'Dedicated Support', subtitle: 'Here to help', span: true }
];

export default function ServicePromises() {
  return (
    <section className="bg-[#F8F5EE] py-6 sm:py-8 border-b border-[#DED8CC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          {promises.map((p, idx) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className={`space-y-1.5 flex flex-col items-center p-2 rounded cursor-default ${p.span ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className="p-2.5 rounded-full bg-[#FFF5EB] border border-[#D96B27]/20 shadow-xs mb-1">
                  <Icon className="w-6 h-6 text-[#D96B27] stroke-[1.4]" />
                </div>
                <h4 className="font-serif text-xs font-bold uppercase tracking-widest text-[#202522]">
                  {p.title}
                </h4>
                <p className="text-[10px] text-[#77736B]">{p.subtitle}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
