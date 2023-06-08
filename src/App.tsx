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
    <div style={{ display: "flex" }}>
      <Graphviz dot={dot} />
      <Stack>
        <StackItem>#</StackItem>
      </Stack>
      <Stack>
        <StackItem>#</StackItem>
      </Stack>
    </div>
  );
}

const Stack = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: end;
  height: 500px;
  width: 100px;
`;

const StackItem = styled.div<{ $color?: string }>`
  height: 100px;
  width: 100px;
  background-color: ${(props) => props.$color || "#d1d5db"};
  text-align: center;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #9ca3af;
`;

export default App;
