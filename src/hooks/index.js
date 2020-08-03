import * as React from "react";

export const useFixedEntry = (max) => {
    const [count, setCount] = React.useState(max);
    const [input, setInput] = React.useState('');
    const handleCount = (value) => {
      let remain = max - value.length;
      setCount(remain);
      setInput(value);
    };
    return [count, input, handleCount];
  }

