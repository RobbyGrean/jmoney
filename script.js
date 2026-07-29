const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-link");

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobileMenu.classList.contains("hidden");
  mobileMenu.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const copyButtons = document.querySelectorAll("[data-copy-command]");

async function copyCommand(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy command was rejected");
}

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.dataset.copyCommand;
    const status = button.parentElement.querySelector("[data-copy-status]");
    const originalLabel = button.textContent;

    try {
      await copyCommand(command);
      button.textContent = "คัดลอกแล้ว";
      status.textContent = "คัดลอกคำสั่งไปยังคลิปบอร์ดแล้ว";
    } catch {
      button.textContent = "คัดลอกไม่สำเร็จ";
      status.textContent = "คัดลอกไม่สำเร็จ กรุณาเลือกข้อความในช่องคำสั่งแล้วคัดลอกเอง";
    }

    window.setTimeout(() => {
      button.textContent = originalLabel;
    }, 1800);
  });
});

const revealTargets = document.querySelectorAll(
  ".hero-panel, .cta-card, .panel-card, .metric-card, .idea-card, .ai-step, .section-head"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealTargets.forEach((target, index) => {
  target.classList.add("reveal");
  target.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
  observer.observe(target);
});
