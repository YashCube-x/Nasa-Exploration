import { useState, useRef } from 'react';

/* ================================================
   BACKEND API URL — The backend handles:
   1. Forwarding data to your n8n webhook (server-side, no CORS)
   2. Storing in Supabase (if configured)
   3. Duplicate email detection
   ================================================ */
const API_URL = '/api/subscribe';

const INTEREST_OPTIONS = ['Planets', 'Nebulae', 'Galaxies', 'Missions'];

export default function SubscribeForm({ onSuccess, onToast }) {
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    email: '',
    interests: [],
    consent: false,
    nickname: '', // honeypot
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const formRef = useRef(null);

  // --- Rate limiting (basic client-side) ---
  const lastSubmitRef = useRef(0);
  const RATE_LIMIT_MS = 10000; // 10 seconds between submissions

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (form.age !== '' && form.age !== undefined) {
      const ageNum = parseInt(form.age, 10);
      if (isNaN(ageNum) || ageNum <= 0 || !Number.isInteger(ageNum)) {
        newErrors.age = 'Please enter a valid positive number';
      }
    }

    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.consent) {
      newErrors.consent = 'You must agree to receive emails to subscribe';
    }

    return newErrors;
  };

  // --- Update field ---
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // --- Toggle interest checkbox ---
  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check — if filled, silently fail
    if (form.nickname) {
      onToast('Thanks for subscribing!', 'success');
      return;
    }

    // Rate limiting
    const now = Date.now();
    if (now - lastSubmitRef.current < RATE_LIMIT_MS) {
      onToast('Please wait a moment before trying again.', 'info');
      return;
    }

    // Validate
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first errored field
      const firstField = Object.keys(newErrors)[0];
      formRef.current?.querySelector(`[name="${firstField}"]`)?.focus();
      return;
    }

    setSubmitting(true);
    lastSubmitRef.current = now;

    const payload = {
      name: form.fullName.trim(),
      age: form.age ? parseInt(form.age, 10) : null,
      email: form.email.trim().toLowerCase(),
      interests: form.interests,
      consent: form.consent,
      timestamp: new Date().toISOString(),
      source: 'lovable',
    };

    try {
      // POST to backend API — it handles:
      // 1. Storing in Supabase (if configured)
      // 2. Forwarding to n8n webhook (server-side, no CORS issues)
      // 3. Duplicate email detection
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        onToast(data.error || 'Something went wrong. Please try again.', 'error');
        return;
      }

      if (data.alreadySubscribed) {
        setAlreadySubscribed(true);
        return;
      }

      // Success!
      setForm({ fullName: '', age: '', email: '', interests: [], consent: false, nickname: '' });
      setErrors({});
      setAlreadySubscribed(false);
      onSuccess();
    } catch (err) {
      console.error('Subscribe error:', err);
      onToast('Something went wrong. Please try again later.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="subscribe">
      <div className="section">
        <h2 className="section-title">📡 Subscribe for Space Photos</h2>

        <div className="subscribe-wrapper">
          <div className="glass-card">
            {alreadySubscribed ? (
              <div role="alert" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                  🪐 This email is already subscribed!
                </p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  You're already on the list. Check your inbox for cool space photos.
                </p>
                <a
                  href="#"
                  className="btn-cta"
                  onClick={(e) => {
                    e.preventDefault();
                    setAlreadySubscribed(false);
                    onToast('Use a different email address to subscribe.', 'info');
                  }}
                >
                  Manage Subscription
                </a>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                aria-label="Subscribe to CosmicMail"
              >
                {/* Honeypot — hidden from real users */}
                <div className="ohnohoney" aria-hidden="true">
                  <label htmlFor="nickname">Nickname</label>
                  <input
                    type="text"
                    id="nickname"
                    name="nickname"
                    value={form.nickname}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name <span className="required" aria-label="required">*</span>
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="E.g. Neil Armstrong"
                    value={form.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                    aria-describedby={errors.fullName ? 'fullNameError' : undefined}
                    aria-invalid={!!errors.fullName}
                  />
                  {errors.fullName && (
                    <div id="fullNameError" className="error-message" role="alert">
                      ⚠ {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div className="form-group">
                  <label htmlFor="age">Age <small>(optional)</small></label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    className={`form-input ${errors.age ? 'error' : ''}`}
                    placeholder="E.g. 25"
                    value={form.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    min="1"
                    step="1"
                    aria-describedby={errors.age ? 'ageError' : undefined}
                    aria-invalid={!!errors.age}
                  />
                  {errors.age && (
                    <div id="ageError" className="error-message" role="alert">
                      ⚠ {errors.age}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required" aria-label="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@spacecraft.io"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    aria-describedby={errors.email ? 'emailError' : undefined}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <div id="emailError" className="error-message" role="alert">
                      ⚠ {errors.email}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div className="form-group">
                  <label>Interests <small>(optional — pick your favorites)</small></label>
                  <div className="checkbox-group" role="group" aria-label="Space interests">
                    {INTEREST_OPTIONS.map((interest) => (
                      <label key={interest} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={form.interests.includes(interest)}
                          onChange={() => toggleInterest(interest)}
                        />
                        {interest}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Consent */}
                <div className="form-group">
                  <label className="consent-label">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={form.consent}
                      onChange={(e) => handleChange('consent', e.target.checked)}
                      required
                      aria-describedby={errors.consent ? 'consentError' : undefined}
                      aria-invalid={!!errors.consent}
                    />
                    <span>
                      I agree to receive periodic space photos by email. I can unsubscribe
                      anytime. By subscribing you agree to receive emails. We'll never sell
                      your info.
                    </span>
                  </label>
                  {errors.consent && (
                    <div id="consentError" className="error-message" role="alert">
                      ⚠ {errors.consent}
                    </div>
                  )}
                </div>

                {/* reCAPTCHA placeholder — uncomment and add your site key when ready */}
                {/* <div className="form-group">
                  <div className="g-recaptcha" data-sitekey="YOUR_RECAPTCHA_SITE_KEY"></div>
                </div> */}

                {/* Actions */}
                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-cta"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" aria-hidden="true" />
                        Launching…
                      </>
                    ) : (
                      '🚀 Subscribe'
                    )}
                  </button>
                  <button
                    type="button"
                    className="no-thanks"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    No thanks
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
