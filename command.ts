import testJSON from "./sql/test.json" assert { type: "json" };

const data = testJSON.sort((a, b) => {
  return (a.view_date < b.view_date) ? -1 : 1;
}).map((test) => {
  const str = {
    title: test.title,
    is_dubbed: test.is_dubbed ?? "NULL",
    is_domestic: test.is_domestic ?? "NULL",
    is_live_action: test.is_live_action ?? "NULL",
    theater: test.theater,
    view_date: test.view_date,
    view_start_time: test.view_start_time ?? "NULL",
    view_end_time: test.view_end_time ?? "NULL",
    accompanier: test.accompanier ?? "NULL",
    rating: "NULL",
    comment: "NULL",
  };
  return `('${str.title}',${str.is_dubbed},${str.is_domestic},${str.is_live_action},'${str.theater}','${str.view_date}','${str.view_start_time}','${str.view_end_time}',${str.accompanier},${str.rating},'${str.comment}')`;
});

console.log(data.join(","));
