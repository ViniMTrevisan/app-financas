"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateRangeFilterProps {
  onFilter: (range: { start: string, end: string }) => void;
  onClear: () => void;
}

export default function DateRangeFilter({ onFilter, onClear }: DateRangeFilterProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (start && end) {
      onFilter({ start, end });
    }
  };

  const handleClear = () => {
    setStart('');
    setEnd('');
    onClear();
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Filtrar por Data</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-2">
              <Label htmlFor="start-date">De:</Label>
              <Input 
                type="date" 
                id="start-date"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                required
                // *** A CORREÇÃO ESTÁ AQUI ***
                className="dark:[color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">Até:</Label>
              <Input 
                type="date" 
                id="end-date"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                required
                // *** E AQUI ***
                className="dark:[color-scheme:dark]"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1">
              Filtrar
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={handleClear}
              className="flex-1"
            >
              Limpar Filtro
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}