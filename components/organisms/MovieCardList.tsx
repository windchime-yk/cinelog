import { type VNode } from "preact";
import { elapsedTime } from "../../core/util.ts";
import { Card } from "./Card.tsx";
import type { MovieInfo } from "../../model.ts";

interface MovieCardListProps {
  movies: Array<MovieInfo>;
}

export const MovieCardList = ({ movies }: MovieCardListProps): VNode => (
  <ul class="w-full md:w-5/6 h-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 mx-auto">
    {movies.map((movie) => (
      <li class="">
        <Card
          title={movie.title}
          viewDate={movie.view_date}
          viewTime={elapsedTime(movie)}
        />
      </li>
    ))}
  </ul>
);
