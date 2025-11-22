import "./App.css";
import "./Mobile.css";
import Aurora from './Aurora';
import GradientText from './GradientText';
import ScrollVelocity from './ScrollVelocity';
import PixelatedImage from './PixelatedImage';
import PillNav from './PillNav';
import LoadingScreen from './LoadingScreen';
import { FlickeringGrid } from './components/ui/flickering-grid';
import DecryptedText from './components/ui/decrypted-text';
import CurvedLoop from './components/ui/curved-loop';
import ClickSpark from './components/ui/ClickSpark';
import CircularText from './components/ui/CircularText';

import { FaLinkedin, FaGithub, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useEffect, useRef, useCallback, useState } from 'react';
import CountUp from './components/CountUp';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMobileDetect } from './useMobileDetect';

gsap.registerPlugin(ScrollTrigger);

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Using mailto as fallback - you can replace with EmailJS or Formspree
    const mailtoLink = `mailto:sreeharinandanan3690@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    window.location.href = mailtoLink;
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <textarea
        placeholder="Your Message"
        rows="5"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        required
      />
      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send Message'}
      </button>
      {status === 'error' && <p className="error-message">Failed to send. Please try again.</p>}
    </form>
  );
};

const AchievementCard = ({ achievement }) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const isHoveredRef = useRef(false);

  const createParticle = useCallback((x, y) => {
    const particle = document.createElement('div');
    particle.className = 'star-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    return particle;
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = createParticle(x, y);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );

        gsap.to(particle, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(particle, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, i * 100);
    }
  }, [createParticle]);

  const clearParticles = useCallback(() => {
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => particle.remove()
      });
    });
    particlesRef.current = [];
  }, []);

  const handleClick = useCallback((e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.width = `${maxDistance * 2}px`;
    ripple.style.height = `${maxDistance * 2}px`;
    ripple.style.left = `${x - maxDistance}px`;
    ripple.style.top = `${y - maxDistance}px`;

    cardRef.current.appendChild(ripple);

    gsap.fromTo(ripple,
      { scale: 0, opacity: 1 },
      { 
        scale: 1, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      }
    );
  }, []);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearParticles();
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      clearParticles();
    };
  }, [animateParticles, clearParticles]);

  return (
    <div 
      ref={cardRef}
      className="achievement-item"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
        const relativeY = ((e.clientY - rect.top) / rect.height) * 100;
        e.currentTarget.style.setProperty('--glow-x', `${relativeX}%`);
        e.currentTarget.style.setProperty('--glow-y', `${relativeY}%`);
        e.currentTarget.style.setProperty('--glow-intensity', '1');
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--glow-intensity', '0');
      }}
      onClick={handleClick}
    >
      <div className="achievement-content">
        <h3 className="achievement-item-title">{achievement.title}</h3>
        <p className="achievement-item-description">{achievement.description}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const { isMobile, isTablet } = useMobileDetect();
  const arrowRef = useRef(null);
  const projectsRef = useRef(null);
  const projectsArrowRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Hide loading screen after 2 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (loading || isMobile) return;

    if (arrowRef.current) {
      const aboutSection = document.getElementById('about');
      const projectsSection = document.getElementById('projects');
      
      if (aboutSection && projectsSection) {
        const totalHeight = aboutSection.offsetHeight + projectsSection.offsetHeight;
        
        gsap.fromTo(arrowRef.current, 
          { y: 0, rotation: -100 },
          {
            y: totalHeight * 1.5,
            rotation: -100 + (totalHeight * 0.2),
            ease: 'none',
            scrollTrigger: {
              trigger: aboutSection,
              start: 'top top',
              end: `+=${totalHeight}`,
              scrub: 1,
              anticipatePin: 1,
            }
          }
        );
      }
    }



    // Projects arrow animation
    if (projectsArrowRef.current && projectsRef.current) {
      gsap.fromTo(projectsArrowRef.current,
        { y: 0, rotation: -90 },
        {
          y: 250,
          rotation: 180,
          ease: 'none',
          scrollTrigger: {
            trigger: projectsRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 0.5,
          }
        }
      );
    }

    // Horizontal scroll for projects
    if (projectsRef.current) {
      const projectsContainer = projectsRef.current;
      const projectsTrack = projectsContainer.querySelector('.projects-right');
      
      if (projectsTrack) {
        const projectItems = projectsTrack.querySelectorAll('.project-item');
        const itemWidth = projectItems[0].offsetWidth + 20;
        const viewportWidth = projectsTrack.clientWidth;
        const scrollWidth = (itemWidth * projectItems.length) - viewportWidth;
        const scrollDuration = (scrollWidth + viewportWidth * 1.5) * 1.2;
        
        gsap.to(projectsTrack, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: projectsContainer,
            start: 'top top',
            end: () => `+=${scrollDuration}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
          }
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, isMobile]);
  const projects = [
    {
      title: "SECTOR",
      subtitle: "Freestyle Drone",
      description: "A high-speed carbon fiber FPV racing drone, fine-tuned for precision and freestyle maneuvers, capable of reaching 200 km/h in just one second.",
      tags: ["FPV", "Carbon Fiber", "Racing", "Freestyle"],
      status: "Completed"
    },
    {
      title: "CINELOG 35",
      subtitle: "Cinematic FPV Drone",
      description: "The CineLog 35 is a compact cinewhoop drone designed for smooth, stable cinematic shots while maintaining agile and precise control.",
      tags: ["Cinewhoop", "FPV", "Cinematic", "Compact"],
      status: "Completed"
    },
    {
      title: "GOLDEN EYE",
      subtitle: "Autonomous Rescue Drone",
      description: "A rapid-response drone equipped with AI-powered human recognition, designed for delivering medicines and essential supplies in emergency situations.",
      tags: ["AI", "Autonomous", "Rescue", "Computer Vision"],
      status: "Completed"
    },
    {
      title: "COMING SOON",
      subtitle: "Stay Tuned",
      description: "Something exciting is on the way... Stay tuned for the next big innovation!",
      tags: ["Innovation", "Tech"]
    }
  ];



  const achievements = [
    {
      title: "NASA Space Apps Global Nominee",
      description: "Selected for the global nomination in the NASA Space Apps Challenge 2024 with Team Clean-Enviro."
    },
    {
      title: "TinkerHub Co-Lead",
      description: "Co-lead of TinkerHub TOC-H campus team, promoting tech learning & innovation."
    },
    {
      title: "Exhibition at Central University",
      description: "Showcased innovative drone technologies and autonomous UAV projects at Kasaragod Central University."
    },
    {
      title: "Electronics Workshops",
      description: "Completed advanced certification in modern web technologies and responsive design principles."
    },
    {
      title: "Tech Innovation Workshops",
      description: "Attended multiple hands-on workshops on advanced electronics and embedded systems."
    },
    {
      title: "Innovation Excellence Award",
      description: "Recognized for outstanding contributions to emerging drone technology applications in environmental monitoring."
    }
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ClickSpark
      sparkColor="#4079ff"
      sparkSize={21}
      sparkRadius={45}
      sparkCount={8}
      duration={400}
      easing="ease-out"
    >
      <div className="app">
      <PillNav />
      {/* Hero Section */}
      <section id="hero" className="hero">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <Aurora
          colorStops={["#1e3a8a", "#3b82f6", "#60a5fa"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hi There,<br />I'm <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
              >
                Sreehari Nandanan
              </GradientText>
            </h1>
          </div>
          <div className="hero-image">
            <PixelatedImage src="/sreehari.png" alt="Sreehari Nandanan" />
            <ScrollVelocity />
          </div>
        </div>
        <div className="hero-socials">
          <a href="mailto:sreeharinandanan3690@gmail.com" className="hero-social-link">
            <FaEnvelope />
          </a>
          <a href="tel:+916282024233" className="hero-social-link">
            <FaPhone />
          </a>
          <a href="https://www.linkedin.com/in/sreehari-nandanan-628b1a262" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            <FaLinkedin />
          </a>
          <a href="https://github.com/sreehari-nandanan" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            <FaGithub />
          </a>
          <a href="https://www.instagram.com/sree.hari_._" target="_blank" rel="noopener noreferrer" className="hero-social-link">
            <FaInstagram />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <CurvedLoop marqueeText="PASSIONATE ✦ CREATIVE ✦ INNOVATIVE ✦ VISIONARY ✦" speed={2} curveAmount={100} direction="left" interactive={true} />
          <img ref={arrowRef} src="/arr.png" alt="Arrow" style={{ position: 'absolute', top: '-100px', right: 'calc(0.9rem + 100px)', maxWidth: '100px', zIndex: 10, willChange: 'transform' }} />
          <div className="about-grid">
            <div className="about-left">
              <h2 className="about-heading">ABOUT</h2>
              <div className="image-hover-container" style={{ position: 'relative', width: '200px', marginTop: '30px', marginLeft: '60px' }}>
                <img src="/sn.png" alt="SN" className="sn-image" style={{ width: '100%', display: 'block', transition: 'opacity 0.3s', opacity: 0.5 }} />
                <img src="/sign.png" alt="Sign" className="sign-overlay" style={{ position: 'absolute', top: '-15px', left: -9, width: 'calc(100% + 30px)', opacity: 1, transition: 'opacity 0.3s', transform: 'rotate(-0deg)' }} />
              </div>
            </div>
            <div className="about-right">
              <p className="about-text">Pushing ideas forward, exploring new possibilities, and building what <DecryptedText text="matters." speed={50} maxIterations={1} animateOn="view" /></p>
              <p className="about-text">Shaping my path in drones, tech, and innovation—one project, one <DecryptedText text="breakthrough at a time." speed={50} maxIterations={1} animateOn="view" /></p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section projects" ref={projectsRef}>
        <FlickeringGrid
          className="absolute inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <img ref={projectsArrowRef} src="/arr.png" alt="Arrow" style={{ position: 'absolute', top: '-100px', left: '10px', maxWidth: '80px', zIndex: 10, willChange: 'transform' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="projects-layout">
            <div className="projects-left">
              <div style={{ position: 'relative' }}>
                <h2 className="projects-heading" style={{ position: 'relative', zIndex: 1 }}>
                  PROJECTS
                  <span className="bounce-star bounce-star-big" style={{ position: 'absolute', top: '-10%', right: '-100px' }}>✦</span>
                  <span className="bounce-star bounce-star-small" style={{ position: 'absolute', top: '10%', right: '-105px' }}>✦</span>
                </h2>
                <div style={{ position: 'absolute', top: '300px', left: '-200px', zIndex: 2 }}>
                  <CircularText text="BUILD ✦ CREATE ✦ INNOVATE ✦ EXPLORE ✦ " spinDuration={15} onHover="pause" className="circular-text-large" />
                </div>
              </div>
              <div className="projects-count">
                0<CountUp to={8} from={0} duration={2} delay={0} />
              </div>
            </div>

            <div className="projects-right">
              {projects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-header">
                    <h3 className="project-item-title">{project.title}</h3>
                    {project.status && <span className="project-status">{project.status}</span>}
                  </div>
                  <p className="project-item-subtitle">{project.subtitle}</p>
                  <p className="project-item-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="project-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
              <div className="project-item" style={{ opacity: 0, pointerEvents: 'none' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="section achievements">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <img src="/tp.png" alt="Trophy" style={{ position: 'absolute', top: '20px', right: '20px', maxWidth: '70px', zIndex: 10, opacity: 0.8 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="achievements-layout">
            <div className="achievements-left" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', zIndex: 3, marginTop: '-40px' }}>
                <h2 className="achievements-heading">ACHIEVEMENTS</h2>
              </div>
              <div style={{ position: 'absolute', bottom: '0px', left: '-100px', zIndex: 1, width: '400px', transform: 'rotate(40deg)', color: '#6079ff' }}>
                <CurvedLoop marqueeText="EXCELLENCE ✦ RECOGNITION ✦ MILESTONES ✦EXCELLENCE ✦ RECOGNITION ✦ MILESTONES ✦" speed={2} curveAmount={200} direction="left" interactive={true} />
              </div>
            </div>
            <div className="achievements-right">
              {achievements.map((achievement, index) => (
                <AchievementCard key={index} achievement={achievement} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <FlickeringGrid
          className="absolute inset-0 w-full h-full"
          squareSize={4}
          gridGap={6}
          color="rgb(255, 255, 255)"
          maxOpacity={0.1}
          flickerChance={0.1}
        />
        <div className="footer-content">
          <div className="footer-socials">
            <a href="mailto:sreeharinandanan3690@gmail.com" className="footer-social-link">
              <FaEnvelope />
            </a>
            <a href="tel:+916282024233" className="footer-social-link">
              <FaPhone />
            </a>
            <a href="https://www.linkedin.com/in/sreehari-nandanan-628b1a262" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaLinkedin />
            </a>
            <a href="https://github.com/sreehari-nandanan" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaGithub />
            </a>
            <a href="https://www.instagram.com/sree.hari_._" target="_blank" rel="noopener noreferrer" className="footer-social-link">
              <FaInstagram />
            </a>
          </div>
          <p className="footer-text">&copy; 2025 Sreehari Nandanan. All Rights Reserved.</p>
        </div>
      </footer>
      </div>
    </ClickSpark>
  );
}
