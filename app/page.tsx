"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Matrix = number[][];

export default function Home() {
  const [N, setN] = useState<number>(3);
  const [M, setM] = useState<number>(3);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [input, setInput] = useState<Matrix>(() => Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => -1)));
  const [weights, setWeights] = useState<Matrix>(() => Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => 0)));
  const [lr, setLr] = useState<number>(0.1);
  const [output, setOutput] = useState<number>(0);

  // Initialize matrices whenever N or M changes
  useEffect(() => {
    setInput(() => Array.from({ length: N }, () => Array.from({ length: M }, () => -1)));
    setWeights(() => Array.from({ length: N }, () => Array.from({ length: M }, () => 0)));
    setOutput(0);
  }, [N, M]);

  useEffect(() => {
    let sum = 0;
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        sum += input[i][j] * weights[i][j];
      }
    }
    setOutput(sum);
  }, [input, weights]);

  const toggleCell = (i: number, j: number) => {
    setInput(prev => {
      const newInput: Matrix = prev.map(row => [...row]);
      newInput[i][j] = newInput[i][j] * -1;
      return newInput;
    });
  };

  // Weight editing helpers
  const changeWeight = (i: number, j: number, delta: number) => {
    setWeights(prev => {
      const next: Matrix = prev.map(row => [...row]);
      const newVal = +((next[i]?.[j] ?? 0) + delta).toFixed(2);
      next[i][j] = newVal;
      return next;
    });
  };

  const setWeight = (i: number, j: number, value: number) => {
    setWeights(prev => {
      const next: Matrix = prev.map(row => [...row]);
      next[i][j] = +value.toFixed(2);
      return next;
    });
  };

  const accept = () => {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const inputVal = input[i][j];
        const weightUpdate = lr * inputVal;
        setWeight(i, j, weights[i][j] + weightUpdate);
      }
    }
  };

  const reject = () => {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < M; j++) {
        const inputVal = input[i][j];
        const weightUpdate = lr * inputVal;
        setWeight(i, j, weights[i][j] - weightUpdate);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Perceptron Simulation</h1>

      {/* Info icon top-right */}
      <button
        aria-label="Show info"
        onClick={() => setShowInfo(true)}
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 border"
        title="About this simulation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.75 5.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM11 10h2v6h-2v-6z" />
        </svg>
      </button>

      {/* Controls for N and M */}
      <div className="flex gap-4 items-center">
        <label className="flex flex-col items-center">
          <span>Rows (N)</span>
          <input
            type="number"
            min={1}
            max={5}
            value={N}
            onChange={(e) => setN(parseInt(e.target.value) || 1)}
            className="w-16 text-center border rounded p-1"
          />
        </label>
        <label className="flex flex-col items-center">
          <span>Cols (M)</span>
          <input
            type="number"
            min={1}
            max={5}
            value={M}
            onChange={(e) => setM(parseInt(e.target.value) || 1)}
            className="w-16 text-center border rounded p-1"
          />
        </label>
      </div>

      {/* LED Matrix */}
      <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${M}, 56px)` }}>
        {input.map((row, i) =>
          row.map((cell, j) => (
            <motion.div
              key={`${i}-${j}`}
              onClick={() => toggleCell(i, j)}
              className={`w-12 h-12 rounded-lg cursor-pointer m-1 border-2 items-center justify-center flex 
                ${cell === 1 ? "bg-yellow-400" : ""}`}
              whileTap={{ scale: 0.9 }}
            >
              <span className="font-mono">{cell}</span>
            </motion.div>
          ))
        )}
      </div>

      {/* Weight Matrix */}
      <div className="grid mt-4" style={{ gridTemplateColumns: `repeat(${M}, 70px)` }}>
        {weights.map((row, i) =>
          row.map((w, j) => (
            <motion.div
              key={`w-${i}-${j}`}
              onClick={() => changeWeight(i, j, lr)}
              onContextMenu={(e) => { e.preventDefault(); changeWeight(i, j, -lr); }}
              title="Click to increase, Right-click to decrease"
              className={`w-16 h-16 flex items-center justify-center rounded-full border select-none cursor-pointer
                ${w > 0 ? "bg-green-600" : w < 0 ? "bg-red-600" : "bg-gray-600"}`}
            >
              <span className="font-mono text-white">{w.toFixed(2)}</span>
            </motion.div>
          ))
        )}
      </div>

      {/* Learning Rate */}
      <label className="flex flex-row items-center gap-0.5">
        <span>Learning Rate: </span>
        <input
          type="number"
          min={0}
          max={1}
          step={0.1}
          value={lr}
          onChange={(e) => setLr(parseFloat(e.target.value))}
          className="w-16 text-center border rounded p-1"
        />
      </label>

      {/* Output Indicator */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], backgroundColor: output == 0 ? "#9ca3af" : output > 0 ? "#22c55e" : "#ef4444" }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold"
      >
        {output.toFixed(2)}
      </motion.div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <Button className="bg-green-600" variant="default" onClick={accept}>Accept</Button>
        <Button className="bg-red-600" variant="default" onClick={reject}>Reject</Button>
      </div>

      <span>Made by <a href="https://github.com/roundspecs" target="_blank">Zarif</a></span>

      {/* Info Modal */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowInfo(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold">The simulation was inspired by</h2>
              <button
                aria-label="Close"
                onClick={() => setShowInfo(false)}
                className="ml-4 text-gray-600 hover:text-gray-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <div className="aspect-video w-full">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/l-9ALe3U-Fg"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
