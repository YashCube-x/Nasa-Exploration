import { useState, useRef, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Gallery from './components/Gallery';
import SubscribeForm from './components/SubscribeForm';
import Footer from './components/Footer';
import ImageModal from './components/ImageModal';
import Toast from './components/Toast';
import ConfettiRocket from './components/ConfettiRocket';
import SuccessModal from './components/SuccessModal';

function App() {
  const [modalImage, setModalImage] = useState(null);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Section refs for smooth scroll
  const heroRef = useRef(null);
  const galleryRef = useRef(null);
  const subscribeRef = useRef(null);

  const scrollTo = useCallback((section) => {
    const refs = { home: heroRef, gallery: galleryRef, subscribe: subscribeRef };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSubscribeSuccess = useCallback(() => {
    setShowConfetti(true);
    setShowSuccess(true);
    setTimeout(() => setShowConfetti(false), 4000);
  }, []);

  const handleToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  return (
    <>
      <Header onNavigate={scrollTo} />

      <main>
        <section ref={heroRef} id="home">
          <Hero onSubscribeClick={() => scrollTo('subscribe')} />
        </section>

        <section ref={galleryRef} id="gallery">
          <Gallery onImageClick={setModalImage} />
        </section>

        <section ref={subscribeRef} id="subscribe">
          <SubscribeForm
            onSuccess={handleSubscribeSuccess}
            onToast={handleToast}
          />
        </section>
      </main>

      <Footer />

      {/* Modals & Overlays */}
      {modalImage && (
        <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showConfetti && <ConfettiRocket />}

      {showSuccess && (
        <SuccessModal onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
}

export default App;
