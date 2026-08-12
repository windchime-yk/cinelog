import { type VNode } from "preact";
import { elapsedTime } from "~/core/util.ts";
import type { PickMovie } from "~/db/model.ts";
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
          format={movie.format}
          // 邦画は字幕の有無を記録していないため、洋画のときだけ表示する
          isSubtitled={!movie.is_domestic && movie.is_subtitled}
        />
      </li>
    ))}
  </ul>
);
