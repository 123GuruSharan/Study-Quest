"use client";

import React, { useState, useEffect } from "react";
import {
  Coins,
  Plus,
  Trash2,
  Gift,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Star,
  Sparkles,
  TrendingUp,
  Clock,
  Edit3,
  History,
  Info,
  Calendar,
  X,
  Bookmark
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/userStore";
import { useMounted } from "@/hooks/use-mounted";
import { rewardEngine } from "@/game/systems/rewardEngine";
import { RewardItem } from "@/config/rewards";

// Categories and matching icons
const CATEGORIES = [
  { name: "Entertainment", icon: "🎬" },
  { name: "Food", icon: "🍕" },
  { name: "Gaming", icon: "🎮" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Fitness", icon: "🏃" },
  { name: "Social", icon: "🗣️" },
  { name: "Break", icon: "🧘" },
  { name: "Learning", icon: "📚" },
  { name: "Custom", icon: "🎁" },
] as const;

export function CustomShop() {
  const mounted = useMounted();
  const {
    customShopItems,
    addCustomReward,
    purchaseCustomReward,
    deleteCustomReward,
    toggleWishlistReward,
    editCustomReward,
    user,
    journeyLog
  } = useUserStore();

  const coins = user?.coins ?? 0;

  // Active View Tabs
  const [activeTab, setActiveTab] = useState<"shop" | "history">("shop");

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]["name"]>("Custom");
  const [cooldownHours, setCooldownHours] = useState("");
  const [icon, setIcon] = useState("🎁");
  const [formError, setFormError] = useState("");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [filterAffordable, setFilterAffordable] = useState(false);
  const [filterCooldownReady, setFilterCooldownReady] = useState(false);

  // Redeem Confirmation Overlay
  const [confirmReward, setConfirmReward] = useState<RewardItem | null>(null);

  // Confetti Particle state
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; size: number }[]>([]);

  // Ticking effect to force-update cooldown countdowns every 30 seconds
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-text-secondary select-none">
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin mb-2" />
        <span className="text-xs">Loading Reward Shop...</span>
      </div>
    );
  }

  // Trigger Particle Confetti
  const triggerConfetti = () => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#a855f7", "#ec4899"];
    const newParticles = Array.from({ length: 50 }).map((_, idx) => ({
      id: Date.now() + idx,
      x: Math.random() * 100, // percentage
      y: Math.random() * 60 - 20, // offset
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 3000);
  };

  // Form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Reward title is required.");
      return;
    }
    const costNum = parseInt(cost);
    if (isNaN(costNum) || costNum <= 0) {
      setFormError("Please enter a valid cost greater than 0.");
      return;
    }
    const cooldownNum = cooldownHours.trim() ? parseFloat(cooldownHours) : 0;
    if (isNaN(cooldownNum) || cooldownNum < 0) {
      setFormError("Cooldown must be a positive number.");
      return;
    }

    if (editingId) {
      await editCustomReward(editingId, name, description, costNum, category, cooldownNum, icon);
    } else {
      await addCustomReward(name, description, costNum, category, cooldownNum, icon);
    }

    // Reset Form
    setName("");
    setDescription("");
    setCost("");
    setCategory("Custom");
    setCooldownHours("");
    setIcon("🎁");
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Edit reward click
  const startEdit = (item: RewardItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description);
    setCost(item.cost.toString());
    setCategory(item.category || "Custom");
    setCooldownHours(item.cooldownHours ? item.cooldownHours.toString() : "");
    setIcon(item.icon || "🎁");
    setIsFormOpen(true);
  };

  // Redeem action
  const handleRedeem = async () => {
    if (!confirmReward) return;
    const success = await purchaseCustomReward(confirmReward.id);
    if (success) {
      triggerConfetti();
    }
    setConfirmReward(null);
  };

  // Parse Redemptions from Journey Logs
  const purchaseLogs = journeyLog
    .filter((entry) => entry.category === "reward")
    .map((entry) => {
      try {
        const payload = JSON.parse(entry.description);
        return {
          id: entry.id,
          name: payload.name || "Unknown Reward",
          cost: payload.cost || 0,
          category: payload.category || "Custom",
          timestamp: entry.timestamp,
        };
      } catch {
        return {
          id: entry.id,
          name: entry.title,
          cost: 0,
          category: "Custom",
          timestamp: entry.timestamp,
        };
      }
    });

  // Analytics values
  const analytics = rewardEngine.getShopAnalytics(journeyLog, coins, customShopItems);

  // Filter rewards list
  const filteredRewards = customShopItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAffordable = !filterAffordable || coins >= item.cost;
    
    const cooldown = rewardEngine.getCooldownRemaining(item);
    const matchesCooldown = !filterCooldownReady || !cooldown.active;

    return matchesSearch && matchesCategory && matchesAffordable && matchesCooldown;
  });

  return (
    <div className="relative space-y-6 w-full select-none">
      {/* Particle Overlay */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute z-50 rounded-full animate-ping pointer-events-none transition-all duration-[3000ms] opacity-80"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}

      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-theme/40 pb-5">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-text-primary flex items-center gap-2">
            <Gift size={20} className="text-accent" />
            Reward Shop & Economy
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Turn your gold coins into real-life incentives. Set cooldowns and custom targets.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setName("");
              setDescription("");
              setCost("");
              setCategory("Custom");
              setCooldownHours("");
              setIcon("🎁");
              setEditingId(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="h-9 text-xs gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Create Incentive</span>
          </Button>

          {/* Shop/History Tab Toggle */}
          <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-border-theme">
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "bg-card text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                activeTab === "history"
                  ? "bg-card text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Logs
            </button>
          </div>
        </div>
      </div>

      {activeTab === "shop" ? (
        <div className="space-y-6">
          {/* Shop Analytics Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-border-theme flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Current Balance</span>
              <div className="flex items-center gap-1 mt-1">
                <Coins size={14} className="text-amber-500 fill-current" />
                <span className="text-sm font-black text-text-primary font-mono">{coins.toLocaleString()}</span>
              </div>
            </Card>

            <Card className="p-4 border-border-theme flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Lifetime Coins Spent</span>
              <div className="flex items-center gap-1 mt-1">
                <Coins size={14} className="text-text-secondary fill-current" />
                <span className="text-sm font-black text-text-primary font-mono">-{analytics.lifetimeCoinsSpent}</span>
              </div>
            </Card>

            <Card className="p-4 border-border-theme flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Savings Rate</span>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp size={14} className="text-accent" />
                <span className="text-sm font-black text-text-primary font-mono">{analytics.savingsRate}%</span>
              </div>
            </Card>

            <Card className="p-4 border-border-theme flex flex-col justify-between h-20 shadow-sm">
              <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary">Claimed Rewards</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Gift size={14} className="text-emerald-500" />
                <span className="text-sm font-black text-text-primary font-mono">{analytics.purchasesCount}</span>
              </div>
            </Card>
          </div>

          {/* Form Overlay Card */}
          {isFormOpen && (
            <Card className="p-5 border-dashed border-accent/40 bg-slate-50/50 dark:bg-slate-900/10 max-w-lg mx-auto animate-[fadeIn_200ms_ease]">
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                    <Gift size={13} />
                    {editingId ? "Modify Incentive Item" : "Formulate Incentive Reward"}
                  </h4>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="text-text-secondary hover:text-text-primary">
                    <X size={14} />
                  </button>
                </div>

                {formError && (
                  <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-500 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Reward Title *
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Treat Cheat Meal Pizza"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setCategory(val);
                        const matched = CATEGORIES.find((c) => c.name === val);
                        if (matched) setIcon(matched.icon);
                      }}
                      className="h-10 w-full rounded-md border border-border-theme bg-card px-3 text-xs focus-visible:outline-hidden"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                    Description / Conditions
                  </label>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Claimable only after defeating weekly boss target"
                    className="h-10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Coin Cost *
                    </label>
                    <Input
                      type="number"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      placeholder="e.g. 250"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Cooldown (Hours)
                    </label>
                    <Input
                      type="number"
                      step="0.5"
                      value={cooldownHours}
                      onChange={(e) => setCooldownHours(e.target.value)}
                      placeholder="e.g. 24"
                      className="h-10 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-1">
                      Select Custom Emoji
                    </label>
                    <Input
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      placeholder="🎁"
                      maxLength={4}
                      className="h-10 text-xs text-center"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="w-full h-10 text-xs rounded-lg cursor-pointer"
                >
                  {editingId ? "Commit Reward Changes" : "Authorise Incentive Item"}
                </Button>
              </form>
            </Card>
          )}

          {/* Search, Category Filter Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/30 border border-border-theme rounded-xl">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-3 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search incentives..."
                  className="w-full h-10 pl-9 pr-4 rounded-lg border border-border-theme bg-card text-xs focus:outline-hidden"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-10 px-3 rounded-lg border border-border-theme bg-card text-xs focus:outline-hidden min-w-[130px]"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-text-secondary self-start md:self-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAffordable}
                  onChange={(e) => setFilterAffordable(e.target.checked)}
                  className="rounded border-border-theme focus:ring-0"
                />
                <span>Affordable Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterCooldownReady}
                  onChange={(e) => setFilterCooldownReady(e.target.checked)}
                  className="rounded border-border-theme focus:ring-0"
                />
                <span>Cooldown Ready</span>
              </label>
            </div>
          </div>

          {/* Main Grid View */}
          {filteredRewards.length === 0 ? (
            <div className="text-center p-12 border border-dashed border-border-theme rounded-xl">
              <Gift size={28} className="text-text-secondary mx-auto mb-2 opacity-50" />
              <p className="text-xs font-bold text-text-primary">No incentive items matches filters</p>
              <p className="text-[10px] text-text-secondary mt-0.5">
                Create new custom rewards or adjust your filters above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((item) => {
                const cooldown = rewardEngine.getCooldownRemaining(item);
                const canAfford = coins >= item.cost;
                const buyState = rewardEngine.canPurchase(item, coins);

                return (
                  <Card
                    key={item.id}
                    className="flex flex-col justify-between p-5 h-full hover:border-accent/30 transition-all shadow-xs group min-h-[190px] relative overflow-hidden"
                  >
                    {/* Cooldown Overlay */}
                    {cooldown.active && (
                      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 z-10 transition-all select-none animate-[fadeIn_150ms_ease]">
                        <Clock size={20} className="text-white animate-spin mb-1.5 duration-1000" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Locked on Cooldown</span>
                        <span className="text-[9px] font-bold text-white/80 mt-0.5">{cooldown.formatted} remaining</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Top Icons & Badges */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl" role="img" aria-label={item.category}>
                            {item.icon || "🎁"}
                          </span>
                          <div>
                            <span className="text-[8px] font-bold uppercase tracking-wider text-text-secondary block">
                              {item.category || "Custom"}
                            </span>
                            <h4 className="text-xs font-bold text-text-primary leading-snug">
                              {item.name}
                            </h4>
                          </div>
                        </div>

                        {/* Card Controls */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleWishlistReward(item.id)}
                            className={`p-1 rounded-md transition-all cursor-pointer ${
                              item.wishlist
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-text-secondary hover:text-amber-500"
                            }`}
                            title="Add to Wishlist"
                          >
                            <Star size={12} className={item.wishlist ? "fill-current" : ""} />
                          </button>

                          <button
                            onClick={() => startEdit(item)}
                            className="p-1 rounded-md text-text-secondary hover:text-accent cursor-pointer"
                            title="Edit reward details"
                          >
                            <Edit3 size={12} />
                          </button>

                          <button
                            onClick={() => deleteCustomReward(item.id)}
                            className="p-1 rounded-md text-text-secondary hover:text-danger cursor-pointer"
                            title="Delete reward"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <p className="text-[10px] text-text-secondary leading-relaxed min-h-[34px]">
                        {item.description || "No specific conditions defined."}
                      </p>
                    </div>

                    {/* Bottom Pricing & Redeem Buttons */}
                    <div className="mt-4 pt-3.5 border-t border-border-theme flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-500 font-mono">
                          <Coins size={12} className="fill-current" />
                          <span>{item.cost.toLocaleString()}</span>
                        </div>
                        {item.timesClaimed && item.timesClaimed > 0 ? (
                          <span className="text-[8px] font-bold text-text-secondary uppercase">
                            Claimed {item.timesClaimed}x
                          </span>
                        ) : null}
                      </div>

                      <Button
                        variant={buyState.eligible ? "primary" : "secondary"}
                        size="sm"
                        disabled={!buyState.eligible}
                        onClick={() => setConfirmReward(item)}
                        className="h-8 text-[10px] font-bold px-4 rounded-lg cursor-pointer"
                      >
                        {buyState.eligible ? (
                          "Redeem"
                        ) : (
                          <span className="text-[9px] font-bold text-text-secondary">
                            {buyState.reason}
                          </span>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Purchase Logs Tab */
        <Card className="p-5 border-border-theme space-y-4 shadow-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
              <History size={14} className="text-accent" />
              Claimed Rewards Log
            </h3>
            <p className="text-[10px] text-text-secondary mt-0.5">
              History logs of all completed redemptions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border-theme/40 pb-4 text-xs font-bold text-text-secondary">
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40">
              <span>Avg Redeemed Cost:</span>
              <span className="text-text-primary font-mono">{analytics.averageSpending} Coins</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40">
              <span>Most Expensive:</span>
              <span className="text-text-primary font-mono">{analytics.mostExpensivePurchase} Coins</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900/30 border border-border-theme/40">
              <span>Claimed Today:</span>
              <span className="text-text-primary font-mono">{analytics.purchasedToday}</span>
            </div>
          </div>

          {purchaseLogs.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border-theme rounded-xl text-xs text-text-secondary">
              No rewards claimed yet. Get studying to earn coins!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
              {purchaseLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-border-theme/45 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50/40 dark:hover:bg-slate-900/20 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {CATEGORIES.find((c) => c.name === log.category)?.icon || "🎁"}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-text-primary">
                        {log.name}
                      </h5>
                      <span className="text-[8px] font-bold text-text-secondary uppercase">
                        {log.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 font-mono">
                      <Coins size={12} className="fill-current" />
                      <span>{log.cost}</span>
                    </div>
                    <span className="text-[8px] text-text-secondary font-semibold">
                      {new Date(log.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Confirmation Dialog Modal overlay */}
      {confirmReward && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-[fadeIn_150ms_ease]">
          <Card className="p-5 max-w-sm w-full border-border-theme space-y-4 shadow-2xl relative">
            <div className="text-center space-y-2.5">
              <span className="text-4xl block animate-bounce" role="img" aria-label="Confirm">
                {confirmReward.icon || "🎁"}
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
                Redeem Reward Item?
              </h3>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Confirm spending <strong className="text-amber-500 font-mono">{confirmReward.cost} coins</strong> to unlock your reward:
                <br />
                <span className="text-text-primary font-bold">"{confirmReward.name}"</span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmReward(null)}
                className="flex-1 h-9 text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleRedeem}
                className="flex-1 h-9 text-xs rounded-lg cursor-pointer gap-1"
              >
                <CheckCircle2 size={13} />
                Confirm
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
