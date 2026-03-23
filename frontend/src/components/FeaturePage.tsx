import { ArrowRight, type LucideIcon } from "lucide-react";

type FeaturePageProps = {
  title: string;
  description: string;
  highlights: string[];
  icon: LucideIcon;
};

function FeaturePage({ title, description, highlights, icon: Icon }: FeaturePageProps) {
  return (
    <section className="feature-page">
      <article className="page-card feature-page__hero">
        <div className="feature-page__hero-main">
          <div className="feature-page__icon">
            <Icon size={26} />
          </div>
          <div>
            <span className="eyebrow">Space overview</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
        <div className="feature-page__hero-aside">
          <strong>Ready for expansion</strong>
          <p>Shared shell, responsive layout, and deployment-safe route already in place.</p>
        </div>
      </article>

      <div className="feature-page__grid">
        {highlights.map((highlight, index) => (
          <article key={highlight} className="page-card feature-page__item">
            <span className="feature-page__index">{String(index + 1).padStart(2, "0")}</span>
            <ArrowRight size={18} />
            <p>{highlight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturePage;
