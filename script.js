// 代码窗口打字机
(function(){
    const codeText = `// system/core/engine.go
package engine

type System struct {
&nbsp;&nbsp;State *State
&nbsp;&nbsp;Opts  Options
&nbsp;&nbsp;Metrics *MetricsCollector
}

func New() *System {
&nbsp;&nbsp;return &System{
&nbsp;&nbsp;&nbsp;&nbsp;State: Init(),
&nbsp;&nbsp;&nbsp;&nbsp;Opts:  DefaultOpts(),
&nbsp;&nbsp;&nbsp;&nbsp;Metrics: NewMetrics(),
&nbsp;&nbsp;}
}`;
    const outEl = document.getElementById("type‑output");
    let idx = 0;
    function type(){
        if(idx < codeText.length){
            let ch = codeText.charAt(idx);
            if(ch === "\n") outEl.innerHTML += "<br/>";
            else if(ch === " ") outEl.innerHTML += "&nbsp;";
            else outEl.innerHTML += ch;
            idx++;
            setTimeout(type,25);
        }
    }
    setTimeout(type,600);
})();

//粒子系统
(function() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 50;
    let animId;
    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            this.r = Math.random() * 1.8 + 1.0;
            this.alpha = Math.random() * 0.4 + 0.15;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(170, 215, 240, ${this.alpha})`;
            ctx.fill();
        }
    }
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
    let mouseX = -1000, mouseY = -1000;
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 145) {
                    const alpha = (1 - dist / 155) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(150, 195, 225, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            const dx = particles[i].x - mouseX;
            const dy = particles[i].y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 185) {
                const alpha = (1 - dist / 200) * 0.16;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
            }
        }
    }
    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        animId = requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', () => {
        particles.forEach(p => {
            if (p.x > w) p.x = w * 0.8;
            if (p.y > h) p.y = h * 0.8;
        });
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animId);
        else animate();
    });
})();

//滚动观察器
(function() {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => observer.observe(el));
})();

//数字计数动画
(function() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                let current = 0;
                const step = Math.max(1, Math.floor(target / 50));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = current;
                    }
                }, 20);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => observer.observe(el));
})();

//导航滚动高亮
(function(){
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("nav a[href^='#']");
    window.addEventListener("scroll",()=>{
        let currentId = "";
        sections.forEach(sec=>{
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if(window.scrollY >= top - 220){
                currentId = sec.getAttribute("id");
            }
        });
        navLinks.forEach(link=>{
            link.classList.remove("active");
            if(link.getAttribute("href") === "#"+currentId){
                link.classList.add("active");
            }
        })
    })
})();

//回到顶部按钮
(function(){
    const btn = document.getElementById("backTop");
    window.addEventListener("scroll",()=>{
        if(window.scrollY>600){
            btn.classList.add("visible");
        }else{
            btn.classList.remove("visible");
        }
    })
    btn.addEventListener("click",(e)=>{
        e.preventDefault();
        window.scrollTo({top:0,behavior:"smooth"});
    })
})();

//复制邮箱
document.querySelectorAll(".btn‑copy[data‑copy]").forEach(el=>{
    el.style.cursor="pointer";
    el.addEventListener("click",async ()=>{
        const txt = el.getAttribute("data‑copy");
        await navigator.clipboard.writeText(txt);
        alert("已复制邮箱："+txt);
    })
})
