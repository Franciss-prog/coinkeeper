"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ALL_CURRENCIES, TOP_CURRENCIES, Currency } from "@/lib/data/currencies";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  date: string;
};



const STORAGE_KEY = "coinkeeper:transactions";
const CATEGORIES = ["Food", "Transport", "Bills", "Other"] as const;
const COLORS = ["#6366f1", "#22c55e", "#f97316", "#e11d48"];

export default function Home() {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("Food");
  const [date, setDate] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setTransactions(JSON.parse(raw) as Transaction[]);
      } catch {
        setTransactions([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!isFinite(parsed) || parsed <= 0 || !date) return;
    const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    setTransactions((prev) => [{ id, amount: Number(parsed.toFixed(2)), category, date }, ...prev]);
    setAmount("");
    setDate("");
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const chartData = useMemo(() => {
    const totals: Record<string, number> = { Food: 0, Transport: 0, Bills: 0, Other: 0 };
    for (const t of transactions) {
      totals[t.category] += t.amount;
    }
    return CATEGORIES.map((c) => ({ name: c, value: totals[c] }));
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm">Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border rounded p-2 w-full"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm">Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                {/* Currency Selector */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm">Currency</label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className="w-full justify-between">
                        {currency || "Select currency..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search currency..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No currency found.</CommandEmpty>

                          {/* Top currencies */}
                          <CommandGroup heading="Top Currencies">
                            {TOP_CURRENCIES.map((cur) => (
                              <CommandItem
                                key={cur}
                                value={cur}
                                onSelect={() => { setCurrency(cur); setOpen(false); }}
                              >
                                {cur}
                                <Check className={cn("ml-auto", currency === cur ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>

                          {/* Divider */}
                          <CommandItem disabled>────────</CommandItem>

                          {/* All currencies except top ones */}
                          <CommandGroup heading="All Currencies">
                            {ALL_CURRENCIES.filter(cur => !TOP_CURRENCIES.includes(cur)).map((cur) => (
                              <CommandItem
                                key={cur}
                                value={cur}
                                onSelect={() => { setCurrency(cur); setOpen(false); }}
                              >
                                {cur}
                                <Check className={cn("ml-auto", currency === cur ? "opacity-100" : "opacity-0")} />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button type="submit" className="w-full sm:w-auto">Add</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40} stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No transactions yet.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.date}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className="text-right">{formatCurrency(t.amount)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
