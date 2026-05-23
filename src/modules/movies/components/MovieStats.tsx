import Card from "../../../shared/components/ui/Card";
import Button from "../../../shared/components/ui/Button";

interface Props {
  totalMovies: number;
  ratings: {
    G: number;
    PG: number;
    M: number;
    MA: number;
    R: number;
  };
  onAddMovie?: () => void;
}

const badges = [
  { key: "G", tone: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { key: "PG", tone: "border-blue-200 bg-blue-50 text-blue-700" },
  { key: "M", tone: "border-amber-200 bg-amber-50 text-amber-700" },
  { key: "MA", tone: "border-rose-200 bg-rose-50 text-rose-700" },
  { key: "R", tone: "border-slate-200 bg-slate-50 text-slate-700" },
] as const;

const MovieStats = ({ totalMovies, ratings, onAddMovie }: Props) => {
  return (
    <Card className="mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Movies</p>
          <p className="text-3xl font-bold text-gray-900">{totalMovies}</p>
        </div>

        <div className="flex flex-col items-start gap-3 md:items-end">
          <Button type="button" onClick={onAddMovie}>
            + Add Movie
          </Button>
          <div className="flex flex-wrap gap-2">
            {badges.map(({ key, tone }) => (
              <div key={key} className={`rounded-full border px-3 py-1 text-sm font-semibold ${tone}`}>
                {key}: {ratings[key]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MovieStats;
