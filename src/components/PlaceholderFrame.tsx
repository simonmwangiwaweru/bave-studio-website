/* Temporary stand-in until cleared client imagery is loaded via Sanity.
   Quiet linen tile at real proportions so layouts can be judged. */
export default function PlaceholderFrame({
  label,
  ratio = "aspect-[4/5]",
  className = "",
}: {
  label?: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <div
      className={`frame relative ${ratio} ${className}`}
      role="img"
      aria-label={label ? `Placeholder: ${label}` : "Placeholder image"}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-linen to-mist" />
      {label && (
        <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.15em] text-graphite">
          {label}
        </span>
      )}
    </div>
  );
}
