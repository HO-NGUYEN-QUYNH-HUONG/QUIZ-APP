document.addEventListener("DOMContentLoaded", () => {
    const openBtn = document.getElementById("openRulesBtn");
    const closeBtn = document.getElementById("closeRulesBtn");
    const modal = document.getElementById("rulesModal");

    openBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Đóng modal khi nhấn bên ngoài
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
