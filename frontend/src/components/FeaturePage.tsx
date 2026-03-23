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
        <div className="feature-page__icon">
          <Icon size={26} />
        </div>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </article>

      <div className="feature-page__grid">
        {highlights.map((highlight) => (
          <article key={highlight} className="page-card feature-page__item">
            <ArrowRight size={18} />
            <p>{highlight}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturePage;
