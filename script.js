document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.gallery-track');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const dotsContainer = document.querySelector('.gallery-dots');
    
    const photos = [
        '/images/photos/1.jpg',
        '/images/photos/2.jpg',
        '/images/photos/3.jpg',
    ];
    
    let currentIndex = 0;
    let isAnimating = false;
    let dots = [];
    
    // Функция для создания слайда
    function createSlide(photoSrc) {
        const slide = document.createElement('div');
        slide.className = 'gallery-slide';
        
        const img = document.createElement('img');
        img.src = photoSrc;
        img.alt = 'Фото';
        img.loading = 'lazy';
        
        slide.appendChild(img);
        return slide;
    }
    
    // Функция создания точек
    function createDots() {
        dotsContainer.innerHTML = '';
        dots = [];
        
        for (let i = 0; i < photos.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'gallery-dot';
            dot.dataset.index = i;
            // dot.addEventListener('click', () => {
            //     const direction = i > currentIndex ? 'next' : 'prev';
            //     currentIndex = i;
            //     updateGallery(direction);
            //     updateDots();
            // });
            
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
        
        updateDots();
    }
    
    // Функция обновления активной точки
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Инициализация галереи
    function initGallery() {
        track.innerHTML = '';
        
        createDots();

        // Добавляем предыдущий, текущий и следующий слайды
        const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
        const nextIndex = (currentIndex + 1) % photos.length;
        
        track.appendChild(createSlide(photos[prevIndex]));
        track.appendChild(createSlide(photos[currentIndex]));
        track.appendChild(createSlide(photos[nextIndex]));
        
        // Устанавливаем начальную позицию
        track.style.transform = 'translateX(-100%)';
        track.style.transition = 'none';
    }
    
    // Функция для перехода к слайду
    function goToSlide(newIndex, direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        const newPrevIndex = (newIndex - 1 + photos.length) % photos.length;
        const newNextIndex = (newIndex + 1) % photos.length;
        
        currentIndex = newIndex;
        
        updateDots();
        
        // Анимация перехода
        track.style.transition = 'transform 0.5s ease';
        track.style.transform = direction === 'next' 
            ? 'translateX(-200%)' 
            : 'translateX(0%)';
        
        // После завершения анимации обновляем слайды
        track.addEventListener('transitionend', function handler() {
            track.removeEventListener('transitionend', handler);
            
            // Обновляем слайды без анимации
            track.style.transition = 'none';
            track.innerHTML = '';
            
            track.appendChild(createSlide(photos[newPrevIndex]));
            track.appendChild(createSlide(photos[currentIndex]));
            track.appendChild(createSlide(photos[newNextIndex]));
            
            // Возвращаем в центральное положение
            track.style.transform = 'translateX(-100%)';
            
            // Небольшая задержка перед сбросом transition
            setTimeout(() => {
                track.style.transition = 'transform 0.5s ease';
                isAnimating = false;
            }, 50);
        });
    }
    
    // Обработчики кнопок
    function goToNext() {
        const newIndex = (currentIndex + 1) % photos.length;
        goToSlide(newIndex, 'next');
    }
    
    function goToPrev() {
        const newIndex = (currentIndex - 1 + photos.length) % photos.length;
        goToSlide(newIndex, 'prev');
    }
    
    // Инициализация
    initGallery();
    
    // Назначение обработчиков
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);
    
    // Свайп на мобильных устройствах
    let touchStartX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > 50) {
            if (diff < 0) goToNext();
            else goToPrev();
        }
    }, { passive: true });
});