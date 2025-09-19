"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Calculator() {
  const [x, setX] = useState<string>("");
  const [y, setY] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setX(value);
    }
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setY(value);
    }
  };

  const calculate = async (operation: string) => {
    const numX = parseFloat(x);
    const numY = parseFloat(y);

    if (isNaN(numX) || isNaN(numY)) {
      setResult("Please enter valid numbers");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/${operation}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x: numX,
          y: numY,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setResult(errorData.detail || "Error occurred");
        return;
      }

      const data = await response.json();
      setResult(data.result.toString());
    } catch (error) {
      setResult("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="x">X</Label>
            <Input
              id="x"
              type="text"
              value={x}
              onChange={handleXChange}
              placeholder="Enter number X"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="y">Y</Label>
            <Input
              id="y"
              type="text"
              value={y}
              onChange={handleYChange}
              placeholder="Enter number Y"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => calculate("add")}
              variant="outline"
              disabled={loading}
            >
              {loading ? "..." : "Add"}
            </Button>
            <Button
              onClick={() => calculate("subtract")}
              variant="outline"
              disabled={loading}
            >
              {loading ? "..." : "Subtract"}
            </Button>
            <Button
              onClick={() => calculate("multiply")}
              variant="outline"
              disabled={loading}
            >
              {loading ? "..." : "Multiply"}
            </Button>
            <Button
              onClick={() => calculate("divide")}
              variant="outline"
              disabled={loading}
            >
              {loading ? "..." : "Divide"}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="result">Result</Label>
            <Input
              id="result"
              type="text"
              value={result}
              readOnly
              placeholder="Result will appear here"
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}