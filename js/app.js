// ============ NAVIGATION ============
function showDesign(num, page) {
    document.getElementById('catalog').style.display = 'none';
    document.querySelectorAll('.design-section').forEach(s => s.style.display = 'none');
    document.getElementById(`design${num}`).style.display = num === 2 ? 'block' : 'flex';
    switchPage(num, page);
    window.scrollTo(0, 0);
}

function backToCatalog() {
    document.querySelectorAll('.design-section').forEach(s => s.style.display = 'none');
    document.getElementById('catalog').style.display = 'block';
    window.scrollTo(0, 0);
    // Reset forgot password steps
    resetForgotSteps();
}

function switchPage(designNum, page) {
    const prefix = `d${designNum}`;
    // Hide all pages for this design
    ['login', 'register', 'forgot'].forEach(p => {
        const el = document.getElementById(`${prefix}-${p}`);
        if (el) el.style.display = 'none';
    });
    // Show target page
    const target = document.getElementById(`${prefix}-${page}`);
    if (target) {
        target.style.display = page === 'forgot' && designNum === 2 ? 'flex' : (designNum === 2 ? 'flex' : 'flex');
        // Re-trigger animation
        const card = target.querySelector(`.d${designNum}-card, .d${designNum}-form-wrap, .d${designNum}-wrapper`);
        if (card) {
            card.style.animation = 'none';
            card.offsetHeight; // force reflow
            card.style.animation = '';
        }
    }

    // Update nav buttons
    const nav = document.querySelector(`.d${designNum}-page-nav`) ||
                document.querySelector(`#design${designNum} [class*="page-nav"]`);
    if (nav) {
        nav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        const pages = ['login', 'register', 'forgot'];
        const idx = pages.indexOf(page);
        if (idx >= 0 && nav.children[idx]) nav.children[idx].classList.add('active');
    }

    // Reset forgot steps when switching to forgot
    if (page === 'forgot') {
        resetForgotSteps(designNum);
    }
}

function resetForgotSteps(designNum) {
    [1, 2, 3].forEach(d => {
        const num = designNum || d;
        const step1 = document.getElementById(`d${num}-forgot-step1`);
        const step2 = document.getElementById(`d${num}-forgot-step2`);
        const step3 = document.getElementById(`d${num}-forgot-step3`);
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
    });
}

// ============ FORGOT PASSWORD FLOW ============
function showOTP(designNum) {
    const prefix = `d${designNum}`;
    document.getElementById(`${prefix}-forgot-step1`).style.display = 'none';
    document.getElementById(`${prefix}-forgot-step2`).style.display = 'block';
    // Focus first OTP input
    setTimeout(() => {
        const firstOTP = document.querySelector(`#${prefix}-forgot-step2 .otp-box`);
        if (firstOTP) firstOTP.focus();
    }, 100);
}

function showNewPass(designNum) {
    const prefix = `d${designNum}`;
    document.getElementById(`${prefix}-forgot-step2`).style.display = 'none';
    document.getElementById(`${prefix}-forgot-step3`).style.display = 'block';
}

// ============ OTP INPUT HANDLER ============
function otpMove(input) {
    // Only allow digits
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.value.length === 1) {
        const next = input.nextElementSibling;
        if (next && next.classList.contains('otp-box')) {
            next.focus();
        }
    }
}

// Handle backspace for OTP
document.addEventListener('keydown', function (e) {
    if (e.target.classList.contains('otp-box') && e.key === 'Backspace' && !e.target.value) {
        const prev = e.target.previousElementSibling;
        if (prev && prev.classList.contains('otp-box')) {
            prev.focus();
            prev.value = '';
        }
    }
});

// ============ PASSWORD TOGGLE ============
document.addEventListener('click', function (e) {
    const eyeBtn = e.target.closest('.d1-eye, .d2-eye, .d3-eye');
    if (!eyeBtn) return;
    const input = eyeBtn.parentElement.querySelector('input[type="password"], input[type="text"]');
    if (!input) return;
    const icon = eyeBtn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

// ============ SMOOTH ENTRANCE ANIMATION ============
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.catalog-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.12}s`;
    observer.observe(card);
});

// ============ OTP PASTE HANDLER ============
document.addEventListener('paste', function (e) {
    if (!e.target.classList.contains('otp-box')) return;
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
    const boxes = Array.from(e.target.parentElement.querySelectorAll('.otp-box'));
    const startIdx = boxes.indexOf(e.target);
    paste.split('').forEach((char, i) => {
        if (boxes[startIdx + i]) {
            boxes[startIdx + i].value = char;
        }
    });
    const lastFilled = Math.min(startIdx + paste.length, boxes.length) - 1;
    if (boxes[lastFilled]) boxes[lastFilled].focus();
});
