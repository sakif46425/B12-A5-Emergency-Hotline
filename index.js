document.addEventListener("DOMContentLoaded", () => {
  // ===== Navbar Counters =====
  const heartCountEl = document.querySelector("header .flex.items-center span");
  let heartCount = parseInt(heartCountEl?.textContent) || 0;

  const headerSpans = document.querySelectorAll("header .flex.items-center span");
  const coinCountEl = headerSpans[2] || headerSpans[1] || document.createElement("span");
  let coinCount = parseInt(coinCountEl.textContent) || 100;

  // ===== Heart Buttons =====
  const heartButtons = document.querySelectorAll(".text-gray-400, .hover\\:text-red-500");
  heartButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("text-red-500")) {
        btn.classList.remove("text-red-500");
        btn.classList.add("text-gray-400");
        heartCount = Math.max(0, heartCount - 1);
      } else {
        btn.classList.remove("text-gray-400");
        btn.classList.add("text-red-500");
        heartCount++;
      }
      heartCountEl.textContent = heartCount;
    });
  });

  // ===== Grab specific containers so Clear button isn't confused with Call buttons =====
  const leftCardsContainer = document.querySelector(".lg\\:col-span-3") || document; // left cards area
  const historyCard = document.querySelector("div.bg-white.rounded-2xl.shadow.p-4.h-fit"); // right panel
  if (!historyCard) return;

  const historySection = historyCard.querySelector(".space-y-3");
  const clearBtn = historyCard.querySelector("button"); // the Clear button inside the history card

  // ===== Call Buttons (only inside left cards container) =====
  const callButtons = leftCardsContainer.querySelectorAll("button.bg-\\[\\#00A63E\\]");

  // Initially empty Call History
  historySection.innerHTML = `<p class="text-gray-400 text-sm">No calls yet.</p>`;

  // Serial counter
  let callSerial = 1;

  callButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // safety: make sure this button is inside a service card with expected elements
      const card = btn.closest("div.bg-white");
      if (!card) return;

      const serviceNameEl = card.querySelector("h2");
      const serviceNumberEl = card.querySelector("p.text-2xl");

      // if any expected element is missing, gracefully exit
      if (!serviceNameEl || !serviceNumberEl) return;

      const serviceName = serviceNameEl.textContent.trim();
      const serviceNumber = serviceNumberEl.textContent.trim();

      // Check coin balance
      if (coinCount < 20) {
        alert("⚠️ Not enough coins! You need at least 20 coins to make a call.");
        return;
      }

      // Deduct coins and update UI
      coinCount -= 20;
      coinCountEl.textContent = coinCount;

      // Alert call message
      alert(`📞 Calling ${serviceName} at ${serviceNumber}...`);

      // Remove "No calls yet." placeholder if present
      const placeholder = historySection.querySelector("p.text-gray-400");
      if (placeholder) historySection.innerHTML = "";

      // Add to Call History with serial
      const timeNow = new Date().toLocaleTimeString();
      const newEntry = document.createElement("div");
      newEntry.innerHTML = `
        <p class="font-medium inter-font-black">${callSerial}. ${serviceName}</p>
        <span class="flex justify-between">
          <p class="text-gray-500 font-semibold">${serviceNumber}</p>
          <p class="text-gray-500 font-semibold">${timeNow}</p>
        </span>
      `;
      historySection.appendChild(newEntry); // keep ascending order: 1 → N

      callSerial++;
    });
  });

  // ===== Clear History Button =====
  clearBtn.addEventListener("click", () => {
    historySection.innerHTML = `<p class="text-gray-400 text-sm">No calls yet.</p>`;
    callSerial = 1; // reset serial counter
  });
});
