"use client"

 
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import { Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts"

type Transaction = {
  id: string
  amount: number
  category: "Food" | "Transport" | "Bills" | "Other"
  date: string
}

const STORAGE_KEY = "coinkeeper:transactions"
const CATEGORIES: Array<Transaction["category"]> = ["Food", "Transport", "Bills", "Other"]
const COLORS = ["#6366f1", "#22c55e", "#f97316", "#e11d48"]

export default function Home() {
  const [amount, setAmount] = useState<string>("")
  const [category, setCategory] = useState<Transaction["category"]>("Food")
  const [date, setDate] = useState<string>("")
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTransactions(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch {}
  }, [transactions])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
  
    const parsed = parseFloat(amount);
    if (!isFinite(parsed) || parsed <= 0 || !date) return;
  
    // Generate the UUID here, inside the event handler — runs only on client
    const id = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2); // fallback if crypto isn't available
  
    const tx: Transaction = {
      id,
      amount: Number(parsed.toFixed(2)),
      category,
      date,
    };
  
    setTransactions((prev) => [tx, ...prev]);
    setAmount("");
    setDate("");
  }

  function handleDelete(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const chartData = useMemo(() => {
    const totals: Record<string, number> = { Food: 0, Transport: 0, Bills: 0, Other: 0 }
    for (const t of transactions) totals[t.category] += t.amount
    return CATEGORIES.map((c) => ({ name: c, value: totals[c] }))
  }, [transactions])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm">Amount</label>
                <Input type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
              </div>
              <div>
                <label className="mb-1 block text-sm">Category</label>
                <Select value={category} onValueChange={(v) => setCategory(v as Transaction["category"]) }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm">Date</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full sm:w-auto">Add</Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
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
                    <TableCell colSpan={4} className="text-center text-muted-foreground">No transactions yet.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className="text-right">${t.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => handleDelete(t.id)}>
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

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} innerRadius={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
