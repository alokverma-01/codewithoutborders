(function () {
  const mount = document.getElementById("paymentGrid");
  if (!mount) return;

  const p = SITE_CONFIG.payments;

  function isPlaceholder(v) {
    return !v || String(v).startsWith("REPLACE_ME");
  }

  function copyRow(id, value) {
    const ready = !isPlaceholder(value);
    return `
      <div class="payment-value">
        <span id="${id}">${ready ? value : "Not configured yet"}</span>
        ${ready ? `<button class="copy-btn" data-copy-target="${id}">Copy</button>` : ""}
      </div>`;
  }

  function methodCard({ title, configured, body, actionHtml }) {
    return `
      <div class="payment-card">
        <div class="head">
          <h3>${title}</h3>
          <span class="payment-status ${configured ? "ready" : "pending"}">${configured ? "Ready" : "Not set up"}</span>
        </div>
        ${body}
        ${actionHtml || ""}
      </div>`;
  }

  const cards = [];

  // PayPal
  {
    const configured = p.paypal.enabled && !isPlaceholder(p.paypal.paypalIdOrUsername);
    const val = p.paypal.paypalIdOrUsername;
    const looksLikeUsername = configured && !val.includes("@");
    const payUrl = configured
      ? looksLikeUsername
        ? `https://paypal.me/${encodeURIComponent(val)}`
        : null
      : null;
    cards.push(
      methodCard({
        title: "PayPal",
        configured,
        body: `<p style="color:var(--text-muted); font-size:14.5px;">Pay securely with any PayPal balance, bank account or card.</p>${copyRow("paypalVal", val)}`,
        actionHtml: payUrl
          ? `<a class="btn btn-primary btn-block" href="${payUrl}" target="_blank" rel="noopener noreferrer">Open PayPal</a>`
          : configured
          ? `<p style="font-size:13px; color:var(--text-faint);">Use this email address at paypal.com to send a payment.</p>`
          : `<p style="font-size:13px; color:var(--text-faint);">Add a real PayPal ID in js/config.js to enable this.</p>`,
      })
    );
  }

  // Razorpay
  {
    const configured = p.razorpay.enabled && !isPlaceholder(p.razorpay.paymentLink);
    cards.push(
      methodCard({
        title: "Razorpay",
        configured,
        body: `<p style="color:var(--text-muted); font-size:14.5px;">Pay by card, UPI, netbanking or wallet via a secure Razorpay checkout link.</p>`,
        actionHtml: configured
          ? `<a class="btn btn-primary btn-block" href="${p.razorpay.paymentLink}" target="_blank" rel="noopener noreferrer">Pay with Razorpay</a>`
          : `<p style="font-size:13px; color:var(--text-faint);">Add a real Razorpay payment link in js/config.js to enable this. Payment status must be verified server-side — see README.md.</p>`,
      })
    );
  }

  // Google Pay (UPI)
  {
    const configured = p.googlePay.enabled && !isPlaceholder(p.googlePay.upiId);
    cards.push(
      methodCard({
        title: "Google Pay (UPI)",
        configured,
        body: `<p style="color:var(--text-muted); font-size:14.5px;">Scan or enter this UPI ID in Google Pay, PhonePe or any UPI app.</p>${copyRow("gpayVal", p.googlePay.upiId)}`,
        actionHtml: configured
          ? `<p style="font-size:13px; color:var(--text-faint);">After paying, please share a screenshot via WhatsApp or email so we can confirm receipt.</p>`
          : `<p style="font-size:13px; color:var(--text-faint);">Add a real UPI ID in js/config.js to enable this.</p>`,
      })
    );
  }

  // Airtel Payments Bank
  {
    const configured = p.airtelPaymentsBank.enabled && !isPlaceholder(p.airtelPaymentsBank.upiOrAccountId);
    cards.push(
      methodCard({
        title: "Airtel Payments Bank",
        configured,
        body: `<p style="color:var(--text-muted); font-size:14.5px;">Transfer directly to this Airtel Payments Bank ID.</p>${copyRow("airtelVal", p.airtelPaymentsBank.upiOrAccountId)}`,
        actionHtml: configured
          ? `<p style="font-size:13px; color:var(--text-faint);">After paying, please share a screenshot via WhatsApp or email so we can confirm receipt.</p>`
          : `<p style="font-size:13px; color:var(--text-faint);">Add a real Airtel Payments Bank ID in js/config.js to enable this.</p>`,
      })
    );
  }

  mount.innerHTML = cards.map((c) => `<div class="reveal in-view">${c}</div>`).join("");

  mount.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const targetId = btn.getAttribute("data-copy-target");
    const text = document.getElementById(targetId)?.textContent || "";
    try {
      await navigator.clipboard.writeText(text);
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1800);
    } catch {
      btn.textContent = "Press Ctrl+C";
    }
  });

  const anyConfigured = [p.paypal, p.razorpay, p.googlePay, p.airtelPaymentsBank].some(
    (m) => m.enabled
  );
  const notice = document.getElementById("paymentsNotice");
  if (notice && !anyConfigured) {
    notice.style.display = "block";
  }
})();
