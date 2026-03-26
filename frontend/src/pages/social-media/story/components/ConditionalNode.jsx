const ConditionalNode = ({ condition, children }) => {
  if (condition) return <> {children} </>;

  return <></>;
};

export { ConditionalNode };
