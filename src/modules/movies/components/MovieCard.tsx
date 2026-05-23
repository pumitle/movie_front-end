interface Props {
  id: string;
  title: string;
  rating: string;
  yearReleased: number;
  posterUrl?: string | null;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const MovieCard = ({ id, title, rating, yearReleased, posterUrl, onView, onEdit, onDelete }: Props) => {
  return (
    <div
      className="
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-card
      "
    >
      <img
        src={
          posterUrl
            ? `${import.meta.env.VITE_IMAGE_URL}${posterUrl}`
            : "https://placehold.co/600x400"
        }
        alt={title}
        className="
          h-[250px]
          w-full
          object-cover
        "
      />

      <div className="p-4">
        <div
          className="
            flex
            items-center
            justify-between
          "
        >
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            {title}
          </h2>

          <span
            className="
              rounded-full
              bg-black
              px-3
              py-1
              text-xs
              text-white
            "
          >
            {rating}
          </span>
        </div>

        <p
          className="
            mt-2
            text-sm
            text-gray-500
          "
        >
          {yearReleased}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView?.(id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-gray-50"
            title="View details"
            aria-label="View details"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onEdit?.(id)}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(id)}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
