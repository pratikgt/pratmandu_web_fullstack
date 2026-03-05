export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__links">
          <a href="#" className="footer__link">About Us</a>
          <span className="footer__sep">|</span>
          <a href="#" className="footer__link">Contact</a>
          <span className="footer__sep">|</span>
          <a href="#" className="footer__link">Terms & Conditions</a>
        </div>

        <div className="footer__social">
          <a className="footer__icon" href="#" aria-label="Facebook">f</a>
          <a className="footer__icon" href="#" aria-label="Twitter">t</a>
          <a className="footer__icon" href="#" aria-label="Instagram">i</a>
        </div>
      </div>
    </footer>
  );
}