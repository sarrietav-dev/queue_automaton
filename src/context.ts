import { create } from "zustand";

type StackAlphabet = "#" | "A" | "B";
type PossibleStates = "q0" | "q1" | "q2" | "q3" | "q4" | "HALTED";
type Transition = `${PossibleStates} -> ${PossibleStates}`;

type RuleType = {
  [key: string]: {
    [key: string]: {
      stack: number;
      pop: StackAlphabet;
      push: StackAlphabet[];
      state: PossibleStates;
    }[];
  };
};

const rules: RuleType = {
  q0: {
    "0": [
      {
        stack: 1,
        pop: "#",
        push: ["#", "A", "A"],
        state: "q1",
      },
      {
        stack: 2,
        pop: "#",
        push: ["#", "B"],
        state: "q1",
      },
    ],
  },
  q1: {
    "0": [
      {
        stack: 1,
        pop: "A",
        push: ["A", "A", "A"],
        state: "q1",
      },
      {
        stack: 2,
        pop: "B",
        push: ["B", "B"],
        state: "q1",
      },
    ],
    "1": [
      {
        stack: 1,
        pop: "A",
        push: [],
        state: "q2",
      },
    ],
  },
  q2: {
    "1": [
      {
        stack: 1,
        pop: "A",
        push: [],
        state: "q2",
      },
    ],
    "0": [
      {
        stack: 2,
        pop: "B",
        push: [],
        state: "q3",
      },
    ],
  },
  q3: {
    "0": [
      {
        stack: 2,
        pop: "B",
        push: [],
        state: "q3",
      },
    ],
    "": [
      {
        stack: 2,
        pop: "#",
        push: ["#"],
        state: "q4",
      },
    ],
  },
};

type AutomatonState = {
  stack1: string[];
  stack2: string[];
  currentState: PossibleStates;
  lastTransition: Transition | "";
  evaluate: (input: string) => void;
};

export const useAutomaton = create<AutomatonState>()((set) => ({
  stack1: ["#"],
  stack2: ["#"],
  currentState: "q0",
  lastTransition: "",
  evaluate: (input: string) => set((state) => evaluate(input, state)),
}));

function evaluate(input: string, state: AutomatonState): AutomatonState {
  const transitions = rules[state.currentState];

  const transition = transitions[input];

  for (const t of transition) {
    const { stack: stackNumber, pop, push, state: newState } = t;
    const stack = stackNumber === 1 ? state.stack1 : state.stack2;

    const lastElement = stack.pop();
    if (lastElement !== pop) {
      stack.push(lastElement!);
      continue;
    };

    push.forEach((e) => stack.push(e));

    return stackNumber === 1
      ? {
          ...state,
          stack1: stack,
          currentState: newState,
          lastTransition: `${state.currentState} -> ${newState}`,
        }
      : {
          ...state,
          stack2: stack,
          currentState: newState,
          lastTransition: `${state.currentState} -> ${newState}`,
        };
  }

  return {
    ...state,
    currentState: "HALTED",
  };
}
