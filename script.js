(() => {
  'use strict';

  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* Theme */
  const themeButton = document.querySelector('.theme-toggle');
  const getStoredTheme = () => {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      console.warn('Local storage not accessible:', e);
      return null;
    }
  };
  const setStoredTheme = (theme) => {
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch (e) {
      console.warn('Local storage not writable:', e);
    }
  };
  const setTheme = (theme) => {
    const light = theme === 'light';
    body.classList.toggle('light', light);
    document.documentElement.style.colorScheme = light ? 'light' : 'dark';
    if (themeButton) {
      themeButton.innerHTML = `<i class="fa-solid fa-${light ? 'moon' : 'sun'}"></i>`;
      themeButton.setAttribute('aria-label', light ? 'Use dark theme' : 'Use light theme');
    }
  };
  setTheme(getStoredTheme() || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  themeButton?.addEventListener('click', () => {
    const next = body.classList.contains('light') ? 'dark' : 'light';
    setStoredTheme(next);
    setTheme(next);
  });

  /* Mobile navigation */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const closeMenu = () => {
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open navigation');
    navMenu?.classList.remove('open');
  };
  navToggle?.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    navToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navMenu?.classList.toggle('open', !open);
  });
  navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  /* Scroll reveals, navigation state, header, and minimal hero depth */
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -30px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else revealItems.forEach((item) => item.classList.add('revealed'));

  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress span');
  const heroVisual = document.querySelector('.hero-visual');
  let scrollFrame;
  const updateScrollUI = () => {
    scrollFrame = undefined;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min(100, window.scrollY / max * 100) : 0;
    if (progressBar) progressBar.style.width = `${progress}%`;
    header?.classList.toggle('scrolled', window.scrollY > 30);
    if (!reducedMotion && heroVisual && window.scrollY < window.innerHeight) heroVisual.style.translate = `0 ${window.scrollY * .08}px`;
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI); }, { passive: true });
  updateScrollUI();

  const navLinks = [...document.querySelectorAll('.nav-menu > a[href^="#"]')];
  const sections = [...document.querySelectorAll('[data-scroll-section]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${current.target.id}`));
    }, { rootMargin: '-30% 0px -56%', threshold: [.05, .2, .45] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Hero focus rotation and metric counters */
  const rotator = document.querySelector('[data-rotator]');
  const focuses = ['backend architecture', 'interactive interfaces', 'problem solving', 'clean code'];
  if (rotator && !reducedMotion) {
    let index = 0;
    window.setInterval(() => {
      rotator.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 170, fill: 'forwards' }).finished.then(() => {
        index = (index + 1) % focuses.length;
        rotator.textContent = focuses[index];
        rotator.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'forwards' });
      });
    }, 3000);
  }
  const counters = [...document.querySelectorAll('[data-count]')];
  const animateCount = (counter) => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || '';
    const start = performance.now();
    const duration = 850;
    const draw = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      counter.innerHTML = `${value}${suffix ? `<span>${suffix}</span>` : ''}`;
      if (progress < 1) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  };
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCount(entry.target); observer.unobserve(entry.target); }
    }), { threshold: .9 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* Project filters */
  const projects = [...document.querySelectorAll('.project')];
  const filterButtons = [...document.querySelectorAll('.filter')];
  const projectsGrid = document.querySelector('.projects-grid');
  const showMore = document.querySelector('.show-more');
  const setFilter = (filter) => {
    projects.forEach((project) => {
      const categories = project.dataset.category?.split(' ') || [];
      project.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
    filterButtons.forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (filter === 'all') {
      projectsGrid?.classList.remove('show-extra');
      if (showMore) { showMore.hidden = false; showMore.classList.remove('open'); showMore.innerHTML = 'See more projects <i class="fa-solid fa-plus"></i>'; }
    } else {
      projectsGrid?.classList.add('show-extra');
      if (showMore) showMore.hidden = true;
    }
  };
  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    button.addEventListener('click', () => setFilter(button.dataset.filter || 'all'));
  });
  showMore?.addEventListener('click', () => {
    const open = projectsGrid?.classList.toggle('show-extra');
    showMore.classList.toggle('open', Boolean(open));
    showMore.innerHTML = open ? 'Show less <i class="fa-solid fa-minus"></i>' : 'See more projects <i class="fa-solid fa-plus"></i>';
  });

  /* Scroll Narrative timeline trackers & 3D Tilt handlers */
  const initStoryScroll = () => {
    const story = document.querySelector('.story-scroll');
    const storySteps = [...document.querySelectorAll('[data-story-step]')];
    const laserFlow = document.querySelector('.laser-flow');
    
    if (story && storySteps.length && 'IntersectionObserver' in window) {
      const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const stage = entry.target.dataset.storyStep || '0';
          story.dataset.active = stage;
          
          storySteps.forEach((step) => {
            step.classList.toggle('active', step.dataset.storyStep === stage);
          });
          
          // Move the vertical timeline laser fill
          const stageNum = parseInt(stage, 10);
          if (laserFlow) {
            const percentage = (stageNum / (storySteps.length - 1)) * 100;
            laserFlow.style.height = `${percentage}%`;
          }
        });
      }, { rootMargin: '-40% 0px -40%', threshold: 0.1 });
      
      storySteps.forEach((step) => storyObserver.observe(step));
    }

    // 3D Tilt effect on the Sticky Journey Showcase Card
    const storyCard = document.getElementById('interactive-story-card');
    if (storyCard && !reducedMotion) {
      storyCard.addEventListener('mousemove', (e) => {
        const rect = storyCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 12; // tilt up to 12 degrees
        const rotateY = ((x - centerX) / centerX) * 12; // tilt up to 12 degrees
        
        storyCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Dynamic lighting glare position coordinates
        const reflectionX = (x / rect.width) * 100;
        const reflectionY = (y / rect.height) * 100;
        storyCard.style.setProperty('--reflection-x', `${reflectionX}%`);
        storyCard.style.setProperty('--reflection-y', `${reflectionY}%`);
      });
      
      storyCard.addEventListener('mouseleave', () => {
        storyCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        storyCard.style.setProperty('--reflection-x', '50%');
        storyCard.style.setProperty('--reflection-y', '50%');
      });
    }
  };
  initStoryScroll();

  /* Click-to-play avatar introduction */
  const welcome = document.querySelector('#welcome-intro');
  const welcomeText = document.querySelector('#welcome-text');
  const enterButton = document.querySelector('#welcome-enter');
  const skipButton = document.querySelector('#welcome-skip');
  const avatar = document.querySelector('#avatar-stage');
  const intro = welcomeText?.dataset.message || '';
  let welcomeClosed = false;
  const closeWelcome = () => {
    if (welcomeClosed || !welcome) return;
    welcomeClosed = true;
    welcome.classList.add('exit');
    window.setTimeout(() => { welcome.hidden = true; }, 600);
  };
  const typeIntro = () => {
    if (!welcomeText) return;
    if (reducedMotion) { welcomeText.textContent = intro; welcomeText.classList.add('complete'); return; }
    let character = 0;
    const type = () => {
      welcomeText.textContent = intro.slice(0, character++);
      if (character <= intro.length) window.setTimeout(type, 15);
      else welcomeText.classList.add('complete');
    };
    window.setTimeout(type, 220);
  };
  const playChime = () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    const context = new Audio(); const now = context.currentTime;
    [523.25, 659.25].forEach((note, index) => {
      const oscillator = context.createOscillator(); const gain = context.createGain();
      oscillator.frequency.setValueAtTime(note, now + index * .12); oscillator.type = 'sine';
      gain.gain.setValueAtTime(.0001, now + index * .12); gain.gain.exponentialRampToValueAtTime(.07, now + index * .12 + .02); gain.gain.exponentialRampToValueAtTime(.0001, now + index * .12 + .42);
      oscillator.connect(gain).connect(context.destination); oscillator.start(now + index * .12); oscillator.stop(now + index * .12 + .45);
    });
    window.setTimeout(() => context.close(), 800);
  };
  let welcomeSpeechInterval = null;
  let isSpeakingWelcome = false;

  const startWelcomeMouth = () => {
    const mouth = document.getElementById('welcome-avatar-mouth');
    if (!mouth) return;
    const frames = [
      "M86 114 Q100 114 114 114", // smile
      "M86 114 Q100 124 114 114", // open
      "M88 114 Q100 119 112 114", // half open
      "M90 114 Q100 123 110 114"  // narrow open
    ];
    let idx = 0;
    welcomeSpeechInterval = window.setInterval(() => {
      idx = (idx + 1) % frames.length;
      mouth.setAttribute('d', frames[idx]);
    }, 110);
  };

  const stopWelcomeMouth = () => {
    if (welcomeSpeechInterval) {
      window.clearInterval(welcomeSpeechInterval);
      welcomeSpeechInterval = null;
    }
    const mouth = document.getElementById('welcome-avatar-mouth');
    if (mouth) mouth.setAttribute('d', "M86 114 Q100 114 114 114");
  };

  const speakIntro = () => {
    if (!('speechSynthesis' in window)) {
      closeWelcome();
      return;
    }
    window.speechSynthesis.cancel();

    if (enterButton) {
      enterButton.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Skip & Enter`;
    }

    const speech = new SpeechSynthesisUtterance(`Hey, I'm Muhammad Asad. ${intro}`);
    const voice = window.speechSynthesis.getVoices().find((item) => /^en-(PK|GB|US)/i.test(item.lang)) || window.speechSynthesis.getVoices().find((item) => /^en/i.test(item.lang));
    if (voice) speech.voice = voice;
    speech.rate = .94; speech.pitch = 1;

    speech.onstart = () => {
      avatar?.classList.add('speaking');
      const wsvg = document.getElementById('welcome-avatar-svg');
      if (wsvg) wsvg.classList.add('speaking');
      startWelcomeMouth();
    };

    speech.onend = speech.onerror = () => {
      avatar?.classList.remove('speaking');
      const wsvg = document.getElementById('welcome-avatar-svg');
      if (wsvg) wsvg.classList.remove('speaking');
      stopWelcomeMouth();
      isSpeakingWelcome = false;
      closeWelcome();
    };

    window.speechSynthesis.speak(speech);
  };

  typeIntro();
  
  enterButton?.addEventListener('click', () => {
    playChime();
    playAvatarIntro(); // Trigger voice immediately for iOS Safari compatibility
    closeWelcome();
  });

  skipButton?.addEventListener('click', () => {
    closeWelcome();
  });

  // Welcome Avatar Parallax
  const welcomeStage = document.getElementById('avatar-stage');
  const welcomeHead = document.getElementById('welcome-avatar-head-group');
  if (welcomeStage && welcomeHead && !reducedMotion) {
    welcomeStage.addEventListener('mousemove', (e) => {
      const rect = welcomeStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      welcomeHead.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0)`;
    });
    welcomeStage.addEventListener('mouseleave', () => {
      welcomeHead.style.transform = 'translate3d(0, 0, 0)';
    });
  }
  document.addEventListener('keydown', (event) => {
    if (welcomeClosed) return;
    if (event.key === 'Enter') enterButton?.click();
    if (event.key === 'Escape') skipButton?.click();
  });

  /* ========================================================
     PREMIUM GRAPHICS, CURSOR & INTERACTIVITY INTEGRATION
     ======================================================== */

  // 1. Lenis Smooth Scroll Initialization (Disabled on touch devices for iPhone/Mobile fluid scrolling)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (typeof Lenis !== 'undefined' && !isTouchDevice) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Standard Lenis scroll handler to update ScrollTrigger
    lenis.on('scroll', () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // 2. Custom Animated & Interactive Cursor
  const dot = document.getElementById('custom-cursor-dot');
  const circle = document.getElementById('custom-cursor-circle');
  if (dot && circle && !reducedMotion) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let circleX = 0, circleY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      dotX += (mouseX - dotX) * 0.22;
      dotY += (mouseY - dotY) * 0.22;
      circleX += (mouseX - circleX) * 0.11;
      circleY += (mouseY - circleY) * 0.11;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      circle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Dynamic Hover States on Interactives
    const updateInteractives = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], .filter, .show-more, .social-links a');
      interactives.forEach((el) => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
      });
    };
    updateInteractives();
    // Re-run whenever dynamic projects are toggled or filter states change
    const showMoreBtn = document.querySelector('.show-more');
    showMoreBtn?.addEventListener('click', () => window.setTimeout(updateInteractives, 100));
    const filters = document.querySelectorAll('.filter');
    filters.forEach(f => f.addEventListener('click', () => window.setTimeout(updateInteractives, 100)));
  }

  // 3. GSAP Scroll-Triggered Staggered Reveals
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    // Section Fade-In Slide Reveals
    const revealSections = document.querySelectorAll('section, .story-section');
    revealSections.forEach((sec) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Staggered Capability Grid Reveals
    gsap.fromTo('.capability-grid article',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.capability-grid',
          start: 'top 85%'
        }
      }
    );

    // Staggered Skill Group Reveals
    gsap.fromTo('.skill-group',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.skills-layout',
          start: 'top 85%'
        }
      }
    );

    // Staggered Timeline Reveals
    gsap.fromTo('.timeline article',
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 85%'
        }
      }
    );
  }

  // 4. Interactive 3D Card Tilt Mouse Tracker
  const init3dTilt = () => {
    const cards = document.querySelectorAll('.project, .skill-group, .capability-grid article');
    cards.forEach((card) => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = 'true';
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const angleX = (yc - y) / 18;
        const angleY = (x - xc) / 18;
        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-6px) scale(1.015)`;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
      });
    });
  };
  if (!reducedMotion && !isTouchDevice && window.innerWidth >= 768) {
    init3dTilt();
    // Re-bind when filters hide/show elements or load extra projects
    const showMoreBtnTilt = document.querySelector('.show-more');
    showMoreBtnTilt?.addEventListener('click', () => window.setTimeout(init3dTilt, 100));
    const filters = document.querySelectorAll('.filter');
    filters.forEach(f => f.addEventListener('click', () => window.setTimeout(init3dTilt, 100)));
  }

  /* ========================================================
     INTERACTIVE SPEAKING AVATAR & HERO ANIMATION CONTROLLER
     ======================================================== */
  const speakBtn = document.getElementById('avatar-btn-play');
  const muteBtn = document.getElementById('avatar-btn-mute');
  const replayBtn = document.getElementById('avatar-btn-replay');
  const avatarSvg = document.getElementById('avatar-svg');
  const waveVisualizer = document.getElementById('avatar-wave-visualizer');
  const captionsEl = document.getElementById('avatar-captions');
  const heroActions = document.querySelector('.hero-actions');

  const introText = "Hi, I'm Muhammad Asad. I am a Software Engineering undergraduate at Bahria University Karachi and a backend developer specialized in Python, Django, REST Framework, and Java, with a strong grasp of .NET and enterprise backend systems. I am particularly passionate about database modeling, schema optimization, and clean architecture, designing solid database layers that power high-performance applications. Welcome to my portfolio, feel free to explore my work and download my resume!";
  const introWords = introText.split(" ");
  let speechUtterance = null;
  let speakMouthInterval = null;
  let ctaTimeout = null;

  // Initialize CTA buttons to visible state immediately for better load performance
  if (heroActions) {
    heroActions.style.opacity = '1';
    heroActions.style.transform = 'translateY(0)';
    heroActions.style.pointerEvents = 'auto';
    heroActions.style.transition = 'opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  }

  const revealCTA = () => {
    if (ctaTimeout) window.clearTimeout(ctaTimeout);
  };

  const startMouthSync = () => {
    const mouth = document.getElementById('avatar-mouth');
    if (!mouth) return;
    const frames = [
      "M86 114 Q100 114 114 114", // smile
      "M86 114 Q100 124 114 114", // open wide
      "M88 114 Q100 119 112 114", // half open
      "M90 114 Q100 123 110 114"  // narrow open
    ];
    let idx = 0;
    speakMouthInterval = window.setInterval(() => {
      idx = (idx + 1) % frames.length;
      mouth.setAttribute('d', frames[idx]);
    }, 110);
  };

  const stopMouthSync = () => {
    if (speakMouthInterval) {
      window.clearInterval(speakMouthInterval);
      speakMouthInterval = null;
    }
    const mouth = document.getElementById('avatar-mouth');
    if (mouth) mouth.setAttribute('d', "M86 114 Q100 114 114 114");
  };

  const playAvatarIntro = () => {
    if (!('speechSynthesis' in window)) {
      captionsEl.textContent = "Text-to-speech not supported in this browser.";
      revealCTA();
      return;
    }

    window.speechSynthesis.cancel();
    if (ctaTimeout) window.clearTimeout(ctaTimeout);

    speechUtterance = new SpeechSynthesisUtterance(introText);
    
    // Choose high-quality English voice if available
    const voices = window.speechSynthesis.getVoices();
    const optimalVoice = voices.find(v => /^en-(PK|GB|US)/i.test(v.lang)) || voices.find(v => /^en/i.test(v.lang));
    if (optimalVoice) speechUtterance.voice = optimalVoice;
    
    speechUtterance.rate = 0.94;
    speechUtterance.pitch = 1.02;

    speechUtterance.onstart = () => {
      avatarSvg?.classList.add('speaking');
      waveVisualizer?.classList.add('active');
      speakBtn?.classList.add('hidden');
      muteBtn?.classList.remove('hidden');
      replayBtn?.classList.add('hidden');
      startMouthSync();
    };

    speechUtterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIdx = e.charIndex;
        let runningLen = 0;
        let wordIdx = 0;
        
        for (let i = 0; i < introWords.length; i++) {
          if (charIdx >= runningLen && charIdx < runningLen + introWords[i].length + 1) {
            wordIdx = i;
            break;
          }
          runningLen += introWords[i].length + 1;
        }

        const formatted = introWords.map((w, index) => {
          if (index === wordIdx) return `<span class="highlight">${w}</span>`;
          return w;
        }).join(" ");

        if (captionsEl) captionsEl.innerHTML = formatted;
      }
    };

    speechUtterance.onend = () => {
      avatarSvg?.classList.remove('speaking');
      waveVisualizer?.classList.remove('active');
      muteBtn?.classList.add('hidden');
      replayBtn?.classList.remove('hidden');
      stopMouthSync();
      if (captionsEl) captionsEl.textContent = "Welcome to my portfolio!";
      revealCTA();
    };

    speechUtterance.onerror = () => {
      avatarSvg?.classList.remove('speaking');
      waveVisualizer?.classList.remove('active');
      muteBtn?.classList.add('hidden');
      speakBtn?.classList.remove('hidden');
      stopMouthSync();
      revealCTA();
    };

    window.speechSynthesis.speak(speechUtterance);
  };

  const muteAvatarIntro = () => {
    window.speechSynthesis.cancel();
    avatarSvg?.classList.remove('speaking');
    waveVisualizer?.classList.remove('active');
    muteBtn?.classList.add('hidden');
    replayBtn?.classList.remove('hidden');
    stopMouthSync();
    if (captionsEl) captionsEl.textContent = "Intro muted. Welcome!";
    revealCTA();
  };

  speakBtn?.addEventListener('click', playAvatarIntro);
  muteBtn?.addEventListener('click', muteAvatarIntro);
  replayBtn?.addEventListener('click', playAvatarIntro);

  // Mouse Parallax on Portrait Frame in Hero section
  const heroSection = document.getElementById('home');
  const portraitFrame = document.getElementById('hero-portrait-frame');
  const auraGlow = document.querySelector('.avatar-aura-glow');

  if (heroSection && !reducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Tilting the portrait frame in 3D perspective
      if (portraitFrame) portraitFrame.style.transform = `translate3d(${x * -16}px, ${y * -12}px, 0) rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
      if (auraGlow) auraGlow.style.transform = `translate3d(${x * 15}px, ${y * 10}px, 0)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      if (portraitFrame) portraitFrame.style.transform = 'translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)';
      if (auraGlow) auraGlow.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  // 5. Skill Detail Modal Click Handlers & Explanations Database
  const initSkillModal = () => {
    const skillData = {
      "C#": "I explore game development using C#, applying OOP principles to design interactive and performance-optimized experiences, particularly using engines like Unity.",
      "Python": "I utilize Python for automation, data analysis, and backend development, focusing on writing clean, efficient, and scalable scripts.",
      "Java": "I leverage Java to build robust cross-platform applications, applying strong Object-Oriented Programming (OOP) principles for maintainability.",
      "JavaScript": "I use modern JavaScript to create dynamic, interactive frontend experiences, ensuring seamless user interactions.",
      "JavaScript (ES6+)": "I use modern JavaScript (ES6+) to create dynamic, interactive frontend experiences, ensuring seamless user interactions.",
      "Node.js": "I build scalable and efficient server-side applications using Node.js, focusing on event-driven, non-blocking I/O models.",
      "HTML / CSS": "With my strong CSS skills, I style websites to be visually appealing, ensuring they are responsive and perform well across various devices. I structure web content effectively using semantic HTML.",
      "HTML/CSS": "With my strong CSS skills, I style websites to be visually appealing, ensuring they are responsive and perform well across various devices. I structure web content effectively using semantic HTML.",
      "SQL": "I design and query relational databases with SQL, ensuring data integrity and optimizing retrieval for efficient performance.",
      "PostgreSQL": "I design and manage robust relational database systems with PostgreSQL, optimizing queries and structuring database schemas for reliability.",
      "SQL Server": "I design schemas, write complex stored procedures, and manage database performance with Microsoft SQL Server.",
      "MS SQL Server": "I design schemas, write complex stored procedures, and manage database performance with Microsoft SQL Server.",
      "Oracle": "I work with Oracle Database systems, managing tablespaces, users, schemas, and implementing database security and constraints.",
      "Oracle DB": "I work with Oracle Database systems, managing tablespaces, users, schemas, and implementing database security and constraints.",
      "SQL Queries": "I write and optimize advanced SQL queries involving complex joins, subqueries, CTEs, window functions, and indexing for high performance.",
      "MIPS Assembly": "I write low-level assembly code using the MIPS instruction set, focusing on understanding computer architecture and optimizing for hardware.",
      ".NET": "I build modern, high-performance web APIs and applications using .NET Core and ASP.NET to deliver scalable solutions.",
      ".NET Core": "I build modern, high-performance web APIs and applications using .NET Core and ASP.NET to deliver scalable solutions.",
      "ASP.NET MVC": "I build dynamic, structured enterprise web applications using the ASP.NET MVC framework with C# and the .NET ecosystem.",
      "Linux Command Line": "Proficient in using the Linux terminal for file manipulation, system administration, process management, and automating tasks.",
      "Visual Studio": "I expertly use Visual Studio for efficient code editing, debugging, and managing complex project lifecycles.",
      "Git & GitHub": "I manage version control effectively using Git and GitHub, facilitating smooth collaboration and code history tracking.",
      "React": "I build component-based user interfaces with React, creating fast single-page applications with reusable stateful components.",
      "Django": "I develop secure and maintainable web applications using the Django framework, adhering to best practices and MVC/MVT architecture.",
      "Django REST": "I build secure and maintainable web APIs using the Django REST framework, adhering to best practices and robust serialization.",
      "Streamlit": "I build interactive data dashboards and dashboard interfaces with Streamlit to visualize complex data trends.",
      "Docker": "I use Docker to containerize applications, ensuring consistent deployment environments across development and production.",
      "Data Structures": "I apply Data Structures effectively to optimize code performance and solve complex computational problems.",
      "Algorithms": "I analyze and implement efficient algorithms for sorting, searching, and pathfinding to enhance application logic.",
      "Design and Analysis of Algorithms": "I analyze computational complexity and design efficient algorithms to solve complex programming and logical problems.",
      "OOP": "I apply Object-Oriented Programming concepts like Inheritance, Polymorphism, and Encapsulation to write modular and reusable code.",
      "System Design": "I apply system design principles to create scalable, maintainable, and reliable software architectures.",
      "Software Architecture": "I design system architectures with clean separation of layers, focusing on scalability, security, and component decoupling.",
      "Software Design Patterns": "I apply creational, structural, and behavioral design patterns to solve common software design challenges with reusable solutions.",
      "Software Design Principles": "I follow clean code principles, SOLID design guidelines, and separation of concerns to write highly maintainable codebases.",
      "Requirement Elicitation": "I gather and analyze software requirements meticulously to ensure project goals align with user needs.",
      "Digital Logic and Design": "I apply knowledge of digital logic circuits to bridge the gap between hardware and software integration."
    };

    const skillItems = document.querySelectorAll('.skill-item');
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.getElementById('closeModalBtn');

    if (modal && skillItems.length > 0) {
      skillItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const skillName = item.innerText.trim();
          if (modalTitle) modalTitle.innerText = skillName;
          if (modalDesc) modalDesc.innerText = skillData[skillName] || `Expertise in ${skillName}.`;
          modal.classList.add('active');
        });
      });

      if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          modal.classList.remove('active');
        }
      });
    }
  };
  initSkillModal();

  /* ========================================================
     ADDITIONAL CUSTOM INTERACTIVITY & TOOLTIP TIME/PARTICLES
     ======================================================== */

  // 1. Live local time clock for Karachi status label
  const initKarachiClock = () => {
    const timeEl = document.getElementById('karachi-time');
    const label = document.getElementById('portrait-label');
    if (!timeEl || !label) return;

    const updateClock = () => {
      try {
        const options = {
          timeZone: 'Asia/Karachi',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(new Date());
        
        const hourPart = parts.find(p => p.type === 'hour');
        const minutePart = parts.find(p => p.type === 'minute');
        const secondPart = parts.find(p => p.type === 'second');
        const dayPeriodPart = parts.find(p => p.type === 'dayPeriod');
        
        const timeStr = `${hourPart.value}:${minutePart.value}:${secondPart.value} ${dayPeriodPart ? dayPeriodPart.value : ''}`;
        timeEl.textContent = timeStr;

        // Toggle icon between Sun/Moon depending on hour
        let hourNum = parseInt(hourPart.value, 10);
        if (dayPeriodPart) {
          const ampm = dayPeriodPart.value.toLowerCase();
          if (ampm === 'pm' && hourNum < 12) hourNum += 12;
          if (ampm === 'am' && hourNum === 12) hourNum = 0;
        }

        const iconEl = label.querySelector('.tooltip-icon');
        if (iconEl) {
          if (hourNum >= 6 && hourNum < 18) {
            iconEl.textContent = '☀️'; // Day
          } else {
            iconEl.textContent = '🌙'; // Night
          }
        }
      } catch (err) {
        console.error('Time formatting error:', err);
      }
    };

    updateClock();
    window.setInterval(updateClock, 1000);
  };

  // 2. Draggable Code Card logic (desktop mouse/touch events)
  const initDraggableCard = () => {
    const card = document.getElementById('code-card');
    const header = document.getElementById('code-card-header');
    if (!card || !header) return;

    let active = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;

    const isMobile = () => window.innerWidth <= 700;

    const dragStart = (e) => {
      if (isMobile()) return;
      
      // Exclude tab buttons and window controls from dragging
      if (e.target.closest('.code-tab') || e.target.closest('.win-btn')) return;

      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

      initialX = clientX - xOffset;
      initialY = clientY - yOffset;

      if (e.target === header || header.contains(e.target)) {
        active = true;
      }
    };

    const dragEnd = () => {
      initialX = currentX;
      initialY = currentY;
      active = false;
    };

    const drag = (e) => {
      if (!active || isMobile()) return;

      e.preventDefault();

      const clientX = e.type === 'touchmove' ? e.touches[0].type : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

      // Handle raw values
      const posX = e.type === 'touchmove' ? e.touches[0].clientX : clientX;
      const posY = e.type === 'touchmove' ? e.touches[0].clientY : clientY;

      currentX = posX - initialX;
      currentY = posY - initialY;

      xOffset = currentX;
      yOffset = currentY;

      card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    };

    header.addEventListener('mousedown', dragStart, false);
    document.addEventListener('mouseup', dragEnd, false);
    document.addEventListener('mousemove', drag, false);

    header.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('touchend', dragEnd, false);
    document.addEventListener('touchmove', drag, { passive: false });
  };

  // 3. Interactive Code Card Actions (Close, Minimize, Run & Tabs)
  const initCodeCardActions = () => {
    const card = document.getElementById('code-card');
    const closeBtn = document.getElementById('btn-close');
    const minimizeBtn = document.getElementById('btn-minimize');
    const runBtn = document.getElementById('btn-run');
    const restoreBtn = document.getElementById('restore-code-btn');

    const tabs = document.querySelectorAll('.code-tab');
    const contents = document.querySelectorAll('.tab-content');

    if (!card) return;

    // Tabs Click handler
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const activeContent = document.getElementById(`content-${targetTab}`);
        if (activeContent) activeContent.classList.add('active');
      });
    });

    // Minimize Handler
    minimizeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      card.classList.toggle('minimized');
    });

    // Close/Hide Handler
    closeBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';
      card.style.transform = 'scale(0.8) translateY(20px)';

      setTimeout(() => {
        card.style.visibility = 'hidden';
        restoreBtn?.classList.add('show');
      }, 300);
    });

    // Restore Handler
    restoreBtn?.addEventListener('click', () => {
      card.style.visibility = 'visible';
      card.style.opacity = '1';
      card.style.pointerEvents = 'auto';
      card.style.transform = 'scale(1) translate3d(0, 0, 0)';
      
      // Reset drag variables if card is restored
      card.style.left = '';
      card.style.top = '';
      
      restoreBtn.classList.remove('show');
    });

    // Run Simulation Handler
    let isRunning = false;
    runBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isRunning) return;
      isRunning = true;

      // Auto-switch to terminal tab
      const terminalTab = document.querySelector('[data-tab="terminal"]');
      terminalTab?.click();

      const terminalOutput = document.getElementById('terminal-output');
      if (!terminalOutput) { isRunning = false; return; }

      // Clear terminal
      terminalOutput.innerHTML = '';

      const lines = [
        { text: 'node current-focus.js', delay: 150, isCommand: true },
        { text: 'Initializing portfolio systems...', delay: 900 },
        { text: 'Resolving undergraduate metrics...', delay: 1400 },
        { text: '[SUCCESS] Core values initialized:', delay: 1900, isSuccess: true },
        { text: ' -> "clean architecture" (OK)', delay: 2150 },
        { text: ' -> "meaningful UX" (OK)', delay: 2350 },
        { text: ' -> "continuous learning" (OK)', delay: 2550 },
        { text: 'Process finished with exit code 0.', delay: 2900, isSuccess: true }
      ];

      const triggerRunParticles = () => {
        const rect = card.getBoundingClientRect();
        const px = rect.left + rect.width / 2;
        const py = rect.top + rect.height / 2;
        createBurstParticles(px, py);
      };

      lines.forEach(line => {
        window.setTimeout(() => {
          // Remove active cursor
          const cursor = terminalOutput.querySelector('.terminal-cursor');
          if (cursor) cursor.remove();

          const div = document.createElement('div');
          div.className = 'terminal-line';

          if (line.isCommand) {
            div.className += ' command';
            div.innerHTML = `<span class="terminal-prompt">$</span> <span class="command-text"></span><span class="terminal-cursor">_</span>`;
            terminalOutput.appendChild(div);

            const text = line.text;
            let idx = 0;
            const type = () => {
              const cmdEl = div.querySelector('.command-text');
              if (cmdEl && idx < text.length) {
                cmdEl.textContent += text[idx++];
                window.setTimeout(type, 45);
              }
            };
            type();
          } else {
            if (line.isSuccess) div.className += ' success';
            div.textContent = line.text;
            terminalOutput.appendChild(div);

            // Append cursor at bottom line
            const cursorDiv = document.createElement('div');
            cursorDiv.className = 'terminal-line';
            cursorDiv.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cursor">_</span>`;
            terminalOutput.appendChild(cursorDiv);

            // Scroll screen
            const screen = document.querySelector('.terminal-screen');
            if (screen) screen.scrollTop = screen.scrollHeight;
          }

          if (line.text.includes('exit code 0')) {
            triggerRunParticles();
            isRunning = false;
          }
        }, line.delay);
      });
    });

    // Particle Burst Canvas Simulation
    const createBurstParticles = (x, y) => {
      const parent = document.body;
      const limit = 28;
      const palette = ['#7ce7c2', '#94b9ff', '#b99cff', '#ffffff'];

      for (let i = 0; i < limit; i++) {
        const dot = document.createElement('div');
        dot.style.position = 'fixed';
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        dot.style.width = `${Math.random() * 6 + 4}px`;
        dot.style.height = dot.style.width;
        dot.style.borderRadius = '50%';
        dot.style.backgroundColor = palette[Math.floor(Math.random() * palette.length)];
        dot.style.boxShadow = `0 0 10px ${dot.style.backgroundColor}`;
        dot.style.pointerEvents = 'none';
        dot.style.zIndex = '99999';

        parent.appendChild(dot);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 7 + 4;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let curX = x;
        let curY = y;
        let alpha = 1;

        const update = () => {
          curX += vx;
          curY += vy;
          alpha -= 0.022;

          dot.style.transform = `translate3d(${curX - x}px, ${curY - y}px, 0)`;
          dot.style.opacity = alpha;

          if (alpha > 0) {
            requestAnimationFrame(update);
          } else {
            dot.remove();
          }
        };
        requestAnimationFrame(update);
      }
    };
  };

  // 4. Contact Form AJAX Submission logic via Web3Forms
  const initContactForm = () => {
    const form = document.getElementById('portfolio-contact-form');
    const submitBtn = document.getElementById('form-submit-btn');
    const statusMsg = document.getElementById('form-status-msg');

    if (!form || !submitBtn || !statusMsg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnSpan = submitBtn.querySelector('span');
      const originalText = btnSpan.textContent;
      btnSpan.textContent = "Sending...";
      submitBtn.disabled = true;

      statusMsg.style.display = 'none';
      statusMsg.textContent = '';

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      const json = JSON.stringify(data);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        const responseData = await response.json();
        if (response.status === 200) {
          btnSpan.textContent = "Sent!";
           statusMsg.textContent = "Thank you! Your message has been sent successfully.";
           statusMsg.className = 'form-status-success';
           statusMsg.style.display = 'block';
           form.reset();
         } else {
           btnSpan.textContent = "Error";
           statusMsg.textContent = responseData.message || "Something went wrong. Please try again.";
           statusMsg.className = 'form-status-error';
           statusMsg.style.display = 'block';
         }
       })
       .catch((error) => {
         console.error('Form submission error:', error);
         btnSpan.textContent = "Error";
         statusMsg.textContent = "Unable to connect. Please check your network and try again.";
         statusMsg.className = 'form-status-error';
         statusMsg.style.display = 'block';
       })
      .finally(() => {
        setTimeout(() => {
          btnSpan.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  };

  // 3. Journey Interactive Milestone Nodes Visualizer
  const initJourneyVisuals = () => {
    const timelineArticles = document.querySelectorAll('#timeline-list article');
    const milestoneNodes = document.querySelectorAll('.milestone-node');
    
    if (!timelineArticles.length || !milestoneNodes.length) return;
    
    timelineArticles.forEach((article) => {
      article.addEventListener('mouseenter', () => {
        timelineArticles.forEach(a => a.classList.remove('active'));
        milestoneNodes.forEach(n => n.classList.remove('active'));
        
        article.classList.add('active');
        const index = article.getAttribute('data-timeline-index');
        const targetNode = document.querySelector(`.milestone-node[data-node-index="${index}"]`);
        if (targetNode) {
          targetNode.classList.add('active');
        }
      });
    });
  };

  // 4. Dynamic Background Particle Web System
  const initParticles = () => {
    // Disable canvas system on mobile viewports for maximum battery and scrolling performance
    if (window.innerWidth < 768) return;

    const canvas = document.getElementById('particle-field');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.35;
        this.speedY = -Math.random() * 0.4 - 0.1;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.y < 0) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
        }
        if (this.x < 0 || this.x > canvas.width) {
          this.speedX = -this.speedX;
        }
      }
      
      draw() {
        const isLight = document.body.classList.contains('light');
        ctx.fillStyle = isLight ? 'rgba(13, 159, 112, 0.45)' : 'rgba(124, 231, 194, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }
    
    const initList = () => {
      particles = [];
      const isMobile = window.innerWidth < 768;
      const density = isMobile ? 32000 : 16000;
      const quantity = Math.min(Math.floor((canvas.width * canvas.height) / density), isMobile ? 30 : 70);
      for (let i = 0; i < quantity; i++) {
        particles.push(new Particle());
      }
    };
    initList();
    window.addEventListener('resize', initList);
    
    const connect = () => {
      const isLight = document.body.classList.contains('light');
      const lineColor = isLight ? 'rgba(13, 159, 112, ' : 'rgba(124, 231, 194, ';
      const isMobile = window.innerWidth < 768;
      const maxDist = isMobile ? 85 : 100;
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = lineColor + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
        
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[a].x - mouse.x;
          const dy = particles[a].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.18;
            ctx.strokeStyle = lineColor + alpha + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      
      connect();
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  // Run initializers
  initParticles();
  initKarachiClock();
  // initDraggableCard();
  initCodeCardActions();
  initContactForm();
  initJourneyVisuals();
})();

