document.addEventListener('DOMContentLoaded', () => {
    // Welcome Splash Screen Loader
    const welcomeScreen = document.getElementById('welcome-screen');
    const welcomeLoaderBar = document.querySelector('.welcome-loader-bar');
    const welcomeCounter = document.querySelector('.welcome-counter');
    const welcomeZone = document.querySelector('.welcome-interactive-zone');
    const enterBtn = document.getElementById('enter-portfolio-btn');
    
    if (welcomeScreen && welcomeLoaderBar) {
        document.body.classList.add('lock-scroll');
        
        let progress = 0;
        const speed = 10; // Fast load
        
        const loadingInterval = setInterval(() => {
            progress += 15;
            if (progress > 100) progress = 100;
            
            welcomeLoaderBar.style.width = `${progress}%`;
            if (welcomeCounter) {
                welcomeCounter.innerText = `${progress.toString().padStart(2, '0')}%`;
            }
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    if (welcomeZone) {
                        welcomeZone.classList.add('loaded');
                    }
                    // Highlight outer scanning ring solid on completion
                    const outerRing = document.querySelector('.scanner-outer');
                    if (outerRing) {
                        outerRing.style.borderStyle = 'solid';
                        outerRing.style.borderColor = 'var(--accent)';
                    }
                }, 300);
            }
        }, speed);
        
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                welcomeScreen.classList.add('exit');
                setTimeout(() => {
                    welcomeScreen.style.display = 'none';
                    document.body.classList.remove('lock-scroll');
                }, 400); // reduced from 900 for faster scroll unlock
            });
        }
    }

    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    fadeElements.forEach(el => observer.observe(el));

    // Custom Cursor removed for performance and usability

    // Navbar Scroll Effect (optional, adding shadow)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Staggered animation for links
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `fadeInRight 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    // Close menu when a link is clicked
    navLinks.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });

    // Scroll to Top Logic
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('active');
        } else {
            scrollToTopBtn.classList.remove('active');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            scrollProgress.style.width = scrolled + '%';
        });
    }

    // Theme Accent Switcher Logic
    const themeBtn = document.querySelector('.theme-btn');
    const themePalette = document.querySelector('.theme-palette');
    const colorDots = document.querySelectorAll('.color-dot');

    if (themeBtn && themePalette) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themePalette.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!themeBtn.contains(e.target) && !themePalette.contains(e.target)) {
                themePalette.classList.remove('active');
            }
        });
    }

    if (colorDots.length > 0) {
        colorDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const color = dot.getAttribute('data-color');
                
                if (color === 'teal') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', color);
                }

                colorDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');

                localStorage.setItem('portfolio-theme', color);
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme) {
            const activeDot = document.querySelector(`.color-dot[data-color="${savedTheme}"]`);
            if (activeDot) {
                // Remove active class from all first
                colorDots.forEach(d => d.classList.remove('active'));
                activeDot.classList.add('active');
                if (savedTheme === 'teal') {
                    document.documentElement.removeAttribute('data-theme');
                } else {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                }
            }
        }
    }

    // 3D Hover Tilt & Spotlight effect
    const tiltCards = document.querySelectorAll('.portfolio-box, .skill-category, .feature-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltX = (centerY - y) / 15;
            const tiltY = (x - centerX) / 15;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // Magnetic Hover Effect
    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach(target => {
        target.addEventListener('mousemove', (e) => {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            target.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
        });

        target.addEventListener('mouseleave', () => {
            target.style.transform = 'translate(0px, 0px)';
        });
    });

    // ==========================================
    // Full-page Mouse Spotlight Glow Tracking
    // ==========================================
    document.addEventListener('mousemove', (e) => {
        document.documentElement.style.setProperty('--mouse-bg-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-bg-y', `${e.clientY}px`);
    });

    // ==========================================
    // Project Category Filtering
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.portfolio-box');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (filter === 'all' || categories.includes(filter)) {
                        card.classList.remove('hide');
                        requestAnimationFrame(() => {
                            card.classList.remove('fade-out');
                        });
                    } else {
                        card.classList.add('fade-out');
                        setTimeout(() => {
                            if (card.classList.contains('fade-out')) {
                                card.classList.add('hide');
                            }
                        }, 300);
                    }
                });
            });
        });
    }

    // ==========================================
    // Auto-Typing Hero Subtitle Animation
    // ==========================================
    const typedTextSpan = document.querySelector('.typed-text');
    if (typedTextSpan) {
        const textArray = ["Python, Java & C#", "Modern Web Frameworks", "Object-Oriented Programming", "Scalable Database Architectures"];
        const typingSpeed = 100;
        const erasingSpeed = 60;
        const newTextDelay = 2000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingSpeed + 500);
            }
        }

        setTimeout(type, 1000);
    }
});

// Skill Detail Modal Logic
(function () {
    console.log("Initializing Skill Modal Logic...");

    const skillData = {
        "C#": "I explore game development using C#, applying OOP principles to design interactive and performance-optimized experiences, particularly using engines like Unity.",
        "Python": "I utilize Python for automation, data analysis, and backend development, focusing on writing clean, efficient, and scalable scripts.",
        "Java": "I leverage Java to build robust cross-platform applications, applying strong Object-Oriented Programming (OOP) principles for maintainability.",
        "JavaScript (ES6+)": "I use modern JavaScript (ES6+) to create dynamic, interactive frontend experiences, ensuring seamless user interactions.",
        "Node.js": "I build scalable and efficient server-side applications using Node.js, focusing on event-driven, non-blocking I/O models.",
        "HTML/CSS": "With my strong CSS skills, I can style websites to be visually appealing, ensuring they are responsive and perform well across various devices. I structure web content effectively using semantic HTML.",
        "HTML": "I have a solid understanding of HTML, enabling me to structure web content effectively and create well-organized, semantic web pages.",
        "SQL": "I design and query relational databases with SQL, ensuring data integrity and optimizing retrieval for efficient performance.",
        "PostgreSQL": "I design and manage robust relational database systems with PostgreSQL, optimizing queries and structuring database schemas for reliability.",
        "MS SQL Server": "I design schemas, write complex stored procedures, and manage database performance with Microsoft SQL Server.",
        "Oracle DB": "I work with Oracle Database systems, managing tablespaces, users, schemas, and implementing database security and constraints.",
        "SQL Queries": "I write and optimize advanced SQL queries involving complex joins, subqueries, CTEs, window functions, and indexing for high performance.",
        "MySQL": "I use MySQL for building relational database schemas, handling transactions, and integrating backend databases with application layers.",
        "PL/SQL": "I write procedural database code using Oracle PL/SQL, including stored procedures, functions, packages, and database triggers.",
        "Linux Command Line": "Proficient in using the Linux terminal for file manipulation, system administration, process management, and automating tasks.",
        "Bash Scripting": "I write shell scripts to automate repetitive system tasks, configure environments, and orchestrate basic deployment workflows.",
        ".NET Core": "I build modern, high-performance web APIs and applications using .NET Core and ASP.NET to deliver scalable solutions.",
        "ASP.NET MVC": "I build dynamic, structured enterprise web applications using the ASP.NET MVC framework with C# and the .NET ecosystem.",
        "Visual Studio": "I expertly use Visual Studio for efficient code editing, debugging, and managing complex project lifecycles.",
        "Git & GitHub": "I manage version control effectively using Git and GitHub, facilitating smooth collaboration and code history tracking.",
        "React": "I build component-based user interfaces with React, creating fast single-page applications with reusable stateful components.",
        "Django": "I develop secure and maintainable web applications using the Django framework, adhering to best practices and MVC/MVT architecture.",
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
        "Requriment Elicitation": "I gather and analyze software requirements meticulously to ensure project goals align with user needs.", /* Typo Fallback */
        "Digital Logic and Design": "I apply knowledge of digital logic circuits to bridge the gap between hardware and software integration."
    };

    const skillItems = document.querySelectorAll('.skill-item');
    const modal = document.getElementById('skillModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const closeBtn = document.getElementById('closeModalBtn');
    const modalIcon = document.getElementById('modalIcon');

    if (!modal) {
        console.error("Skill Modal ID 'skillModal' not found!");
        return;
    }

    if (skillItems.length === 0) {
        console.warn("No .skill-item elements found!");
    }

    // click handler function
    const openModal = (skillName) => {
        if (!modalTitle || !modalDesc) return;

        modalTitle.innerText = skillName;
        // Use data or fallback
        const desc = skillData[skillName] || skillData[Object.keys(skillData).find(k => k.includes(skillName))] || `Expertise in ${skillName}.`;
        modalDesc.innerText = desc;

        // Show
        modal.classList.add('active');
    };

    skillItems.forEach(item => {
        item.style.cursor = 'pointer';
        // Remove old listeners (not easily possible without named function, but safe to add new one)
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling issues
            const skillName = item.innerText.trim();
            console.log("Clicked skill:", skillName);
            openModal(skillName);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

})();

// Hamburger Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
});

