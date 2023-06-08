type StackProps = {
  children: React.ReactNode;
};

function Stack({ children }: StackProps) {
  return <div className="stack">{children}</div>;
}

export default Stack;
