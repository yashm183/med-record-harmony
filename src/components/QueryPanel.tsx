
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const QueryPanel = () => {
  const [query, setQuery] = useState<string>("");
  const [queryResult, setQueryResult] = useState<string | null>(null);
  
  const handleQuerySubmit = () => {
    if (!query.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    // This is just a placeholder - we'll implement actual SQL execution later
    toast.info("Query execution will be implemented in the next phase");
    setQueryResult("Query results will appear here once database integration is complete.");
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
            Example: SELECT * FROM patients WHERE first_name = 'John'
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleQuerySubmit}
            className="bg-teal-600 hover:bg-teal-700"
          >
            Execute Query
          </Button>
        </div>

        {queryResult && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Query Result:</h3>
            <div className="bg-gray-50 border rounded-md p-4 font-mono text-sm overflow-x-auto">
              {queryResult}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryPanel;
