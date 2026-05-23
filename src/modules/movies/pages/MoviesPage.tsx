import { observer } from "mobx-react-lite";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import DashboardLayout from "../../../layouts/DashboardLayout";
import { getMovieByIdApi } from "../../../infrastructure/api/movie.api";
import type { MovieDetail } from "../types/movie.types";

import MovieCard from "../components/MovieCard";
import MovieStats from "../components/MovieStats";

import { useStore } from "../../../shared/hooks/useStore";
import { useToast } from "../../../shared/hooks/useToast";
import Button from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import Card from "../../../shared/components/ui/Card";

const MoviesPage = observer(() => {
  const { movieStore } = useStore();
  const { showToast } = useToast();
  const [searchInput, setSearchInput] = useState(movieStore.search);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [yearReleased, setYearReleased] = useState("");
  const [rating, setRating] = useState("PG");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetail | null>(null);
  const [isMovieDetailLoading, setIsMovieDetailLoading] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editYearReleased, setEditYearReleased] = useState("");
  const [editRating, setEditRating] = useState("PG");
  const [editDescription, setEditDescription] = useState("");
  const [editPoster, setEditPoster] = useState<File | null>(null);
  const [editCurrentPosterUrl, setEditCurrentPosterUrl] = useState<string | null>(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);

  useEffect(() => {
    movieStore.fetchMovies();
  }, [movieStore.page, movieStore.limit, movieStore.rating]);

  useEffect(() => {
    movieStore.fetchMovieStats();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    movieStore.setSearch(searchInput.trim());
    movieStore.fetchMovies();
  };

  const handleAddMovie = () => {
    setShowAddForm((prev) => !prev);
  };

  const handleAddMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const year = Number(yearReleased);
    if (!title.trim() || !year || Number.isNaN(year)) {
      showToast("กรุณากรอกชื่อหนังและปีที่ฉายให้ถูกต้อง", "error");
      return;
    }

    try {
      await movieStore.createMovie({
        title: title.trim(),
        yearReleased: year,
        rating,
        description: description.trim() || undefined,
        poster,
      });

      setTitle("");
      setYearReleased("");
      setRating("PG");
      setDescription("");
      setPoster(null);
      setShowAddForm(false);
      showToast("เพิ่มหนังเรียบร้อยแล้ว", "success");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;

      if (status === 403 || message === "Forbidden") {
        showToast("คุณไม่มีสิทธิ์สร้างหนัง (สำหรับ role นี้)", "error");
        return;
      }

      showToast("ไม่สามารถเพิ่มหนังได้ กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  const handleViewMovie = async (id: string) => {
    setIsMovieDetailLoading(true);
    try {
      const movie = await getMovieByIdApi(id);
      setSelectedMovie(movie);
    } catch {
      showToast("ไม่สามารถโหลดรายละเอียดหนังได้", "error");
    } finally {
      setIsMovieDetailLoading(false);
    }
  };

  const handleEditMovie = async (id: string) => {
    setIsEditLoading(true);
    try {
      const movie = await getMovieByIdApi(id);

      setEditingMovieId(String(movie?.id ?? id));
      setEditTitle(movie?.title ?? "");
      setEditYearReleased(String(movie?.yearReleased ?? ""));
      setEditRating(movie?.rating ?? "PG");
      setEditDescription(movie?.description ?? "");
      setEditPoster(null);
      setEditCurrentPosterUrl(movie?.posterUrl ?? null);
    } catch {
      showToast("ไม่สามารถโหลดข้อมูลสำหรับแก้ไขได้", "error");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleUpdateMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovieId) return;

    const year = Number(editYearReleased);
    if (!editTitle.trim() || !year || Number.isNaN(year)) {
      showToast("กรุณากรอกชื่อหนังและปีที่ฉายให้ถูกต้อง", "error");
      return;
    }

    try {
      await movieStore.updateMovie(editingMovieId, {
        title: editTitle.trim(),
        yearReleased: year,
        rating: editRating,
        description: editDescription.trim() || undefined,
        poster: editPoster,
        currentPosterUrl: editCurrentPosterUrl ?? undefined,
      });
      showToast("อัปเดตข้อมูลหนังเรียบร้อยแล้ว", "success");
      setEditingMovieId(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;

      if (status === 403 || message === "Forbidden") {
        showToast("คุณไม่มีสิทธิ์แก้ไขหนัง (สำหรับ role นี้)", "error");
        return;
      }
      showToast("ไม่สามารถแก้ไขข้อมูลหนังได้ กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  const handleDeleteMovie = (id: string) => {
    setDeleteMovieId(id);
  };

  const confirmDeleteMovie = async () => {
    if (!deleteMovieId) return;

    try {
      await movieStore.deleteMovie(deleteMovieId);
      showToast("ลบหนังเรียบร้อยแล้ว", "success");
      setDeleteMovieId(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError?.response?.status;
      const message = axiosError?.response?.data?.message;

      if (status === 403 || message === "Forbidden") {
        showToast("คุณไม่มีสิทธิ์ลบหนัง (สำหรับ role นี้)", "error");
        return;
      }
      showToast("ไม่สามารถลบหนังได้ กรุณาลองใหม่อีกครั้ง", "error");
    }
  };

  return (
    <DashboardLayout>
      <div
        className="
          mb-6
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              text-3xl
              font-bold
            "
          >
            Movies
          </h1>

          <p
            className="
              mt-1
              text-gray-500
            "
          >
            Manage movie collection
          </p>
        </div>
      </div>
      {selectedMovie && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Movie Details</h3>
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setSelectedMovie(null)}
              >
                Close
              </button>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <img
                src={
                  selectedMovie.posterUrl
                    ? `${import.meta.env.VITE_IMAGE_URL}${selectedMovie.posterUrl}`
                    : "https://placehold.co/600x400"
                }
                alt={selectedMovie.title}
                className="h-[360px] w-full rounded-xl object-cover"
              />
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-gray-900">{selectedMovie.title}</h4>
                <p className="text-sm text-gray-500">Year: {selectedMovie.yearReleased || "-"}</p>
                <p className="inline-flex rounded-full bg-black px-3 py-1 text-xs text-white">
                  {selectedMovie.rating}
                </p>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Description</p>
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {selectedMovie.description || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editingMovieId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Movie</h3>
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setEditingMovieId(null)}
              >
                Close
              </button>
            </div>

            <form onSubmit={handleUpdateMovieSubmit} className="grid gap-4 p-5 md:grid-cols-2">
              <Input
                label="Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
              <Input
                label="Year Released"
                type="number"
                value={editYearReleased}
                onChange={(e) => setEditYearReleased(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500">Rating</label>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
                >
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="M">M</option>
                  <option value="MA">MA</option>
                  <option value="R">R</option>
                </select>
              </div>
              <Input
                label="Description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-500">Poster</label>
                {editCurrentPosterUrl && !editPoster && (
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}${editCurrentPosterUrl}`}
                    alt="Current poster"
                    className="h-40 w-28 rounded-lg object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditPoster(e.target.files?.[0] ?? null)}
                  className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" loading={movieStore.loading}>
                  Save changes
                </Button>
                <Button type="button" variant="secondary" onClick={() => setEditingMovieId(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteMovieId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">ยืนยันการลบ</h3>
            <p className="mt-2 text-sm text-gray-600">
              คุณต้องการลบหนังรายการนี้ใช่ไหม? การลบนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="mt-4 flex gap-2">
              <Button type="button" variant="danger" loading={movieStore.loading} onClick={confirmDeleteMovie}>
                ลบรายการ
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDeleteMovieId(null)}
                disabled={movieStore.loading}
              >
                ยกเลิก
              </Button>
            </div>
          </div>
        </div>
      )}

      <MovieStats
        totalMovies={movieStore.totalMovies}
        onAddMovie={handleAddMovie}
        ratings={{
          G: movieStore.ratingStats.G,
          PG: movieStore.ratingStats.PG,
          M: movieStore.ratingStats.M,
          MA: movieStore.ratingStats.MA,
          R: movieStore.ratingStats.R,
        }}
      />
      {showAddForm && (
        <Card className="mb-6">
          <form onSubmit={handleAddMovieSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              label="Title"
              placeholder="Interstellar"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              label="Year Released"
              type="number"
              placeholder="2014"
              value={yearReleased}
              onChange={(e) => setYearReleased(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
              >
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="M">M</option>
                <option value="MA">MA</option>
                <option value="R">R</option>
              </select>
            </div>
            <Input
              label="Description"
              placeholder="A story about space and time"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-medium text-gray-500">Poster</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files?.[0] ?? null)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-400"
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" loading={movieStore.loading}>
                Save movie
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="mb-6">
        <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              label="Search movie"
              placeholder="Search by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Rating</label>
            <select
              value={movieStore.rating}
              onChange={(e) => movieStore.setRating(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value="">All ratings</option>
              <option value="G">G</option>
              <option value="PG">PG</option>
              <option value="M">M</option>
              <option value="MA">MA</option>
              <option value="R">R</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">Per page</label>
            <select
              value={movieStore.limit}
              onChange={(e) => movieStore.setLimit(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-400"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="md:col-span-4 flex gap-2">
            <Button type="submit" loading={movieStore.loading}>
              Search
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setSearchInput("");
                movieStore.setSearch("");
                movieStore.setRating("");
                movieStore.fetchMovies();
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <div
        className="
          grid
          grid-cols-1
          gap-6

          md:grid-cols-2

          lg:grid-cols-3
        "
      >
        {movieStore.movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            rating={movie.rating}
            yearReleased={movie.yearReleased}
            posterUrl={movie.posterUrl}
            onView={handleViewMovie}
            onEdit={handleEditMovie}
            onDelete={handleDeleteMovie}
          />
        ))}
      </div>

      {movieStore.movies.length === 0 && !movieStore.loading && (
        <p className="mt-6 text-sm text-gray-500">No movies found.</p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {movieStore.page} of {movieStore.totalPages} ({movieStore.total} items)
        </p>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            disabled={movieStore.page <= 1 || movieStore.loading || isMovieDetailLoading || isEditLoading}
            onClick={() => movieStore.setPage(movieStore.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={movieStore.page >= movieStore.totalPages || movieStore.loading || isMovieDetailLoading || isEditLoading}
            onClick={() => movieStore.setPage(movieStore.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
});

export default MoviesPage;
