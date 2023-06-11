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
  if (state.currentState === "HALTED") {
    return state;
  }

  const transitions = rules[state.currentState];

  const transition = transitions[input];

  if (!transition) {
    return {
      ...state,
      currentState: "HALTED",
    };
  }

  let stack1 = [...state.stack1];
  let stack2 = [...state.stack2];
  let newState: PossibleStates = state.currentState;
  let isHalted = true;

  for (const t of transition) {
    var { stack: stackNumber, pop, push, state: nextState } = t;
    const stack = stackNumber === 1 ? state.stack1 : state.stack2;

    const lastElement = stack.pop();
    if (lastElement !== pop) {
      stack.push(lastElement!);
      continue;
    }

    isHalted = false;

    push.forEach((e) => stack.push(e));

    if (stackNumber === 1) {
      stack1 = stack;
    } else {
      stack2 = stack;
    }

    newState = nextState;
  }

  if (isHalted) {
    return {
      ...state,
      currentState: "HALTED",
    };
  }

  return {
    ...state,
    stack1,
    stack2,
    currentState: newState,
    lastTransition: `${state.currentState} -> ${newState}`,
  };
}
