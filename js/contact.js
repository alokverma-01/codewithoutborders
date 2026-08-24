(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("contactSubmit");

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address.",
    phone: (v) =>
      v.trim() === "" || /^[+\d][\d\s\-()]{6,18}$/.test(v.trim())
        ? ""
        : "Please enter a valid phone number, or leave it blank.",
    message: (v) => (v.trim().length >= 20 ? "" : "Please write at least 20 characters."),
  };

  function fieldEls(name) {
    const input = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    return { input, error };
  }

  function validateField(name) {
    const { input, error } = fieldEls(name);
    if (!input) return true;
    const msg = rules[name](input.value);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (error) error.textContent = msg;
    return !msg;
  }

  ["name", "email", "phone", "message"].forEach((name) => {
    const { input } = fieldEls(name);
    if (input) input.addEventListener("blur", () => validateField(name));
  });

  function showStatus(kind, text) {
    status.textContent = text;
    status.className = `form-status show ${kind}`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const names = ["name", "email", "phone", "message"];
    const results = names.map(validateField);
    if (results.includes(false)) {
      showStatus("error", "Please fix the highlighted fields and try again.");
      return;
    }

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      message: form.elements.message.value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    status.className = "form-status";

    try {
      if (SITE_CONFIG.contactFormEndpoint) {
        const res = await fetch(SITE_CONFIG.contactFormEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Submission failed");
      } else {
        // Demo mode: no backend configured yet.
        await new Promise((r) => setTimeout(r, 700));
      }
      showStatus(
        "success",
        SITE_CONFIG.contactFormEndpoint
          ? "Thanks! Your message has been sent — I'll get back to you soon."
          : "Thanks! (Demo mode: no form endpoint is configured yet, so this message wasn't actually sent — see README.md to connect one.)"
      );
      form.reset();
    } catch (err) {
      showStatus("error", "Something went wrong sending your message. Please try again, or reach out on WhatsApp instead.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
})();
