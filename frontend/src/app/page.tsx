import Link from "next/link";
import { Calculator, History, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Calculator Desktop App</h1>
        <p className="text-xl text-muted-foreground mb-8">
          A powerful calculator with calculation history and data export features
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculator
            </CardTitle>
            <CardDescription>
              Perform basic arithmetic operations with a clean, modern interface
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/calculator">
              <Button className="w-full">Open Calculator</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              History
            </CardTitle>
            <CardDescription>
              View and manage your calculation history with timestamps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/history">
              <Button variant="outline" className="w-full">View History</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your calculation history as a JSON file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="http://localhost:8000/export" target="_blank">
              <Button variant="secondary" className="w-full">Export JSON</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold mb-2">✓ Basic Operations</h3>
                <p className="text-sm text-muted-foreground">Addition, subtraction, multiplication, and division</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Input Validation</h3>
                <p className="text-sm text-muted-foreground">Number-only inputs with error handling</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Calculation History</h3>
                <p className="text-sm text-muted-foreground">Automatic saving of all calculations with timestamps</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">✓ Data Export</h3>
                <p className="text-sm text-muted-foreground">Export calculation history as JSON files</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
