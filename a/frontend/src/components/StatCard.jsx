export default function StatCard({ title, value, icon: Icon, color = "blue" }) {
  return (
    <div className="vendor-card stat-card">
      <div>
        <p className="stat-card__label">{title}</p>
        <p className="stat-card__value">{value}</p>
      </div>
      <div className={`stat-card__icon stat-card__icon--${color}`}>
        <Icon className="stat-card__icon-svg" />
      </div>
    </div>
  );
}
