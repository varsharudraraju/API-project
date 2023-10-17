const books= [
  {
  ISBN: "12345book",
  title: " crack",
  pubDate: "10-10-2023",
  language:"en",
  numPage:250,
  author:[1,2],
  publications:[1],
  category:["space","comedy","horror"]
}
]

const author=[
  {
    id:1,
    name:"varsha",
    books:["12345book", "secret book"]
  },
  {
    id:2,
    name:"santhu",
    books:["12345book"]

  }
]

const publication=[
  {
    id:1,
    name:"writex",
    books:["12345book"]
  }
]

module.exports={books, author, publication};
