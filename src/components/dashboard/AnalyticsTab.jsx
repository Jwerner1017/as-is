import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Package, DollarSign, TrendingUp, TrendingDown, ShoppingCart, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import moment from 'moment';

export default function AnalyticsTab({ listings, orders }) {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Build last-30-day revenue series from orders
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = moment().subtract(i, 'days');
      days.push({ date: d.format('MMM D'), key: d.format('YYYY-MM-DD'), revenue: 0, sales: 0 });
    }
    const dayMap = {};
    days.forEach(d => { dayMap[d.key] = d; });

    orders.forEach(order => {
      if (!order.created_date) return;
      const key = moment(order.created_date).format('YYYY-MM-DD');
      if (dayMap[key]) {
        dayMap[key].revenue += order.seller_payout || 0;
        dayMap[key].sales += 1;
      }
    });

    setChartData(days);
    setLoading(false);
  }, [orders]);

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');
  const totalRevenue = orders.reduce((sum, o) => sum + (o.seller_payout || 0), 0);
  const totalSales = orders.length;

  // This month vs last month revenue
  const now = moment();
  const thisMonthStart = now.clone().startOf('month');
  const lastMonthStart = now.clone().subtract(1, 'month').startOf('month');
  const lastMonthEnd = now.clone().subtract(1, 'month').endOf('month');

  let thisMonthRevenue = 0;
  let lastMonthRevenue = 0;
  orders.forEach(order => {
    if (!order.created_date) return;
    const d = moment(order.created_date);
    if (d.isSameOrAfter(thisMonthStart)) thisMonthRevenue += order.seller_payout || 0;
    if (d.isSameOrAfter(lastMonthStart) && d.isSameOrBefore(lastMonthEnd)) lastMonthRevenue += order.seller_payout || 0;
  });

  const growthPct = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
    : thisMonthRevenue > 0 ? 100 : 0;
  const isGrowth = growthPct >= 0;

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-lg" />)}
        </div>
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            <span className="text-[10px] uppercase text-muted-foreground">All Time</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalSales}</p>
          <p className="text-xs text-muted-foreground">Total Sales</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <span className="text-[10px] uppercase text-muted-foreground">All Time</span>
          </div>
          <p className="text-2xl font-bold text-green-500">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Total Revenue</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] uppercase text-muted-foreground">Now</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{activeListings.length}</p>
          <p className="text-xs text-muted-foreground">Active Listings</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            {isGrowth ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
            <span className="text-[10px] uppercase text-muted-foreground">vs Last Month</span>
          </div>
          <p className={`text-2xl font-bold ${isGrowth ? 'text-green-500' : 'text-red-500'}`}>
            {isGrowth ? '+' : ''}{growthPct.toFixed(1)}%
          </p>
          <p className="text-xs text-muted-foreground">Revenue Growth</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="font-display text-lg text-foreground">REVENUE — LAST 30 DAYS</h3>
        </div>
        {chartData.every(d => d.revenue === 0) ? (
          <div className="text-center py-16 text-muted-foreground">
            <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="font-display text-lg">NO REVENUE YET</p>
            <p className="text-sm mt-1">Sell some items and the chart will populate.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} interval={4} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#revGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Month comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] uppercase text-muted-foreground mb-1">{now.format('MMMM')} (So Far)</p>
          <p className="text-xl font-bold text-green-500">${thisMonthRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-[10px] uppercase text-muted-foreground mb-1">{moment().subtract(1, 'month').format('MMMM')}</p>
          <p className="text-xl font-bold text-foreground">${lastMonthRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}