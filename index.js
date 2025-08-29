document.addEventListener("DOMContentLoaded", () => {
  
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const parseNumber = (str, fallback = 0) => {
    const n = parseInt((str ?? "").toString().trim().replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : fallback;
  };

 
  const header = q("header");
  if (!header) return;

  
  const heartEmoji = header.querySelector("span.text-red-500") || qa("span", header).find(s => s.textContent.includes("❤️"));
  const heartCountEl = heartEmoji?.previousElementSibling || qa("span", header).find(s => s.nextElementSibling && s.nextElementSibling.textContent.includes("❤️"));
  let heartCount = parseNumber(heartCountEl?.textContent, 0);

  
  const coinEmoji = header.querySelector("span.text-yellow-500") || qa("span", header).find(s => s.textContent.includes("🪙"));
  const coinCountEl = coinEmoji?.previousElementSibling || qa("span", header).find(s => s.nextElementSibling && s.nextElementSibling.textContent.includes("🪙"));
  let coinCount = parseNumber(coinCountEl?.textContent, 100);

 
  const copyCountEl = header.querySelector(".bg-green-600");
  let copyCount = parseNumber(copyCountEl?.textContent, 0);

 
  const h2s = qa("h2");
  const historyTitle = h2s.find(h => /call history/i.test(h.textContent)) || h2s.find(h => /🕒/.test(h.textContent));
  if (!historyTitle) {
    console.warn("Call History title not found. Aborting script.");
    return;
  }
 
  const historyCard = historyTitle.closest("div.bg-white") || historyTitle.closest("div");
  const historySection = historyCard?.querySelector(".space-y-3");
  if (!historySection) {
    console.warn("History section (.space-y-3) not found.");
    return;
  }
  const clearBtn = Array.from(historyCard.querySelectorAll("button")).find(b => /clear/i.test(b.textContent)) || historyCard.querySelector("button");

  
  const placeholderHTML = `<p class="text-gray-400 text-sm">No calls yet.</p>`;
  historySection.innerHTML = placeholderHTML;
  let callSerial = 1;

  
  const leftContainer = q(".lg\\:col-span-3");
  if (!leftContainer) {
    console.warn("Left cards container (.lg:col-span-3) not found.");
    return;
  }
  
  const cards = Array.from(leftContainer.children).filter(c => c.classList && c.classList.contains("bg-white"));

  
  cards.forEach(card => {
    const serviceNameEl = card.querySelector("h2");
    const serviceNumberEl = card.querySelector("p.text-2xl");
    if (!serviceNameEl || !serviceNumberEl) return;

    const serviceName = serviceNameEl.textContent.trim();
    const serviceNumber = serviceNumberEl.textContent.trim();

    const buttons = Array.from(card.querySelectorAll("button"));
    const heartBtn = buttons.find(b => b.textContent.includes("❤"));
    const copyBtn = buttons.find(b => b.textContent.includes("📋") || /copy/i.test(b.textContent));
    const callBtn = buttons.find(b => b.textContent.includes("📞") || /call/i.test(b.textContent));

   
    if (heartBtn && heartCountEl) {
      heartBtn.addEventListener("click", () => {
        const isLiked = heartBtn.classList.contains("text-red-500");
        if (isLiked) {
          heartBtn.classList.remove("text-red-500");
          heartBtn.classList.add("text-gray-400");
          heartCount = Math.max(0, heartCount - 1);
        } else {
          heartBtn.classList.remove("text-gray-400");
          heartBtn.classList.add("text-red-500");
          heartCount++;
        }
        heartCountEl.textContent = heartCount;
      });
    }

 
    if (copyBtn) {
      copyBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        const textToCopy = serviceNumber;
        let copied = false;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
            copied = true;
          }
        } catch (err) {
          copied = false;
        }
        if (!copied) {
        
          try {
            const ta = document.createElement("textarea");
            ta.value = textToCopy;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            copied = true;
          } catch (err) {
            copied = false;
          }
        }
        if (copied) {
          alert(`📋 Copied ${textToCopy} to clipboard`);
          copyCount++;
          if (copyCountEl) copyCountEl.textContent = `${copyCount} Copy`;
        } else {
          
          const manual = prompt("Copy this hotline number:", textToCopy);
          if (manual !== null) {
            alert("Thanks — number shown above for manual copy.");
          }
        }
      });
    }

   
    if (callBtn && coinCountEl) {
      callBtn.addEventListener("click", () => {
     
        if (coinCount < 20) {
          alert("⚠️ Not enough coins! You need at least 20 coins to make a call.");
          return;
        }

        coinCount = Math.max(0, coinCount - 20);
        coinCountEl.textContent = coinCount;

        alert(`📞 Calling ${serviceName} at ${serviceNumber}...`);

        
        const placeholder = historySection.querySelector("p.text-gray-400");
        if (placeholder) historySection.innerHTML = "";

       
        const now = new Date();
        const timeNow = now.toLocaleString(undefined, {
          year: "numeric", month: "short", day: "numeric",
          hour: "numeric", minute: "2-digit", second: "2-digit"
        });

       
        const entry = document.createElement("div");
        entry.innerHTML = `
          <p class="font-medium inter-font-black">${callSerial}. ${serviceName}</p>
          <span class="flex justify-between">
            <p class="text-gray-500 font-semibold">${serviceNumber}</p>
            <p class="text-gray-500 font-semibold">${timeNow}</p>
          </span>
        `;
        historySection.appendChild(entry);
        callSerial++;
      });
    }
  });

 
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      historySection.innerHTML = placeholderHTML;
      callSerial = 1;
    });
  }
});
