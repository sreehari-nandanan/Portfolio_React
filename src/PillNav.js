import React, { useState, useEffect } from 'react';
import { GiStairs } from 'react-icons/gi';
import './PillNav.css';

const PillNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      const about = document.getElementById('about');
      const projects = document.getElementById('projects');
      const achievements = document.getElementById('achievements');
      const scrollY = window.scrollY + window.innerHeight / 3;

      setShowScrollTop(window.scrollY > 500);

      if (achievements && scrollY >= achievements.offsetTop) {
        setActiveSection('achievements');
      } else if (projects && scrollY >= projects.offsetTop) {
        setActiveSection('projects');
      } else if (about && scrollY >= about.offsetTop) {
        setActiveSection('about');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    <nav className="pill-nav">
      <button 
        className={`menu-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <div className={`pill-nav-container ${isOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`pill-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
    {showScrollTop && (
      <button className="scroll-to-top" onClick={scrollToTop}>
        <GiStairs />
      </button>
    )}
    </>
  );
};

export default PillNav;