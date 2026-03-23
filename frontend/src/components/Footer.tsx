import "../index.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>Hive</strong>
          <p>One deployable social workspace for updates, messaging, and community operations.</p>
        </div>
        <span>© {new Date().getFullYear()} Hive</span>
      </div>
    </footer>
  );
};

export default Footer;
