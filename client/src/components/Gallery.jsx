/* Gallery images — using NASA public domain images */
const GALLERY_ITEMS = [
  {
    id: 1,
    src: 'https://images-assets.nasa.gov/image/PIA17563/PIA17563~medium.jpg',
    alt: "Saturn's rings captured by NASA's Cassini spacecraft showing the planet's iconic golden atmosphere and ring system",
    title: 'Saturn & Its Rings',
    description: 'Captured by Cassini spacecraft',
  },
  {
    id: 2,
    src: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~medium.jpg',
    alt: 'The Eagle Nebula (M16) — towering pillars of gas and dust where new stars are born',
    title: 'Eagle Nebula',
    description: 'Pillars of Creation',
  },
  {
    id: 3,
    src: 'https://images-assets.nasa.gov/image/PIA15415/PIA15415~medium.jpg',
    alt: 'Andromeda Galaxy (M31) — our nearest large galactic neighbor, a spiral galaxy with billions of stars',
    title: 'Andromeda Galaxy',
    description: 'Our nearest galactic neighbor',
  },
];

export default function Gallery({ onImageClick }) {
  return (
    <div className="gallery">
      <div className="section">
        <h2 className="section-title">🌌 Explore the Cosmos</h2>
        <div className="gallery-grid" role="list" aria-label="Space photo gallery">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className="gallery-card"
              role="listitem"
              tabIndex={0}
              onClick={() => onImageClick(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageClick(item);
                }
              }}
              aria-label={`View full image: ${item.title}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
              />
              <div className="card-overlay">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
