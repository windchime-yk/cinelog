import { type VNode } from "preact";
import { elapsedTime } from "~/core/util.ts";
import { type PickMovie } from "~/db/schema/movie.ts";
import { Card } from "~/components/organisms/Card.tsx";

interface MovieCardListProps {
  movies: Array<PickMovie>;
}

export const MovieCardList = ({ movies }: MovieCardListProps): VNode => (
  <ul class="w-full md:w-5/6 h-full grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 mx-auto">
    {movies.map((movie) => (
      <li class="">
        <Card
          title={movie.title}
          viewDate={movie.view_date}
          viewTime={elapsedTime(movie.diff)}
        />
      </li>
    ))}
  </ul>
);
