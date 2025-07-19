class ImageSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.indicators = document.querySelectorAll('.indicator');
        this.isAutoPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000; // 4 секунды
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateCounter();
        this.preloadImages();
    }
    
    bindEvents() {
        // Кнопки навигации
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousSlide();
        });
        
        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSlide();
        });
        
        // Индикаторы
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Кнопка автопроигрывания
        document.getElementById('autoplayBtn').addEventListener('click', () => {
            this.toggleAutoPlay();
        });
        
        // Пауза автопроигрывания при наведении
        const sliderWrapper = document.querySelector('.slider-wrapper');
        sliderWrapper.addEventListener('mouseenter', () => {
            if (this.isAutoPlaying) {
                this.pauseAutoPlay();
            }
        });
        
        sliderWrapper.addEventListener('mouseleave', () => {
            if (this.isAutoPlaying) {
                this.resumeAutoPlay();
            }
        });
        
        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            } else if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });
        
        // Сенсорная навигация (swipe)
        this.addTouchSupport();
    }
    
    addTouchSupport() {
        const slider = document.querySelector('.slider');
        let startX = 0;
        let endX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const difference = startX - endX;
            
            if (Math.abs(difference) > 50) { // Минимальная дистанция для swipe
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    preloadImages() {
        // Предзагрузка изображений для плавности
        this.slides.forEach(slide => {
            const img = slide.querySelector('img');
            const tempImg = new Image();
            tempImg.onload = () => {
                img.style.opacity = '1';
            };
            tempImg.src = img.src;
        });
    }
    
    goToSlide(slideIndex) {
        // Убираем активный класс с текущего слайда
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Добавляем класс предыдущего слайда для анимации
        if (slideIndex < this.currentSlide) {
            this.slides[this.currentSlide].classList.add('prev');
        }
        
        // Устанавливаем новый текущий слайд
        this.currentSlide = slideIndex;
        
        // Активируем новый слайд
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
        
        // Убираем класс prev через небольшую задержку
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
        }, 100);
        
        this.updateCounter();
        this.addSlideAnimation();
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    updateCounter() {
        document.getElementById('currentImage').textContent = this.currentSlide + 1;
        document.getElementById('totalImages').textContent = this.totalSlides;
    }
    
    addSlideAnimation() {
        // Добавляем небольшую анимацию при смене слайда
        const activeSlide = this.slides[this.currentSlide];
        activeSlide.style.transform = 'scale(1.02)';
        
        setTimeout(() => {
            activeSlide.style.transform = 'scale(1)';
        }, 200);
    }
    
    toggleAutoPlay() {
        if (this.isAutoPlaying) {
            this.stopAutoPlay();
        } else {
            this.startAutoPlay();
        }
    }
    
    startAutoPlay() {
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
        
        // Обновляем иконку кнопки
        document.querySelector('.play-icon').classList.add('hidden');
        document.querySelector('.pause-icon').classList.remove('hidden');
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Обновляем иконку кнопки
        document.querySelector('.play-icon').classList.remove('hidden');
        document.querySelector('.pause-icon').classList.add('hidden');
    }
    
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resumeAutoPlay() {
        if (this.isAutoPlaying && !this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, this.autoPlayDelay);
        }
    }
}

// Дополнительные функции для улучшения UX
class SliderEnhancements {
    constructor(slider) {
        this.slider = slider;
        this.init();
    }
    
    init() {
        this.addProgressBar();
        this.addSlideCounter();
        this.addKeyboardHints();
    }
    
    addProgressBar() {
        // Создаем прогресс-бар для автопроигрывания
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                z-index: 10;
            }
            
            .progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                transition: width 0.1s linear;
            }
        `;
        document.head.appendChild(style);
        document.querySelector('.slider').appendChild(progressBar);
        
        // Обновляем прогресс-бар
        setInterval(() => {
            if (this.slider.isAutoPlaying) {
                const progressFill = document.querySelector('.progress-fill');
                const elapsed = Date.now() - this.slider.lastSlideTime;
                const progress = (elapsed / this.slider.autoPlayDelay) * 100;
                progressFill.style.width = Math.min(progress, 100) + '%';
            }
        }, 100);
    }
    
    addSlideCounter() {
        // Добавляем счетчик времени до следующего слайда
        this.slider.lastSlideTime = Date.now();
        
        const originalGoToSlide = this.slider.goToSlide.bind(this.slider);
        this.slider.goToSlide = function(slideIndex) {
            this.lastSlideTime = Date.now();
            originalGoToSlide(slideIndex);
        };
    }
    
    addKeyboardHints() {
        // Показываем подсказки по клавишам при первом посещении
        if (!localStorage.getItem('slider-hints-shown')) {
            const hints = document.createElement('div');
            hints.className = 'keyboard-hints';
            hints.innerHTML = `
                <div class="hint-content">
                    <h4>Управление слайдером:</h4>
                    <p>← → Навигация | Пробел - автопроигрывание</p>
                </div>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .keyboard-hints {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 15px;
                    border-radius: 10px;
                    z-index: 1000;
                    animation: fadeIn 0.5s ease;
                }
                
                .hint-content h4 {
                    margin-bottom: 5px;
                    font-size: 0.9rem;
                }
                
                .hint-content p {
                    font-size: 0.8rem;
                    opacity: 0.8;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(hints);
            
            // Скрываем подсказки через 5 секунд
            setTimeout(() => {
                hints.style.animation = 'fadeOut 0.5s ease';
                setTimeout(() => hints.remove(), 500);
                localStorage.setItem('slider-hints-shown', 'true');
            }, 5000);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const slider = new ImageSlider();
    const enhancements = new SliderEnhancements(slider);
    
    // Добавляем fade-in анимацию для всей страницы
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Консольное сообщение для разработчиков
    console.log('🎨 Красивый слайдер изображений загружен успешно!');
    console.log('Используйте стрелки ← → для навигации или пробел для автопроигрывания');
});

// Обработка ошибок загрузки изображений
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.slide img');
    
    images.forEach((img, index) => {
        img.addEventListener('error', () => {
            console.warn(`Ошибка загрузки изображения ${index + 1}`);
            img.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            img.alt = 'Изображение недоступно';
        });
    });
});