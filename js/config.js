/**
 * ============================================================
 *  CodeWithoutBorders — SITE CONFIGURATION
 * ============================================================
 *  This is the ONLY file you should need to edit to make the
 *  site "yours". Replace every REPLACE_ME value below with
 *  your real information. Nothing here is a secret key — this
 *  file is loaded in the browser, so never put private API
 *  secrets (e.g. a Razorpay *key secret*, database passwords)
 *  in here. Public identifiers (a UPI ID, a PayPal.me handle,
 *  a Razorpay *payment link*) are fine.
 *
 *  For anything marked "server-side secret", see README.md —
 *  those belong in a real backend's environment variables,
 *  never in frontend code.
 * ============================================================
 */

const SITE_CONFIG = {
  brand: {
    name: "CodeWithoutBorders",
    tagline: "Web Design & Development Without Borders",
    description:
      "CodeWithoutBorders builds modern, responsive, high-performance websites for clients anywhere in the world.",
  },

  // Used to build https://wa.me/<number> links. Digits only, with country code, no + or spaces.
  // Example: "919876543210" for an Indian number. Leave as REPLACE_ME until you add a real one.
  whatsappNumber: "919236126374", // e.g. "919876543210"

  // Used to build tel: links. Include the country code, e.g. "+919876543210".
  phoneNumber: "+91 9236126374",

  // Public contact email shown on the Contact page.
  contactEmail: "av0221066@gmail.com",

  // Instagram handle (without the @). Do not change the URL format below.
  instagramUsername: "codewithoutborders",

  // Where the contact form should POST to. This static site has no backend of
  // its own — see README.md for two easy options (Formspree, or a small API
  // route if you add a backend). Leave as null to keep the form in
  // "demo mode" (validates + shows a success state, but does not send anywhere).
  contactFormEndpoint: null, // e.g. "https://formspree.io/f/REPLACE_ME"

  // Payment configuration. These are PUBLIC identifiers only (safe to expose).
  // Real payment *verification* must happen server-side — see README.md.
  payments: {
    paypal: {
      enabled: true, // flip to true once paypalIdOrUsername is real
      // Either a PayPal.me username ("yourname") or an email address.
      paypalIdOrUsername: "https://paypal.me/alokwebdeveloper",
    },
    razorpay: {
      enabled: true,
      // A Razorpay *Payment Link* (public URL), NOT an API secret key.
      paymentLink: "https://razorpay.me/@alokverma9680",
    },
    googlePay: {
      enabled: true,
      upiId: "av0221066-1@okaxis", // e.g. "yourname@okicici"
    },
    airtelPaymentsBank: {
      enabled: true,
      upiOrAccountId: "9236126374",
    },
  },
};
