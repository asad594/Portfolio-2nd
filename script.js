document.addEventListener('DOMContentLoaded', () => {
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

    // Custom Cursor (Optional - Simple implementation)
    const cursor = document.querySelector('.custom-cursor');
    // Check if device has mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        cursor.style.display = 'block';
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect to links
        const links = document.querySelectorAll('a, button, .project-card, .skill-item');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.backgroundColor = 'rgba(100, 255, 218, 0.1)';
            });
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.backgroundColor = 'transparent';
            });
        });
    }

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

