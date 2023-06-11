import { Graphviz } from "graphviz-react";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import katex from "katex";
import { useAutomaton } from "./context";

function App() {
  const automaton = useAutomaton();
  const [input, setInput] = useState("");

  const handleInput = () => {
    const inputArray = input.split("");
    let i = 0;

    let interval = setInterval(() => {
      if (i < inputArray.length) {
        automaton.evaluate(inputArray[i]);
        i++;
      } else if (automaton.currentState === "HALTED") {
        clearInterval(interval);
      } else {
        automaton.evaluate("");
        clearInterval(interval);
      }
    }, 1000);
  };

  const dot = `
  digraph finite_state_machine {
    rankdir=LR;

    node [shape = circle];
    qi[color=white, shape=point];
    q0[color=${automaton.currentState === "q0" ? "green" : "black"}];
    q1[color=${automaton.currentState === "q1" ? "green" : "black"}];
    q2[color=${automaton.currentState === "q2" ? "green" : "black"}];
    q3[color=${automaton.currentState === "q3" ? "green" : "black"}];
    q4[color=${automaton.currentState === "q4" ? "green" : "black"}];
    q4[shape = doublecircle];

    # node [shape = circle, color = green]; q2;
    qi -> q0;
    q0 -> q1 [ color=${
      automaton.lastTransition === "q0 -> q1" ? "green" : "black"
    }, label = "1. 0, # / AA#\n\n2. 0,# / B#"];
    q1 -> q1 [ color=${
      automaton.lastTransition === "q1 -> q1" ? "green" : "black"
    }, label = "1. 0, A / AAA\n\n2. 0,B / BB" ];
    q1 -> q2 [ color=${
      automaton.lastTransition === "q1 -> q2" ? "green" : "black"
    }, label = "1. 1, A / &lambda;" ];
    q2 -> q2 [ color=${
      automaton.lastTransition === "q2 -> q2" ? "green" : "black"
    }, label = "1. 1, A / &lambda;" ];
    q2 -> q3 [ color=${
      automaton.lastTransition === "q2 -> q3" ? "green" : "black"
    }, label = "2. 0, B / &lambda;" ];
    q3 -> q3 [ color=${
      automaton.lastTransition === "q3 -> q3" ? "green" : "black"
    }, label = "2. 0, B / &lambda;" ];
    q3 -> q4 [ color=${
      automaton.lastTransition === "q3 -> q4" ? "green" : "black"
    }, label = "2. &lambda;, # / #" ];
}
  `;

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <h1>Pushdown Automata</h1>
        <KatexHeader expression="L = \lbrace  0^i1^{2i}0^i: i\geq0 \rbrace, \text{sobre } \Sigma = \lbrace 0, 1 \rbrace" />
        <label htmlFor="input">Input: </label>
        <input
          type="text"
          name="input"
          id="input"
          value={input}
          onChange={(e) => {
            if (e.target.value.match(/^[01]*$/)) {
              setInput(e.target.value);
            }
          }}
        />
        <button
          type="button"
          onClick={handleInput}
          style={{
            backgroundColor: "#2563EB",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            margin: "0 0.5rem",
          }}
        >
          <span role="img" aria-label="play">
            ▶️
          </span>
        </button>
        <div>
          {automaton.currentState === "HALTED" && (
            <p style={{ color: "red" }}>Rechazado</p>
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Graphviz dot={dot} options={{ width: 1000 }} />
        <div style={{ display: "flex" }}>
          <Stack>
            {automaton.stack1.map((item, index) => (
              <StackItem key={index}>{item}</StackItem>
            ))}
          </Stack>
          <Stack>
            {automaton.stack2.map((item, index) => (
              <StackItem key={index}>{item}</StackItem>
            ))}
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
