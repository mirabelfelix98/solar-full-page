import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, MapPin, Clock, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

declare global {
  interface Window {
    fbq: any;
  }
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const heroImgRef = useRef<HTMLImageElement>(null);
  const parallaxRef = useRef({ mouseX: 0, mouseY: 0, currentX: 0, currentY: 0 });

  // Handle Scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      
      // Active Section Highlighting
      const sections = ['hero', 'problem', 'solution', 'products', 'feature', 'testimonials', 'cta', 'trust', 'cac', 'guarantee'];
      let current = 'hero';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reveal Animation & Count Up
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Count up logic if it has data-count
          const countEl = entry.target.querySelector('[data-count]');
          if (countEl) {
            const targetValue = parseInt(countEl.getAttribute('data-count') || '0');
            let startValue = 0;
            const duration = 2000;
            const increment = targetValue / (duration / 16);
            
            const counter = setInterval(() => {
              startValue += increment;
              if (startValue >= targetValue) {
                (countEl as HTMLElement).innerText = targetValue + '+';
                clearInterval(counter);
              } else {
                (countEl as HTMLElement).innerText = Math.floor(startValue).toString();
              }
            }, 16);
          }
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  // Mouse Parallax
  useEffect(() => {
    if (window.innerWidth <= 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      parallaxRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
      parallaxRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
    };

    let animationFrameId: number;
    const animate = () => {
      const { mouseX, mouseY, currentX, currentY } = parallaxRef.current;
      parallaxRef.current.currentX += (mouseX - currentX) * 0.05;
      parallaxRef.current.currentY += (mouseY - currentY) * 0.05;

      if (heroImgRef.current) {
        heroImgRef.current.style.transform = `scale(1.1) translate(${parallaxRef.current.currentX}px, ${parallaxRef.current.currentY}px)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  const trackEvent = (eventName: string, params?: any) => {
    if (window.fbq) {
      window.fbq('track', eventName, params);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-5 left-1/2 -translate-x-1/2 w-[min(1100px,92vw)] backdrop-blur-xl border border-[rgba(200,140,30,0.15)] rounded-[60px] shadow-[0_4px_30px_rgba(200,130,0,0.12)] z-[1000] flex items-center justify-between px-6 py-3 transition-all duration-400 ${isScrolled ? 'bg-[rgba(254,250,243,0.97)] top-[10px]' : 'bg-[rgba(254,250,243,0.85)]'}`}>
        <a href="#hero" className="font-serif font-bold text-[1.2rem] text-[var(--charcoal)]">
          02<span className="text-[var(--sun)]">Best</span> Solar
        </a>
        <div className="hidden gap-6">
          {['problem', 'solution', 'products', 'testimonials', 'cac', 'contact'].map((id) => (
            <a 
              key={id}
              href={`#${id}`} 
              className={`text-[0.85rem] font-medium transition-colors duration-300 ${activeSection === id ? 'text-[var(--sun)]' : 'text-[var(--text)] hover:text-[var(--sun)]'}`}
            >
              {id === 'cac' ? 'Verify Us' : id === 'contact' ? 'Contact Us' : id.charAt(0).toUpperCase() + id.slice(1).replace('testimonials', 'Reviews')}
            </a>
          ))}
        </div>
        <a 
          href="https://app.wamation.com.ng/formframe?formid=a0253711b742349" 
          className="hidden md:block bg-[var(--sun)] text-white px-[22px] py-[9px] rounded-[30px] font-semibold text-[0.82rem] tracking-[0.05em] uppercase shadow-[0_4px_12px_rgba(232,160,32,0.2)] hover:bg-[var(--amber)] hover:-translate-y-[1px] hover:shadow-[0_6px_18px_rgba(232,160,32,0.3)] transition-all"
        >
          Start My 24-Hour Power Journey
        </a>
        <div className="flex flex-col gap-[5px] cursor-pointer z-[1001]" onClick={toggleMenu}>
          <span className={`w-[25px] h-[2.5px] bg-[var(--charcoal)] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[7.5px]' : ''}`}></span>
          <span className={`w-[25px] h-[2.5px] bg-[var(--charcoal)] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-[25px] h-[2.5px] bg-[var(--charcoal)] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[7.5px]' : ''}`}></span>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[var(--bg-base)] z-[1000] flex flex-col items-center justify-center transition-opacity duration-400 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {['hero', 'cac', 'contact'].map((id) => (
          <a 
            key={id}
            href={`#${id}`} 
            onClick={toggleMenu}
            className="font-serif text-[clamp(1.8rem,6vw,2.8rem)] my-[15px] font-bold"
          >
            {id === 'hero' ? 'Home' : id === 'cac' ? 'CAC Verification' : 'Contact Us'}
          </a>
        ))}
        <div className="mt-10 bg-[var(--sun)] text-white px-[52px] py-4 rounded-[50px] font-semibold cursor-pointer" onClick={toggleMenu}>
          ✕ Cancel
        </div>
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center bg-[var(--deep)] text-white p-0 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <img 
            ref={heroImgRef}
            src="https://raw.githubusercontent.com/mirabelfelix98/My-workflow/main/IMG-20260314-WA0027.jpg" 
            alt="Solar Equipment" 
            className="w-full h-full object-cover animate-[heroZoom_8s_ease-out_forwards]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,8,4,0.65)] via-[rgba(10,8,4,0.45)] to-transparent z-[1] md:block hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,8,4,0.75)] via-[rgba(10,8,4,0.50)] to-transparent z-[1] md:hidden block"></div>
        
        <div className="container relative z-[2] grid lg:grid-cols-[1.2fr_0.8fr] gap-[40px] lg:gap-[60px] pt-[140px] pb-20 w-full flex-grow items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 text-[0.75rem] font-bold tracking-[0.15em] uppercase text-[var(--gold)] bg-[rgba(232,160,32,0.18)] border border-[rgba(232,160,32,0.5)] px-[18px] py-2 rounded-[30px] mb-6">
              <span className="w-2 h-2 bg-[var(--gold)] rounded-full animate-[pulse_2s_infinite]"></span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} />
                CAC Registered · Nigeria's #1 Solar Equipment Supplier
              </span>
            </div>
            <h1 className="text-[clamp(2.4rem,5vw,4rem)] font-black leading-[1.1] mb-6 text-white shadow-black drop-shadow-2xl">
              The Sun Never Sends a <span className="italic text-[var(--gold)]">Bill.</span>
            </h1>
            <p className="text-[1.1rem] max-w-[480px] text-[rgba(255,255,255,0.88)] mb-10 drop-shadow-md">
              02Best Solar Limited supplies and installs ALL major solar brands — Deye, Felicity, Firman, BRead, itel, EOS and more. Real 24-hour power for Nigerian homes and businesses.
            </p>
            <div className="flex gap-4 flex-wrap">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://app.wamation.com.ng/formframe?formid=a0253711b742349" 
                className="bg-[var(--sun)] text-white px-9 py-4 rounded-[50px] font-semibold hover:bg-[var(--amber)] shadow-[0_10px_30px_rgba(232,160,32,0.3)] transition-all flex items-center gap-2"
                onClick={() => trackEvent('Lead', { content_name: 'Place Your Order Now - Hero' })}
              >
                Place Your Order Now <ArrowRight size={18} />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://solar-cat.netlify.app/" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-9 py-4 rounded-[50px] font-semibold hover:bg-white/20 transition-all flex items-center gap-2"
              >
                View Catalogue <ExternalLink size={18} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-[rgba(255,255,255,0.08)] backdrop-blur-2xl border border-[rgba(255,255,255,0.15)] rounded-[20px] p-9 grid grid-cols-2 gap-[30px]">
              {[
                { label: 'Systems Installed', value: '500' },
                { label: 'Brands In Stock', value: '10' },
                { label: 'Hour Power Supply', value: '24' },
                { label: 'Year Warranty', value: '10' }
              ].map((stat, i) => (
                <div key={i} className="reveal">
                  <h3 className="text-[2.4rem] font-serif text-[var(--gold)] mb-1" data-count={stat.value}>0</h3>
                  <p className="text-[0.7rem] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.75)] font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Status Bar */}
        <div className="w-full bg-black/40 backdrop-blur-xl border-t border-white/10 py-3 relative z-[10]">
          <div className="container flex items-center gap-6 overflow-hidden">
            <div className="flex items-center gap-2 shrink-0 bg-[var(--gold)] text-black px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></span>
              Live Status
            </div>
            <div className="flex-grow overflow-hidden relative">
              <div className="flex gap-12 animate-[marquee_30s_linear_infinite] whitespace-nowrap text-[0.8rem] font-medium text-white/80">
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[var(--gold)]" /> Live: 5kW System Installation in Lekki, Lagos</span>
                <span className="flex items-center gap-2"><Zap size={14} className="text-[var(--gold)]" /> Live: 10kW Hybrid System Installation in Abuja</span>
                <span className="flex items-center gap-2"><Clock size={14} className="text-[var(--gold)]" /> System Uptime: 99.9% across all 02Best Solar clients</span>
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[var(--gold)]" /> Live: 3.5kW System Installation in Port Harcourt</span>
                <span className="flex items-center gap-2"><Zap size={14} className="text-[var(--gold)]" /> Powering 500+ Nigerian Businesses 24/7</span>
                {/* Duplicate for seamless loop */}
                <span className="flex items-center gap-2"><MapPin size={14} className="text-[var(--gold)]" /> Live: 5kW System Installation in Lekki, Lagos</span>
                <span className="flex items-center gap-2"><Zap size={14} className="text-[var(--gold)]" /> Live: 10kW Hybrid System Installation in Abuja</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[0.75rem] text-[rgba(255,255,255,0.6)] z-[2] md:flex hidden">
          <div className="w-5 h-5 border-r-2 border-b-2 border-[var(--gold)] rotate-45 animate-[bounce_2s_infinite]"></div>
          Scroll to explore
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="bg-[var(--bg-alt)]">
        <div className="container grid lg:grid-cols-2 gap-[40px] lg:gap-[60px] items-center">
          <div className="reveal">
            <span className="section-tag">The Reality</span>
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold text-[var(--charcoal)]">
              NEPA Has <span className="italic text-[var(--sun)]">Failed</span> You. You Know It.
            </h2>
            <p className="my-5 text-[1.1rem] text-[var(--text-muted)]">
              Every month you spend thousands on generators, diesel, and PHCN bills — and you still wake up in darkness. That's money you're burning for absolutely nothing.
            </p>
            <ul className="my-[30px]">
              {[
                "You're tired of your generator eating ₦80,000–₦200,000 in fuel every single month",
                "You're tired of loud generator noise disturbing your home and your sleep",
                "You're tired of your appliances spoiling from constant power surges and cuts",
                "You're done watching your business lose money every time power goes off",
                "You're tired of paying PHCN for estimated bills you don't even use",
                "You're done accepting that this is just \"how Nigeria is\""
              ].map((text, i) => (
                <li key={i} className="flex gap-3 mb-4 font-medium reveal">
                  <span className="w-6 h-6 bg-[rgba(232,64,48,0.1)] text-[#E84030] rounded-full flex items-center justify-center flex-shrink-0 text-[0.8rem]">✗</span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="font-bold text-[var(--charcoal)]">There is a permanent solution. And it starts right here.</p>
          </div>
          <div className="relative reveal" style={{ transitionDelay: '0.2s' }}>
            <img 
              src="https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&q=80" 
              alt="Generator Problem" 
              className="w-full h-[400px] object-cover rounded-[20px] transition-transform duration-500 hover:scale-[1.04]"
            />
            <div className="absolute bottom-6 left-6 bg-[rgba(26,18,8,0.85)] backdrop-blur-md rounded-[14px] p-[14px_20px] text-white">
              <h4 className="text-[var(--gold)] text-[1.5rem] font-serif">₦200K+</h4>
              <p className="text-[0.8rem] opacity-70">Average monthly generator cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="bg-[var(--bg-base)] text-center">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">The Solution</span>
            <h2 className="text-[var(--charcoal)] font-bold">
              Introducing <span className="italic text-[var(--sun)]">02Best Solar</span> — Every Brand, One Trusted Supplier
            </h2>
            <img 
              src="https://raw.githubusercontent.com/mirabelfelix98/My-workflow/main/file_00000000ffc871f59bc5c5871fb20633%20(1).png" 
              alt="02Best Solar Logo" 
              className="w-full md:w-[80%] lg:w-[65%] max-w-[520px] mx-auto my-8 drop-shadow-[0_8px_24px_rgba(200,130,0,0.18)]"
            />
            <p className="max-w-[800px] mx-auto text-[var(--text-muted)]">
              We are Nigeria's most versatile solar energy company. We supply and install ALL the top solar brands — Deye, Felicity Solar, Firman, BRead, itel Energy, EOS, ColaSolar, Haisic, and more. Whatever brand fits your budget or preference, we have it in stock, ready to install.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[30px] mt-[60px]">
            {[
              { icon: '☀️', title: 'Every Top Brand, In One Place', body: "From Deye to Felicity, Firman to BRead, itel to EOS — we stock them all. You don't have to run from shop to shop. Come to us and compare every option in one place, with honest expert advice on what suits your budget." },
              { icon: '🔋', title: 'Never Lose Power Again', body: "Our lithium battery backup systems — across all top brands — store excess solar energy so your home stays powered through the night and on cloudy days. No blackouts. No generator noise. Just clean, silent power whenever you need it." },
              { icon: '💡', title: 'Expert Advice, Honest Pricing', body: "We don't push one brand. We listen to your budget, assess your load, and recommend the exact system — brand and size — that gives you the most value. Then we install it with certified engineers and back it with a full warranty." }
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-[20px] p-[36px_28px] text-left transition-all duration-400 hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(200,130,0,0.1)] reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="w-[50px] h-[50px] bg-[rgba(232,160,32,0.1)] text-[var(--sun)] rounded-full flex items-center justify-center text-[1.5rem] mb-6">{feature.icon}</div>
                <h3 className="mb-4 text-[1.3rem] font-serif">{feature.title}</h3>
                <p className="text-[var(--text-muted)]">{feature.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-gradient-to-br from-[rgba(245,200,66,0.06)] to-[rgba(232,160,32,0.04)] border border-[var(--border)] rounded-[20px] p-10 relative reveal">
            <p className="font-serif text-[clamp(1.3rem,3vw,1.8rem)] italic">
              "Before 02Best Solar, you were stuck overpaying for one brand or buying blindly. <br />
              After 02Best Solar, <span className="text-[var(--gold)]">you get every brand, expert advice, and the best price</span> — guaranteed."
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="bg-[var(--bg-alt)]">
        <div className="container grid lg:grid-cols-2 gap-[40px] lg:gap-[60px] items-center">
          <div className="reveal">
            <img 
              src="https://raw.githubusercontent.com/mirabelfelix98/My-workflow/main/InShot_20260227_134511171.jpg" 
              alt="Solar Products" 
              className="w-full h-[500px] object-cover rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <span className="section-tag">Our Equipment</span>
            <h2 className="text-[var(--charcoal)] font-bold">All Brands. Premium Equipment. <span className="italic text-[var(--sun)]">Best Prices.</span></h2>
            <p className="my-5 text-[var(--text-muted)]">
              We supply and install Nigeria's most trusted solar brands under one roof. No pressure to buy a specific brand. We advise you honestly, supply the right equipment, and install it professionally — so you get the best result for your money.
            </p>
            <ul className="my-6 mb-10">
              {[
                "Inverters — Deye, Felicity, Firman, Haisic, ColaSolar & more",
                "Batteries — EOS, BRead, itel ESS, SMS Gold Lithium & more",
                "Solar Panels — Grade-A Monocrystalline, all wattages",
                "Solar Street Lights — Motion-sensor, all-in-one units",
                "DC Cables, Accessories & All Installation Materials",
                "Professional Installation by Certified Engineers"
              ].map((item, i) => (
                <li key={i} className="flex gap-[10px] mb-3 font-medium reveal">
                  <span className="text-[var(--sun)]">✓</span> {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-4 flex-wrap">
              <a 
                href="https://solar-cat.netlify.app/" 
                className="bg-[var(--sun)] text-white px-9 py-4 rounded-[50px] font-semibold hover:bg-[var(--amber)] hover:-translate-y-[3px] transition-all"
                onClick={() => trackEvent('ViewContent', { content_name: 'Browse Full Catalogue' })}
              >
                Browse Full Catalogue →
              </a>
              <a 
                href="https://app.wamation.com.ng/formframe?formid=a0253711b742349" 
                className="bg-[rgba(255,255,255,0.12)] text-[var(--text)] border-2 border-[rgba(200,140,30,0.15)] px-9 py-4 rounded-[50px] font-semibold hover:bg-[rgba(255,255,255,0.25)] transition-all"
                onClick={() => trackEvent('Lead', { content_name: 'End My NEPA Problem Now Products Section' })}
              >
                End My NEPA Problem Now →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Cinematic Feature Block */}
      <section id="feature" className="bg-[var(--deep)] text-white text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80')] bg-cover bg-center opacity-15 z-0"></div>
        <div className="container relative z-[1]">
          <span className="section-tag !text-[var(--gold)]">Why Choose Us</span>
          <h2 className="text-white mb-5">Every Brand. One <span className="italic text-[var(--gold)]">Trusted</span> Supplier.</h2>
          <p className="text-[rgba(255,255,255,0.65)] max-w-[800px] mx-auto mb-[60px]">
            02Best Solar Limited is CAC-registered and stocks ALL major solar brands under one roof. No pressure to buy a specific brand. We advise you honestly, supply the right equipment, and install it professionally — so you get the best result for your money.
          </p>
          <div className="flex justify-center gap-[60px] flex-wrap">
            {[
              { label: 'Happy Customers', value: '500' },
              { label: 'Brands', value: '10' },
              { label: 'Fuel Savings', value: '85' },
              { label: 'Power/Day', value: '24' }
            ].map((stat, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <h4 className="text-[3rem] font-serif text-[var(--gold)] mb-2" data-count={stat.value}>0</h4>
                <p className="text-[0.82rem] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.6)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[var(--bg-base)] text-center">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">Real Results</span>
            <h2 className="text-[var(--charcoal)] font-bold">What Our <span className="italic text-[var(--sun)]">Clients</span> Are Saying</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-[30px] my-[60px]">
            {[
              { name: 'Alhaji Okonkwo', location: 'Business Owner · Abuja', product: 'Solar Inverter + Battery System', quote: "Before 02Best Solar, I was spending close to ₦150,000 every month on fuel alone. It was killing my business. Within 3 weeks of installation, my generator has not moved. Not once. My only regret is that I didn't do this sooner." },
              { name: 'Ngozi Nwosu', location: 'Homeowner · Lagos', product: 'Complete Home Solar System', quote: "My husband and I were so afraid to make the investment. We thought, what if it's another scam? But 02Best Solar came to our home, explained everything clearly, showed us their CAC document, and installed within 2 days. Now we have light 24/7." },
              { name: 'Dr. Rasheed Adeyemi', location: 'Medical Clinic Owner · Ibadan', product: 'Commercial Solar Installation', quote: "I'm a doctor and power is life-or-death in my clinic. After PHCN failed us one too many times, I called 02Best Solar. Their team was professional, fast, and the system has been running perfectly for 8 months. Zero issues. My PHCN bill last month was ₦0. That's the truth." }
            ].map((t, i) => (
              <div key={i} className="bg-white border border-[var(--border)] rounded-[20px] p-8 text-left transition-all duration-400 hover:-translate-y-[6px] hover:shadow-[0_20px_40px_rgba(200,130,0,0.1)] reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="text-[var(--gold)] mb-4">★★★★★</div>
                <p className="italic mb-6 text-[0.95rem]">"{t.quote}"</p>
                <h4 className="text-[1.1rem] mb-1 font-serif font-bold">{t.name}</h4>
                <div className="text-[0.8rem] text-[var(--text-muted)] mb-2">{t.location}</div>
                <div className="text-[0.75rem] font-semibold text-[var(--sun)] uppercase">{t.product}</div>
              </div>
            ))}
          </div>
          <p className="reveal font-semibold text-[var(--text-muted)]">Join 500+ Nigerian homes and businesses who have already ended their relationship with NEPA — permanently.</p>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-gradient-to-br from-[#1A1208] to-[#3D2A0A] text-white text-center py-[120px] overflow-hidden relative">
        <div className="absolute w-[400px] h-[400px] bg-[rgba(232,160,32,0.07)] blur-[80px] rounded-full z-0 top-[-100px] right-[-100px]"></div>
        <div className="absolute w-[400px] h-[400px] bg-[rgba(232,160,32,0.07)] blur-[80px] rounded-full z-0 bottom-[-100px] left-[-100px]"></div>
        <div className="container relative z-[1]">
          <div className="bg-[rgba(220,60,30,0.15)] text-[#E84030] border border-[rgba(220,60,30,0.25)] rounded-[30px] px-5 py-2 inline-flex items-center gap-2 text-[0.85rem] font-semibold mb-[30px] reveal">
            <span className="w-2 h-2 bg-[#E84030] rounded-full animate-[pulse_2s_infinite]"></span>
            ⚡ Limited Slots Available This Month
          </div>
          <h2 className="text-white text-[clamp(2rem,5vw,3.5rem)] mb-5 reveal font-serif">Ready to <span className="italic text-[var(--gold)]">End</span> Your NEPA Problem?</h2>
          <p className="text-[rgba(255,255,255,0.65)] max-w-[600px] mx-auto mb-10 reveal">
            Tell us your budget and your power needs. We'll recommend the right brand, right size, and right price from our full range of solar products — completely free, zero obligation.
          </p>
          <div className="flex justify-center gap-5 flex-wrap reveal">
            <a 
              href="#contact" 
              className="bg-[var(--gold)] text-[var(--deep)] px-11 py-[18px] rounded-[50px] font-bold hover:-translate-y-[3px] hover:shadow-[0_10px_20px_rgba(245,200,66,0.3)] transition-all"
              onClick={() => trackEvent('Contact', { content_name: 'Call Now Button' })}
            >
              📞 Call Us Now — Free Consultation
            </a>
            <a 
              href="https://app.wamation.com.ng/formframe?formid=a0253711b742349" 
              className="bg-transparent text-[rgba(255,255,255,0.85)] border-2 border-[rgba(255,255,255,0.25)] px-11 py-[18px] rounded-[50px] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
              onClick={() => trackEvent('Lead', { content_name: 'CTA WhatsApp Button' })}
            >
              💬 WhatsApp Us Instead
            </a>
          </div>
          <div className="mt-10 text-[0.75rem] text-[rgba(255,255,255,0.3)] reveal">CAC Reg. No. 9414644 · Tax ID: 2622466245775 · Serving All of Nigeria</div>
        </div>
      </section>

      {/* Trust Section */}
      <section id="trust" className="bg-[var(--bg-base)]">
        <div className="container grid lg:grid-cols-2 gap-[40px] lg:gap-[60px] items-center">
          <div className="reveal">
            <span className="section-tag">Our Commitment</span>
            <h2 className="text-[var(--charcoal)] font-bold">Why You Can <span className="italic text-[var(--sun)]">Trust</span> 02Best Solar</h2>
            <p className="my-5 text-[var(--text-muted)]">
              We are not strangers on the internet. We are a fully registered Nigerian company with a real address, real engineers, and a real track record.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 mt-10">
              {[
                { icon: '🏛️', title: 'CAC Registered', text: 'Reg. No. 9414644' },
                { icon: '🔒', title: 'Insured & Certified', text: 'Professional engineers' },
                { icon: '📋', title: 'Written Warranty', text: '10-year guarantee' },
                { icon: '✅', title: 'All Brands Genuine', text: '10+ brands available' }
              ].map((badge, i) => (
                <div key={i} className="bg-[#FFF8EC] border border-[var(--border)] rounded-[14px] p-5 text-center transition-all hover:border-[var(--amber)]">
                  <div className="text-2xl mb-2">{badge.icon}</div>
                  <h4 className="text-[1rem] mb-1 font-bold">{badge.title}</h4>
                  <p className="text-[0.75rem] text-[var(--text-muted)]">{badge.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal" style={{ transitionDelay: '0.2s' }}>
            <img 
              src="https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=700&q=80" 
              alt="Trust" 
              className="w-full h-auto object-cover rounded-[24px] border-2 border-[rgba(200,140,30,0.15)] shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
            />
          </div>
        </div>
      </section>

      {/* CAC Verification */}
      <section id="cac" className="bg-gradient-to-b from-[#FFF8EC] to-[#FEFAF3] text-center">
        <div className="container">
          <div className="reveal">
            <span className="section-tag">Official Business Verification</span>
            <h2 className="text-[var(--charcoal)] font-bold">We Are a <span className="italic text-[var(--sun)]">Verified</span> Nigerian Company</h2>
            <p className="max-w-[700px] mx-auto my-5 text-[var(--text-muted)]">
              Below is our official Certificate of Incorporation from the Corporate Affairs Commission of Nigeria. Scan the QR code to verify directly on the CAC website. 02Best Solar Limited is 100% legal, registered, and accountable.
            </p>
          </div>
          <div className="bg-white border-2 border-[var(--border)] rounded-[24px] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.1)] inline-block relative max-w-[700px] mt-10 reveal">
            <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 bg-[#2A8A40] text-white text-[0.72rem] font-bold tracking-[0.12em] uppercase px-5 py-[6px] rounded-[30px] whitespace-nowrap">✓ VERIFIED BUSINESS</div>
            <img 
              src="https://raw.githubusercontent.com/mirabelfelix98/My-workflow/main/Screenshot_20260316_143649_Word.jpg" 
              alt="CAC Certificate" 
              className="w-full max-w-[600px] rounded-[12px] mx-auto"
            />
            <div className="grid sm:grid-cols-3 gap-[15px] mt-[30px]">
              {[
                { title: '02BEST SOLAR LIMITED', label: 'Registered Company Name' },
                { title: '9414644', label: 'CAC Registration Number' },
                { title: 'March 13, 2026', label: 'Date of Incorporation' }
              ].map((detail, i) => (
                <div key={i} className="bg-[#FFF8EC] border border-[var(--border)] rounded-[14px] p-5 text-center">
                  <h5 className="text-[0.9rem] font-bold">{detail.title}</h5>
                  <p className="text-[0.7rem] text-[var(--text-muted)] uppercase">{detail.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section id="guarantee" className="bg-[var(--bg-alt)]">
        <div className="container">
          <div className="bg-white border-2 border-[rgba(232,160,32,0.2)] rounded-[24px] p-10 md:p-[60px] shadow-[0_20px_60px_rgba(200,130,0,0.08)] flex flex-col md:flex-row gap-10 items-center reveal">
            <div className="w-[100px] h-[100px] bg-gradient-to-br from-[var(--sun)] to-[var(--gold)] rounded-full flex items-center justify-center text-[2.8rem] shadow-[0_12px_36px_rgba(232,160,32,0.35)] shrink-0">🛡️</div>
            <div className="text-center md:text-left">
              <h3 className="text-[1.8rem] font-serif font-bold mb-4">Our 10-Year Equipment Guarantee</h3>
              <p>Every system we install comes with a comprehensive 10-year warranty on all major components — inverters, batteries, and panels. If anything goes wrong with your equipment within that period, we fix it. No questions asked. Your investment is protected, your power is secure, and your trust in us is our priority. That is the 02Best Solar promise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[var(--deep)] text-white pt-[70px] pb-10">
        <div className="container grid sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] gap-[40px] lg:gap-[60px] mb-[60px]">
          <div className="reveal">
            <div className="font-serif font-bold text-[1.4rem] mb-5 text-white">02<span className="text-[var(--sun)]">Best</span> Solar Limited</div>
            <p className="text-[0.88rem] text-[rgba(255,255,255,0.45)] mb-4">
              Nigeria's most versatile solar energy company. We supply and install ALL major solar brands — Deye, Felicity, Firman, BRead, itel, EOS, ColaSolar, Haisic and more — for homes and businesses across Nigeria.
            </p>
            <p className="text-[0.75rem] opacity-60">CAC Reg. No. 9414644 · TIN: 2622466245775</p>
          </div>
          <div className="reveal">
            <h4 className="text-[var(--sun)] text-[0.75rem] uppercase tracking-[0.1em] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['problem', 'solution', 'products', 'testimonials', 'cac'].map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-[rgba(255,255,255,0.55)] text-[0.9rem] hover:text-[var(--sun)] transition-colors">
                    {id === 'cac' ? 'Verify Us' : id.charAt(0).toUpperCase() + id.slice(1).replace('testimonials', 'Reviews')}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h4 className="text-[var(--sun)] text-[0.75rem] uppercase tracking-[0.1em] mb-6">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="tel:+2347042419406" 
                  className="text-[rgba(255,255,255,0.55)] text-[0.9rem] hover:text-[var(--sun)]"
                  onClick={() => trackEvent('Contact', { content_name: 'Footer Call' })}
                >
                  📞 Call: +234 704 241 9406
                </a>
              </li>
              <li><a href="https://wa.link/g9xdzn" className="text-[rgba(255,255,255,0.55)] text-[0.9rem] hover:text-[var(--sun)]">💬 WhatsApp Us</a></li>
              <li>
                <a 
                  href="mailto:Oladunjoyeabiola2@gmail.com" 
                  className="text-[rgba(255,255,255,0.55)] text-[0.9rem] hover:text-[var(--sun)]"
                  onClick={() => trackEvent('Contact', { content_name: 'Email Button' })}
                >
                  ✉️ Oladunjoyeabiola2@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container border-t border-[rgba(255,255,255,0.08)] pt-[30px] flex flex-col md:flex-row justify-between items-center gap-[10px] text-[0.82rem] text-[rgba(255,255,255,0.3)]">
          <p>© 2026 02Best Solar Limited. All rights reserved. CAC Reg. No. 9414644.</p>
          <p>Built by 02Best Solar Limited</p>
        </div>
      </footer>
    </div>
  );
}
