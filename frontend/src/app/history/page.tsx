"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CalculationHistory {
  id: string;
  operation: string;
  x: number;
  y: number;
  result: number;
  timestamp: string;
}

export default function History() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/history");
      if (!response.ok) {
        throw new Error("Failed to fetch history");
      }
      const data = await response.json();
      setHistory(data.calculations);
    } catch (error) {
      setError("Failed to load calculation history");
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/history", {
        method: "DELETE",
      });
      if (response.ok) {
        setHistory([]);
      } else {
        throw new Error("Failed to clear history");
      }
    } catch (error) {
      setError("Failed to clear history");
      console.error("Error clearing history:", error);
    }
  };

  const exportHistory = async () => {
    try {
      window.open("http://localhost:8000/export-file", "_blank");
    } catch (error) {
      setError("Failed to export history");
      console.error("Error exporting history:", error);
    }
  };

  const formatOperation = (operation: string) => {
    const operationMap: { [key: string]: string } = {
      addition: "+",
      subtraction: "-",
      multiplication: "×",
      division: "÷",
    };
    return operationMap[operation] || operation;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 max-w-6xl">
        <div className="text-center">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Calculation History</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportHistory} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={clearHistory}
            variant="destructive"
            disabled={history.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </div>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {history.length > 0
              ? `${history.length} Calculation${history.length === 1 ? '' : 's'}`
              : "No Calculations Yet"
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No calculations have been performed yet.</p>
              <Link href="/calculator">
                <Button className="mt-4">Start Calculating</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Expression</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {formatDate(item.timestamp)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {item.x} {formatOperation(item.operation)} {item.y}
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {item.result}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}