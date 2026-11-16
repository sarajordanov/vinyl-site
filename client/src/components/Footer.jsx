import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <a href="mailto:hello@example.com">Contact</a>
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
      </div>
      <div>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
        <a href="#">YouTube</a>
      </div>
      <div>© {new Date().getFullYear()}. VINYL.</div>
    </footer>
  );
}