import { Graphviz } from "graphviz-react";

function App() {
  const dot = `
  digraph finite_state_machine {
    rankdir=LR;
    size="8,5"

    node [shape = doublecircle]; S[color=red];
    node [shape = point ]; qi[color=white]

    node [shape = circle, color = blue]; q1;
    node [shape = circle, color = green]; q2;
    qi -> S;
    S  -> q1 [ label = "a" ];
    S  -> S  [ label = "a" ];
    q1 -> S  [ label = "a" ];
    q1 -> q2 [ label = "b" ];
    q2 -> q1 [ label = "b" ];
    q2 -> q2 [ label = "b" ];
}
  `;

  return (
    <>
      <Graphviz dot={dot} />
    </>
  );
}

export default App;
