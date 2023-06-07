import { Graphviz } from 'graphviz-react';

function App() {
  return (
    <>
      <Graphviz dot={`digraph { a -> b }`} />
    </>
  )
}

export default App
