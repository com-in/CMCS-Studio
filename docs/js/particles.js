function initParticles() {
    const theme = localStorage.getItem('selectedTheme') || 'system';
    
    const configs = {
        system: {
            opacity: 0.3,
            size: 2,
            number: 40,
            speed: 1,
            lineOpacity: 0.2
        },
        light: {
            opacity: 0.15,
            size: 1.2,
            number: 25,
            speed: 2,
            lineOpacity: 0.08,
            distance: 220
        },
        dark: {
            opacity: 0.7,
            size: 4,
            number: 80,
            speed: 0.6,
            lineOpacity: 0.4,
            distance: 180
        },
        blue: {
            opacity: 0.25,
            size: 2.5,
            number: 50,
            speed: 1.2,
            lineOpacity: 0.15
        },
        gray: {
            opacity: 0.4,
            size: 2.8,
            number: 45,
            speed: 1,
            lineOpacity: 0.25
        }
    };

    const config = configs[theme] || configs.system;

    particlesJS('particles-js', {
        particles: {
            number: {
                value: config.number,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: {
                value: "#4fc3f7"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                }
            },
            opacity: {
                value: config.opacity,
                random: false,
                anim: {
                    enable: false
                }
            },
            size: {
                value: config.size,
                random: false
            },
            line_linked: {
                enable: true,
                distance: 200,
                color: "#4fc3f7",
                opacity: config.lineOpacity,
                width: 1
            },
            move: {
                enable: true,
                speed: config.speed,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// 初始化粒子效果
document.addEventListener('DOMContentLoaded', initParticles);

// 主题切换时重新初始化粒子效果
document.addEventListener('themeChanged', function() {
    // 先销毁现有粒子效果
    if (window.pJSDom && window.pJSDom.length > 0) {
        window.pJSDom[0].pJS.fn.vendors.destroypJS();
        window.pJSDom = [];
    }
    // 初始化新粒子效果
    initParticles();
});
