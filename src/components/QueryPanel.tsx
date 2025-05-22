
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { executeQuery } from "@/lib/db";

const QueryPanel = () => {
  const [query, setQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await executeQuery(query);
      setQueryResult(result);
      
      if (result.length === 0) {
        toast.info("Query executed successfully, but returned no results");
      } else {
        toast.success(`Query returned ${result.length} result${result.length === 1 ? '' : 's'}`);
      }
    } catch (err) {
      console.error("Query execution error:", err);
      setError(err instanceof Error ? err.message : "An error occurred executing the query");
      toast.error("Error executing query");
    } finally {
      setIsLoading(false);
    }
  };

  const renderResultTable = (data: any[]) => {
    if (data.length === 0) return null;
    
    // Get column names from the first result
    const columns = Object.keys(data[0]);
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) => (
                  <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {row[col] === null ? 'NULL' : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-teal-600">SQL Query Tool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter your SQL query here..."
            className="font-mono h-32"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-sm text-gray-500">
            Example: SELECT * FROM patients WHERE firstName = 'John'
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleQuerySubmit}
            className="bg-teal-600 hover:bg-teal-700"
            disabled={isLoading}
          >
            {isLoading ? "Executing..." : "Execute Query"}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {queryResult && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Query Result:</h3>
            <div className="bg-gray-50 border rounded-md overflow-x-auto">
              {queryResult.length > 0 ? (
                renderResultTable(queryResult)
              ) : (
                <p className="p-4 text-gray-500">Query executed successfully, but returned no results.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryPanel;
