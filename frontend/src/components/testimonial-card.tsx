interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
}

export default function TestimonialCard({
  quote,
  author,
  role = "Patient",
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-ambient hover:shadow-ambient-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-outline-variant/10">
      <div>
        {/* Rating Stars */}
        <div className="flex gap-1 mb-4 text-secondary">
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              className="material-symbols-outlined text-lg"
              style={{
                fontVariationSettings: `"${
                  index < rating ? "FILL' 1" : "FILL' 0"
                }"`,
              }}
            >
              star
            </span>
          ))}
        </div>

        {/* Quote */}
        <p className="text-body-md text-on-surface-variant italic mb-6 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-3 border-t border-outline-variant/20 pt-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {author.charAt(0)}
        </div>
        <div>
          <h4 className="text-label-md font-bold text-on-background leading-tight">
            {author}
          </h4>
          <p className="text-label-sm text-on-surface-variant text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}
