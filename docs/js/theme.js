// 主题配置
const themes = {
    system: {
        name: '系统默认',
        colors: {
            '--primary-color': '#4fc3f7',
            '--text-color': '#333',
            '--bg-color': '#f9f9f9',
            '--card-bg': '#fff',
            '--border-color': '#eee',
            '--footer-bg': '#f0f0f0'
        }
    },
    light: {
        name: '浅色主题',
        colors: {
            '--primary-color': '#4fc3f7',
            '--text-color': '#333',
            '--bg-color': '#ffffff',
            '--card-bg': '#f9f9f9',
            '--border-color': '#e0e0e0',
            '--footer-bg': '#f5f5f5'
        }
    },
    dark: {
        name: '深色主题',
        colors: {
            '--primary-color': '#4fc3f7',
            '--text-color': '#f5f5f5',
            '--bg-color': '#121212',
            '--card-bg': '#1e1e1e',
            '--border-color': '#333',
            '--footer-bg': '#1a1a1a'
        }
    },
    blue: {
        name: '淡蓝色主题',
        colors: {
            '--primary-color': '#4fc3f7',
            '--text-color': '#333',
            '--bg-color': '#f0f8ff',
            '--card-bg': '#e6f2ff',
            '--border-color': '#cce0ff',
            '--footer-bg': '#d9ecff'
        }
    },
    gray: {
        name: '浅灰色主题',
        colors: {
            '--primary-color': '#4fc3f7',
            '--text-color': '#333',
            '--bg-color': '#e8e8e8',
            '--card-bg': '#d8d8d8',
            '--border-color': '#c8c8c8',
            '--footer-bg': '#d8d8d8'
        }
    },
    green: {
        name: '自然绿主题',
        colors: {
            '--primary-color': '#28a745',
            '--text-color': '#333',
            '--bg-color': '#f0fff4',
            '--card-bg': '#ffffff',
            '--border-color': '#c3e6cb',
            '--footer-bg': '#d4edda'
        }
    },
    purple: {
        name: '优雅紫主题',
        colors: {
            '--primary-color': '#6f42c1',
            '--text-color': '#333',
            '--bg-color': '#f8f9ff',
            '--card-bg': '#ffffff',
            '--border-color': '#d1c4e9',
            '--footer-bg': '#e1d5f7'
        }
    },
    custom: {
        name: '自定义主题',
        colors: {
            '--primary-color': '',
            '--text-color': '',
            '--bg-color': '',
            '--card-bg': '',
            '--border-color': '',
            '--footer-bg': ''
        }
    }
};

// 应用自定义主题
function applyCustomTheme(colors) {
    themes.custom.colors = {
        ...themes.custom.colors,
        ...colors
    };
    applyTheme('custom');
    
    // 保存自定义主题颜色到localStorage
    localStorage.setItem('customThemeColors', JSON.stringify(colors));
}

// 计算颜色对比度
function getContrastRatio(color1, color2) {
    // 将颜色转换为RGB值
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    // 计算相对亮度
    const luminance1 = getLuminance(rgb1);
    const luminance2 = getLuminance(rgb2);
    
    // 返回对比度比率
    return (Math.max(luminance1, luminance2) + 0.05) / 
           (Math.min(luminance1, luminance2) + 0.05);
}

// 将十六进制颜色转换为RGB
function hexToRgb(hex) {
    // 处理简写形式如 #fff
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 255, g: 255, b: 255};
}

// 计算颜色亮度
function getLuminance(rgb) {
    const {r, g, b} = rgb;
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// 显示自定义主题对话框
function showCustomThemeDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'custom-theme-dialog';
    dialog.innerHTML = `
        <div class="dialog-content">
            <div class="dialog-header">
                <h3><i class="fas fa-palette"></i> 自定义主题</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="dialog-body">
                <div class="color-pickers-grid">
                    ${Object.entries(themes.custom.colors).map(([key, value]) => `
                        <div class="color-picker-item">
                            <div class="color-info">
                                <label for="custom-${key}">${getColorDescription(key)}</label>
                                <span class="color-value">${value || '#ffffff'}</span>
                            </div>
                            <input type="color" id="custom-${key}" value="${value || '#ffffff'}">
                        </div>
                    `).join('')}
                </div>
                <div id="contrast-warning" class="contrast-warning" style="display:none;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>文字颜色与背景颜色对比度过低，可能影响可读性</span>
                    <div class="warning-actions">
                        <button class="btn ignore-btn">忽略</button>
                        <button class="btn revert-btn">撤销更改</button>
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <button class="btn cancel-btn">取消</button>
                <button class="btn apply-btn">应用主题</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // 添加事件监听
    dialog.querySelector('.apply-btn').addEventListener('click', applyThemeChanges);
    dialog.querySelector('.cancel-btn').addEventListener('click', () => dialog.remove());
    dialog.querySelector('.close-btn').addEventListener('click', () => dialog.remove());
    
    // 颜色选择器变化时更新显示值
    document.querySelectorAll('.custom-theme-dialog input[type="color"]').forEach(input => {
        input.addEventListener('input', (e) => {
            const colorValue = e.target.closest('.color-picker-item').querySelector('.color-value');
            colorValue.textContent = e.target.value;
            
            // 检查颜色对比度
            checkColorContrast();
        });
    });
    
    // 检查颜色对比度
    function checkColorContrast() {
        console.log('开始检查颜色对比度...');
        
        const textColor = dialog.querySelector('#custom---text-color').value || '#333333';
        const bgColor = dialog.querySelector('#custom---bg-color').value || '#ffffff';
        const cardBgColor = dialog.querySelector('#custom---card-bg').value || '#ffffff';
        
        console.log('获取的颜色值:', {textColor, bgColor, cardBgColor});
        
        const contrastRatio1 = getContrastRatio(textColor, bgColor);
        const contrastRatio2 = getContrastRatio(textColor, cardBgColor);
        
        console.log('计算出的对比度:', {contrastRatio1, contrastRatio2});
        
        const warning = dialog.querySelector('#contrast-warning');
        
        // WCAG 2.0 AA标准要求最小对比度为4.5:1
        if (contrastRatio1 < 4.5 || contrastRatio2 < 4.5) {
            console.log('对比度过低，显示警告');
            warning.style.display = 'flex';
            warning.style.zIndex = '3000'; // 确保在最上层
            
            // 添加忽略按钮事件
            dialog.querySelector('.ignore-btn').addEventListener('click', () => {
                warning.style.display = 'none';
            });
            
            // 添加撤销按钮事件
            dialog.querySelector('.revert-btn').addEventListener('click', () => {
                const inputs = dialog.querySelectorAll('input[type="color"]');
                inputs.forEach(input => {
                    const key = input.id.replace('custom-', '');
                    input.value = themes.custom.colors[key] || '';
                    input.dispatchEvent(new Event('input'));
                });
                warning.style.display = 'none';
            });
        } else {
            warning.style.display = 'none';
        }
    }

    function applyThemeChanges() {
        const colors = {};
        Object.keys(themes.custom.colors).forEach(key => {
            colors[key] = dialog.querySelector(`#custom-${key}`).value;
        });
        applyCustomTheme(colors);
        dialog.remove();
    }
}

// 获取颜色变量描述
function getColorDescription(key) {
    const descriptions = {
        '--primary-color': '主色调 (按钮/链接)',
        '--text-color': '文字颜色',
        '--bg-color': '背景颜色', 
        '--card-bg': '卡片背景',
        '--border-color': '边框颜色',
        '--footer-bg': '页脚背景'
    };
    return descriptions[key] || key.replace('--', '').replace('-', ' ');
}

// 应用主题
function applyTheme(themeKey) {
    const theme = themes[themeKey];
    if (!theme) return;
    
    // 更新CSS变量（全局生效）
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });

    // 强制更新所有页面元素
    document.querySelectorAll('.card, .form-group, .btn, .footer').forEach(el => {
        el.style.setProperty('background-color', 'var(--card-bg)');
        el.style.setProperty('border-color', 'var(--border-color)');
    });
    
    // 显示通知
    showNotification(`已切换至${theme.name}`);
    
    // 保存到本地存储
    localStorage.setItem('selectedTheme', themeKey);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // 3秒后隐藏并移除通知
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 初始化主题切换功能
function initThemeSwitcher() {
    // 添加主题按钮事件监听
    document.querySelectorAll('.theme-options button').forEach(button => {
        if (button.classList.contains('custom-theme-btn')) {
            button.addEventListener('click', showCustomThemeDialog);
        } else {
            button.addEventListener('click', () => {
                const themeKey = button.dataset.theme;
                applyTheme(themeKey);
            });
        }
    });
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('selectedTheme') || 'system';
    
    // 如果是自定义主题，恢复自定义颜色
    if (savedTheme === 'custom') {
        const savedColors = localStorage.getItem('customThemeColors');
        if (savedColors) {
            themes.custom.colors = {
                ...themes.custom.colors,
                ...JSON.parse(savedColors)
            };
        }
    }
    
    applyTheme(savedTheme);
    
    // 确认主题选项已加载
    console.log('可用主题:', Object.keys(themes).join(', '));
    
    // 验证主题按钮是否存在
    const themeButtons = document.querySelectorAll('.theme-options button');
    console.log('找到的主题按钮数量:', themeButtons.length);
}

// 页面切换动画
function initPageTransitions() {
    const transition = document.querySelector('.page-transition');
    if (!transition) return;
    
    const links = document.querySelectorAll('a[href^="http"]:not([target="_blank"]), a[href^="/"], a[href^="#"]');
    
    links.forEach(link => {
        if (link.href.includes(window.location.host) || link.href.startsWith('/') || link.href.startsWith('#')) {
            link.addEventListener('click', function(e) {
                // 排除主题切换按钮
                if (this.closest('.theme-options')) return;
                
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // 开始过渡动画
                transition.classList.add('active');
                
                // 延迟跳转
                setTimeout(() => {
                    if (href.startsWith('#')) {
                        // 处理锚点链接
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                        transition.classList.remove('active');
                    } else {
                        window.location.href = href;
                    }
                }, 600);
            });
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initThemeSwitcher();
    initPageTransitions();
});
