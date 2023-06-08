import { Graphviz } from "graphviz-react";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import katex from "katex";

function App() {
  const dot = `
  digraph finite_state_machine {
    rankdir=LR;

    node [shape = circle];
    qi[color=white, shape=point];
    q4[shape = doublecircle];

    # node [shape = circle, color = green]; q2;
    qi -> q0;
    q0 -> q1 [ label = "1. 0,# / AA#\n\n2. 0,# / B#"];
    q1 -> q1 [ label = "1. 0,A / AAA\n\n2. 0,B / BB" ];
    q1 -> q2 [ label = "1. A / &lambda;" ];
    q2 -> q2 [ label = "1. A / &lambda;" ];
    q2 -> q3 [ label = "2. B / &lambda;" ];
    q3 -> q3 [ label = "2. B / &lambda;" ];
    q3 -> q4 [ label = "2. &lambda;, # / #" ];
}
  `;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Pushdown Automata</h1>
        <KatexHeader expression="L = \lbrace  0^i1^{2i}0^i: i\geq0 \rbrace, \text{sobre } \Sigma = \lbrace 0, 1 \rbrace" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Graphviz dot={dot} options={{ width: 1000 }} />
        <div style={{ display: "flex" }}>
          <Stack>
            <StackItem>#</StackItem>
          </Stack>
          <Stack>
            <StackItem>#</StackItem>
          </Stack>
        </div>
      </div>
    </>
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

type KatexHeaderProps = {
  expression: string;
};

const KatexHeader = ({ expression }: KatexHeaderProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    katex.render(expression, containerRef.current as HTMLHeadingElement);
  }, [expression]);

  return <h2 ref={containerRef}></h2>;
};

export default App;
