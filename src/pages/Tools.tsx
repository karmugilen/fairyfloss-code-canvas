import { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Clock, Activity, DollarSign, Calculator, Trash2, Calendar, Plus, CheckCircle2, ListTodo, Wifi, Zap, Check, Pencil, Tag, Flag, X, Save, Brain, RotateCcw, ChevronRight, ChevronLeft, Eye, EyeOff, Layers, Play, Pause, Timer, Settings, Newspaper, ExternalLink, RefreshCw, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationData {
    ip: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
    postal?: string;
}

const Tools = () => {
    const [activeTab, setActiveTab] = useState('location');

    // Preload HN data on page load (before user clicks HN tab)
    useEffect(() => {
        const preloadHN = async () => {
            try {
                // Check if cache is recent (less than 5 minutes old)
                const cached = localStorage.getItem('hn-cache');
                if (cached) {
                    const { timestamp } = JSON.parse(cached);
                    if (Date.now() - timestamp < 5 * 60 * 1000) return; // Skip if cache is fresh
                }
                
                // Preload in background - stories from last 24h with good scores
                const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
                const response = await fetch(
                    `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${oneDayAgo},points>10&hitsPerPage=100`
                );
                if (!response.ok) return;
                const data = await response.json();
                
                const stories = data.hits.map((hit: {
                    objectID: string;
                    title: string;
                    url?: string;
                    author: string;
                    points: number;
                    created_at_i: number;
                    num_comments: number;
                }) => ({
                    id: parseInt(hit.objectID),
                    title: hit.title,
                    url: hit.url,
                    by: hit.author,
                    score: hit.points,
                    time: hit.created_at_i,
                    descendants: hit.num_comments
                }));

                // Sort by score (API already filters for last 24h)
                const sortedStories = stories
                    .filter((s: { score: number }) => s && s.score)
                    .sort((a: { score: number }, b: { score: number }) => b.score - a.score);

                localStorage.setItem('hn-cache', JSON.stringify({
                    stories: sortedStories.length > 0 ? sortedStories : stories,
                    timestamp: Date.now()
                }));
            } catch {
                // Silent fail for preload
            }
        };
        preloadHN();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-mono">
            {/* Header/Navigation */}
            <header className="p-6">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="text-white opacity-70 animate-pulse-slow">
                        <span className="text-2xl">✧</span>
                    </div>
                    <nav>
                        <a
                            href="/"
                            className="text-white/80 hover:text-primary transition-colors nav-link"
                        >
                            ← back
                        </a>
                    </nav>
                </div>
            </header>

            <div className="content-container py-12">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <div className="code-block mb-6">
                        <div className="text-white/60">
                            class <span className="text-primary">DeveloperTools</span> {'{'}
                        </div>
                        <div className="pl-8 py-4">
                            <div className="text-fairy-yellow">
                                // Utilities for everyday tasks
                            </div>
                        </div>
                        <div className="text-white/60">{'}'}</div>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-6 glass-panel p-1 rounded-lg mb-8">
                        <TabsTrigger
                            value="location"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Globe className="w-4 h-4 mr-1" />
                            IP
                        </TabsTrigger>
                        <TabsTrigger
                            value="calculator"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Calculator className="w-4 h-4 mr-1" />
                            Cost
                        </TabsTrigger>
                        <TabsTrigger
                            value="time"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Timer className="w-4 h-4 mr-1" />
                            Time
                        </TabsTrigger>
                        <TabsTrigger
                            value="todo"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <ListTodo className="w-4 h-4 mr-1" />
                            Todo
                        </TabsTrigger>
                        <TabsTrigger
                            value="memory"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Brain className="w-4 h-4 mr-1" />
                            Memory
                        </TabsTrigger>
                        <TabsTrigger
                            value="hackernews"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Newspaper className="w-4 h-4 mr-1" />
                            HN
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="location">
                        <IPLocationTool />
                    </TabsContent>

                    <TabsContent value="calculator">
                        <CostCalculator />
                    </TabsContent>

                    <TabsContent value="time">
                        <TimeCalculator />
                    </TabsContent>

                    <TabsContent value="todo">
                        <TodoList />
                    </TabsContent>

                    <TabsContent value="memory">
                        <CardMemorizer />
                    </TabsContent>

                    <TabsContent value="hackernews">
                        <HackerNews />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

// IP & Location Tool Component
const IPLocationTool = () => {
    const [locationData, setLocationData] = useState<LocationData | null>(null);
    const [localIp, setLocalIp] = useState<string>('Detecting...');
    const [ping, setPing] = useState<number | null>(null);
    const [os, setOs] = useState<string>('Detecting...');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) throw new Error('Failed to fetch location data');
                const data = await response.json();
                setLocationData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        const getLocalIP = async () => {
            try {
                const rtc = new RTCPeerConnection({ iceServers: [] });
                rtc.createDataChannel('');
                rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
                rtc.onicecandidate = (ice) => {
                    if (ice && ice.candidate && ice.candidate.candidate) {
                        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
                        const match = ice.candidate.candidate.match(ipRegex);
                        if (match) setLocalIp(match[1]);
                        rtc.close();
                    }
                };
            } catch (e) {
                setLocalIp('Unavailable');
            }
        };

        const measurePing = async () => {
            const start = Date.now();
            try {
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-store' });
                setPing(Date.now() - start);
            } catch (e) {
                setPing(null);
            }
        };

        const detectOS = () => {
            const userAgent = window.navigator.userAgent;
            let osName = "Unknown OS";

            if (userAgent.indexOf("Win") !== -1) osName = "Windows";
            if (userAgent.indexOf("Mac") !== -1) osName = "macOS";
            if (userAgent.indexOf("X11") !== -1) osName = "UNIX";
            if (userAgent.indexOf("Linux") !== -1) osName = "Linux";
            if (userAgent.indexOf("Android") !== -1) osName = "Android";
            if (userAgent.indexOf("like Mac") !== -1) osName = "iOS";

            setOs(osName);
        };

        fetchLocationData();
        getLocalIP();
        measurePing();
        detectOS();

        const interval = setInterval(measurePing, 2000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-panel rounded-xl p-8 border-destructive/50">
                <p className="text-destructive text-center font-mono">{error}</p>
            </div>
        );
    }

    if (!locationData) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Main Network Card */}
            <div className="glass-panel rounded-2xl p-8 border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-32 h-32 text-primary" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Globe className="w-5 h-5 text-primary" />
                        <h3 className="text-white/60 text-xs font-mono tracking-wider">GLOBAL_IP</h3>
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-mono tracking-tight break-all">{locationData.ip}</p>
                    <p className="text-primary/60 text-xs sm:text-sm mt-2 font-mono break-words">{locationData.org}</p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className={`w-2 h-2 rounded-full ${ping && ping < 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <p className="text-white/40 text-xs font-mono">
                            Connection Status: <span className="text-white/80">Active</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Network Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel rounded-xl p-5 hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-fairy-blue/10 rounded-lg">
                                <Zap className="w-5 h-5 text-fairy-blue" />
                            </div>
                            <span className="text-xs font-mono text-white/40">PING</span>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white font-mono">{ping ? `${ping}ms` : '--'}</p>
                            <p className="text-xs text-white/40 font-mono mt-1">Latency</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-5 hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-fairy-purple/10 rounded-lg">
                                <MapPin className="w-5 h-5 text-fairy-purple" />
                            </div>
                            <span className="text-xs font-mono text-white/40">REGION</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white font-mono truncate" title={locationData.city}>{locationData.city}</p>
                            <p className="text-xs text-white/40 font-mono mt-1 truncate">{locationData.region}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-5 hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-fairy-teal/10 rounded-lg">
                                <Globe className="w-5 h-5 text-fairy-teal" />
                            </div>
                            <span className="text-xs font-mono text-white/40">COUNTRY</span>
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white font-mono">{locationData.country}</p>
                            <p className="text-xs text-white/40 font-mono mt-1">{locationData.postal || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-xl p-5 hover:bg-white/5 transition-all duration-300">
                    <div className="flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-fairy-light-purple/10 rounded-lg">
                                <Clock className="w-5 h-5 text-fairy-light-purple" />
                            </div>
                            <span className="text-xs font-mono text-white/40">TIMEZONE</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white font-mono truncate" title={locationData.timezone}>{locationData.timezone}</p>
                            <p className="text-xs text-white/40 font-mono mt-1">Local Time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Technical Details */}
            <div className="glass-panel rounded-xl p-6 border-white/5">
                <h3 className="text-white/60 text-xs font-mono mb-4 uppercase tracking-wider">Technical Details</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/40 text-sm font-mono">ISP Organization</span>
                            <span className="text-white/80 text-sm font-mono truncate max-w-[200px]">{locationData.org}</span>
                        </div>

                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/40 text-sm font-mono">Operating System</span>
                            <span className="text-white/80 text-sm font-mono">{os}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// Investment Calculator Component
const InvestmentCalculator = ({ suggestedAmount }: { suggestedAmount?: number }) => {
    const [yearlyInvestment, setYearlyInvestment] = useState<string>('50000');
    const [interestRate, setInterestRate] = useState<string>('14');

    // Auto-update when suggested amount changes
    useEffect(() => {
        if (suggestedAmount && suggestedAmount > 0) {
            setYearlyInvestment(Math.round(suggestedAmount).toString());
        }
    }, [suggestedAmount]);

    const calculateCompoundInterest = (principal: number, rate: number, years: number) => {
        // For recurring yearly investments, we need to calculate the future value of an annuity
        // FV = P × [((1 + r)^n - 1) / r]
        const r = rate / 100;
        const amount = principal * (((Math.pow(1 + r, years) - 1) / r) * (1 + r));
        const invested = principal * years;
        const returns = amount - invested;

        return {
            amount: Math.round(amount),
            invested: Math.round(invested),
            returns: Math.round(returns)
        };
    };

    const numInvestment = parseFloat(yearlyInvestment) || 0;
    const numRate = parseFloat(interestRate) || 0;

    const year1 = calculateCompoundInterest(numInvestment, numRate, 1);
    const year5 = calculateCompoundInterest(numInvestment, numRate, 5);
    const year10 = calculateCompoundInterest(numInvestment, numRate, 10);

    return (
        <div className="glass-panel rounded-xl p-8 mt-8 border-t-2 border-primary/20">
            <div className="code-block mb-6">
                <div className="text-white/60">
                    function <span className="text-fairy-teal">calculateInvestment</span>(amount, rate) {'{'}
                </div>
                <div className="pl-8 py-2">
                    <div className="text-fairy-yellow">
                        // Compound interest with yearly investments
                    </div>
                    <div className="text-white/60">
                        return {'{'}futureValue{'}'}
                    </div>
                </div>
                <div className="text-white/60">{'}'}</div>
            </div>

            <h3 className="text-fairy-teal font-mono font-bold mb-6 text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                INVESTMENT_CALCULATOR
            </h3>

            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="text-white/80 text-xs font-mono mb-2 block">
                        YEARLY_INVESTMENT_₹ {suggestedAmount && suggestedAmount > 0 && <span className="text-fairy-yellow text-[10px]">(Auto from Cost Calc)</span>}
                    </label>
                    <input
                        type="number"
                        value={yearlyInvestment}
                        onChange={(e) => setYearlyInvestment(e.target.value)}
                        placeholder="50000"
                        className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                    />
                </div>

                <div>
                    <label className="text-white/80 text-xs font-mono mb-2 block">
                        INTEREST_RATE_%
                    </label>
                    <input
                        type="number"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="14"
                        step="0.1"
                        className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                    />
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {/* 1 Year */}
                <div className="glass-panel rounded-xl p-6 border-fairy-purple/50 hover:bg-white/5 transition-all">
                    <h4 className="text-fairy-purple font-mono font-bold mb-4 text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        1_YEAR
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Total Value</p>
                            <p className="text-3xl text-white font-mono font-bold">₹{year1.amount.toLocaleString()}</p>
                        </div>
                        <div className="pt-3 border-t border-white/10">
                            <p className="text-white/60 text-xs font-mono mb-1">Invested</p>
                            <p className="text-sm text-white/80 font-mono">₹{year1.invested.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Returns</p>
                            <p className="text-lg text-fairy-teal font-mono font-bold">+₹{year1.returns.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* 5 Years */}
                <div className="glass-panel rounded-xl p-6 border-fairy-teal/50 hover:bg-white/5 transition-all">
                    <h4 className="text-fairy-teal font-mono font-bold mb-4 text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        5_YEARS
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Total Value</p>
                            <p className="text-3xl text-white font-mono font-bold">₹{year5.amount.toLocaleString()}</p>
                        </div>
                        <div className="pt-3 border-t border-white/10">
                            <p className="text-white/60 text-xs font-mono mb-1">Invested</p>
                            <p className="text-sm text-white/80 font-mono">₹{year5.invested.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Returns</p>
                            <p className="text-lg text-fairy-teal font-mono font-bold">+₹{year5.returns.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* 10 Years */}
                <div className="glass-panel rounded-xl p-6 border-primary/50 hover:bg-white/5 transition-all ring-2 ring-primary/20">
                    <h4 className="text-primary font-mono font-bold mb-4 text-lg flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        10_YEARS ⭐
                    </h4>
                    <div className="space-y-3">
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Total Value</p>
                            <p className="text-3xl text-white font-mono font-bold">₹{year10.amount.toLocaleString()}</p>
                        </div>
                        <div className="pt-3 border-t border-white/10">
                            <p className="text-white/60 text-xs font-mono mb-1">Invested</p>
                            <p className="text-sm text-white/80 font-mono">₹{year10.invested.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-white/60 text-xs font-mono mb-1">Returns</p>
                            <p className="text-lg text-primary font-mono font-bold">+₹{year10.returns.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Note */}
            <div className="mt-6 glass-panel rounded-xl p-4 border-fairy-yellow/30">
                <p className="text-fairy-yellow text-xs font-mono leading-relaxed">
                    <span className="text-white/80">// NOTE:</span> This calculator uses compound interest with yearly recurring investments.
                    <br />Returns are calculated using the future value of an annuity formula: FV = P × [((1 + r)^n - 1) / r] × (1 + r)
                </p>
            </div>
        </div>
    );
};

// Enhanced Cost Calculator Component
const CostCalculator = () => {
    const [days, setDays] = useState<string>('30');
    const [price, setPrice] = useState<string>('200');
    const [compareMode, setCompareMode] = useState(false);
    const [days2, setDays2] = useState<string>('90');
    const [price2, setPrice2] = useState<string>('500');

    const calculateRates = (d: string, p: string) => {
        const numDays = parseFloat(d) || 0;
        const numPrice = parseFloat(p) || 0;

        if (numDays === 0 || numPrice === 0) {
            return {
                perHour: 0,
                perDay: 0,
                perWeek: 0,
                perMonth: 0,
                perYear: 0
            };
        }

        const perDay = numPrice / numDays;
        const perHour = perDay / 24;
        const perWeek = perDay * 7;
        const perMonth = perDay * 30;
        const perYear = perDay * 365;

        return { perHour, perDay, perWeek, perMonth, perYear };
    };

    const rates1 = calculateRates(days, price);
    const rates2 = calculateRates(days2, price2);
    const savings = rates1.perDay - rates2.perDay;

    // Use the primary plan's per year value for investment calculator
    const yearlyAmount = rates1.perYear;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        function <span className="text-primary">calculateCost</span>(days, price) {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Time/Money balance calculator
                        </div>
                        <div className="text-white/60">
                            return {'{'}breakdown{'}'}
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Compare Mode Toggle */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={() => setCompareMode(!compareMode)}
                        className="glass-panel px-4 py-2 rounded-lg hover:bg-white/10 transition-all text-sm font-mono text-primary"
                    >
                        {compareMode ? '✓ Compare Mode' : 'Enable Compare Mode'}
                    </button>
                </div>

                {/* Input Fields */}
                <div className={`grid ${compareMode ? 'md:grid-cols-4' : 'md:grid-cols-2'} gap-4 mb-8`}>
                    <div>
                        <label className="text-white/80 text-xs font-mono mb-2 block">
                            {compareMode ? 'PLAN_A_DAYS' : 'NUMBER_OF_DAYS'}
                        </label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(e.target.value)}
                            placeholder="30"
                            className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                        />
                    </div>

                    <div>
                        <label className="text-white/80 text-xs font-mono mb-2 block">
                            {compareMode ? 'PLAN_A_PRICE_₹' : 'TOTAL_PRICE_₹'}
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="200"
                            className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                        />
                    </div>

                    {compareMode && (
                        <>
                            <div>
                                <label className="text-white/80 text-xs font-mono mb-2 block">PLAN_B_DAYS</label>
                                <input
                                    type="number"
                                    value={days2}
                                    onChange={(e) => setDays2(e.target.value)}
                                    placeholder="90"
                                    className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-xs font-mono mb-2 block">PLAN_B_PRICE_₹</label>
                                <input
                                    type="number"
                                    value={price2}
                                    onChange={(e) => setPrice2(e.target.value)}
                                    placeholder="500"
                                    className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Results */}
                {!compareMode ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="glass-panel rounded-xl p-6 border-primary/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">PER_HOUR</h3>
                            <p className="text-3xl font-bold text-primary font-mono">₹{rates1.perHour.toFixed(2)}</p>
                        </div>

                        <div className="glass-panel rounded-xl p-6 border-fairy-blue/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">PER_DAY</h3>
                            <p className="text-3xl font-bold text-fairy-blue font-mono">₹{rates1.perDay.toFixed(2)}</p>
                        </div>

                        <div className="glass-panel rounded-xl p-6 border-fairy-teal/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">PER_WEEK</h3>
                            <p className="text-3xl font-bold text-fairy-teal font-mono">₹{rates1.perWeek.toFixed(2)}</p>
                        </div>

                        <div className="glass-panel rounded-xl p-6 border-fairy-purple/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">PER_MONTH</h3>
                            <p className="text-3xl font-bold text-fairy-purple font-mono">₹{rates1.perMonth.toFixed(2)}</p>
                        </div>

                        <div className="glass-panel rounded-xl p-6 border-fairy-light-purple/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">PER_YEAR</h3>
                            <p className="text-3xl font-bold text-fairy-light-purple font-mono">₹{rates1.perYear.toFixed(2)}</p>
                        </div>

                        <div className="glass-panel rounded-xl p-6 border-fairy-yellow/30 hover:bg-white/10 transition-all">
                            <h3 className="text-white/60 text-xs font-mono mb-2">INPUT_SUMMARY</h3>
                            <p className="text-lg text-white font-mono font-semibold">{days} days</p>
                            <p className="text-lg text-primary font-mono font-semibold">₹{price} total</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Comparison Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Plan A */}
                            <div className="glass-panel rounded-xl p-6 border-primary/50">
                                <h3 className="text-primary font-mono font-bold mb-4 text-lg">PLAN_A</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Hour</p>
                                        <p className="text-xl text-white font-mono">₹{rates1.perHour.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Day</p>
                                        <p className="text-xl text-white font-mono">₹{rates1.perDay.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Month</p>
                                        <p className="text-xl text-white font-mono">₹{rates1.perMonth.toFixed(2)}</p>
                                    </div>
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-white/60 text-xs font-mono">Total</p>
                                        <p className="text-2xl text-primary font-mono font-bold">₹{price} / {days}d</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plan B */}
                            <div className="glass-panel rounded-xl p-6 border-fairy-teal/50">
                                <h3 className="text-fairy-teal font-mono font-bold mb-4 text-lg">PLAN_B</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Hour</p>
                                        <p className="text-xl text-white font-mono">₹{rates2.perHour.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Day</p>
                                        <p className="text-xl text-white font-mono">₹{rates2.perDay.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/60 text-xs font-mono">Per Month</p>
                                        <p className="text-xl text-white font-mono">₹{rates2.perMonth.toFixed(2)}</p>
                                    </div>
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-white/60 text-xs font-mono">Total</p>
                                        <p className="text-2xl text-fairy-teal font-mono font-bold">₹{price2} / {days2}d</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Savings Analysis */}
                        <div className="glass-panel rounded-xl p-6 border-fairy-yellow/50">
                            <h3 className="text-fairy-yellow font-mono font-bold mb-4">SAVINGS_ANALYSIS</h3>
                            <p className="text-white/80 font-mono text-sm">
                                {savings > 0 ? (
                                    <>Plan B saves <span className="text-fairy-teal font-bold">₹{savings.toFixed(2)}/day</span> compared to Plan A</>
                                ) : savings < 0 ? (
                                    <>Plan A saves <span className="text-primary font-bold">₹{Math.abs(savings).toFixed(2)}/day</span> compared to Plan B</>
                                ) : (
                                    <>Both plans cost the same per day</>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Investment Calculator Section */}
                <InvestmentCalculator suggestedAmount={yearlyAmount} />
            </div>
        </div>
    );
};


// Card Memorizer Tool
const CardMemorizer = () => {
    const [mode, setMode] = useState<'setup' | 'memorize' | 'recall'>('setup');
    const [deck, setDeck] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCard, setShowCard] = useState(false);

    // Settings
    const [selectedSuits, setSelectedSuits] = useState<string[]>(['♠', '♥', '♣', '♦']);
    const [includeJokers, setIncludeJokers] = useState(false);
    const [enableTimer, setEnableTimer] = useState(true);

    // Timer
    const [timer, setTimer] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const suits = [
        { symbol: '♠', name: 'Spades', color: 'text-white' },
        { symbol: '♥', name: 'Hearts', color: 'text-destructive' },
        { symbol: '♣', name: 'Clubs', color: 'text-white' },
        { symbol: '♦', name: 'Diamonds', color: 'text-destructive' }
    ];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleSuit = (symbol: string) => {
        if (selectedSuits.includes(symbol)) {
            setSelectedSuits(selectedSuits.filter(s => s !== symbol));
        } else {
            setSelectedSuits([...selectedSuits, symbol]);
        }
    };

    const generateDeck = () => {
        const newDeck: string[] = [];
        // Add standard cards
        for (const s of selectedSuits) {
            for (const v of values) {
                newDeck.push(`${v}${s}`);
            }
        }
        // Add Jokers
        if (includeJokers) {
            newDeck.push('JOKER 1');
            newDeck.push('JOKER 2');
        }
        return newDeck;
    };

    const shuffleDeck = () => {
        const newDeck = generateDeck();
        if (newDeck.length === 0) return;

        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        setDeck(newDeck);
        setCurrentIndex(0);
        setTimer(0);
        setIsTimerRunning(false);
    };

    const startMemorization = () => {
        if (deck.length === 0) shuffleDeck();
        setMode('memorize');
        setCurrentIndex(0);
        setTimer(0);
        if (enableTimer) setIsTimerRunning(true);
    };

    const startRecall = () => {
        setMode('recall');
        setCurrentIndex(0);
        setShowCard(false);
        // Reset timer for recall phase if desired, or keep running total
        // For now, let's restart it to track recall time separately
        setTimer(0);
        if (enableTimer) setIsTimerRunning(true);
    };

    const resetSession = () => {
        setIsTimerRunning(false);
        setTimer(0);
        setCurrentIndex(0);
        setShowCard(false);
        setDeck([]); // Clear deck to force regeneration on next start
        setMode('setup');
    };

    const nextStep = () => {
        if (currentIndex < deck.length - 1) {
            setCurrentIndex(currentIndex + 1);
            // In recall mode, subsequent cards are automatically revealed
            if (mode === 'recall') {
                setShowCard(true);
            } else {
                setShowCard(false);
            }
        } else {
            // End of deck
            setIsTimerRunning(false);
        }
    };

    const prevStep = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            // When going back, we probably want to show the card?
            // Or keep current state? Let's default to showing it in recall mode for ease
            if (mode === 'recall') {
                setShowCard(true);
            } else {
                setShowCard(false);
            }
        }
    };

    const handleCardClick = () => {
        if (mode === 'memorize') {
            nextStep();
        } else if (mode === 'recall') {
            if (!showCard) {
                setShowCard(true);
            } else {
                nextStep();
            }
        }
    };

    const getCardColor = (card: string) => {
        if (card.includes('JOKER')) return 'text-fairy-purple';
        return card.includes('♥') || card.includes('♦') ? 'text-destructive' : 'text-white';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">cardMemorizer</span> = {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Master the deck
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Header / Timer */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        {mode !== 'setup' && (
                            <button
                                onClick={resetSession}
                                className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
                            >
                                <RotateCcw className="w-4 h-4" /> RESET
                            </button>
                        )}
                    </div>

                    {enableTimer && mode !== 'setup' && (
                        <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-3">
                            <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-primary animate-pulse' : 'text-white/40'}`} />
                            <span className="font-mono text-xl font-bold text-white">{formatTime(timer)}</span>
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className="text-white/40 hover:text-white ml-2"
                            >
                                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            </button>
                        </div>
                    )}
                </div>

                {mode === 'setup' && (
                    <div className="space-y-8">
                        {/* Suit Selection */}
                        <div className="glass-panel rounded-xl p-6 border-white/5">
                            <h3 className="text-white/60 text-xs font-mono mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Suits
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {suits.map((suit) => (
                                    <button
                                        key={suit.symbol}
                                        onClick={() => toggleSuit(suit.symbol)}
                                        className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 ${selectedSuits.includes(suit.symbol)
                                            ? 'bg-primary/10 border-primary/50 text-white'
                                            : 'bg-white/5 border-transparent text-white/40 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className={`text-2xl ${suit.color}`}>{suit.symbol}</span>
                                        <span className="text-xs font-mono uppercase">{suit.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Options */}
                        <div className="glass-panel rounded-xl p-6 border-white/5">
                            <h3 className="text-white/60 text-xs font-mono mb-4 uppercase tracking-wider flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Options
                            </h3>
                            <div className="flex flex-col gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${includeJokers ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-white/40'
                                        }`}>
                                        {includeJokers && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={includeJokers}
                                        onChange={(e) => setIncludeJokers(e.target.checked)}
                                    />
                                    <span className="text-white/80 font-mono text-sm">Include Jokers (2)</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${enableTimer ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-white/40'
                                        }`}>
                                        {enableTimer && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={enableTimer}
                                        onChange={(e) => setEnableTimer(e.target.checked)}
                                    />
                                    <span className="text-white/80 font-mono text-sm">Enable Timer</span>
                                </label>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="flex justify-center">
                            <button
                                onClick={startMemorization}
                                disabled={selectedSuits.length === 0}
                                className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl text-black font-bold font-mono tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                <Brain className="w-5 h-5" />
                                START MEMORIZING
                            </button>
                        </div>
                    </div>
                )}

                {(mode === 'memorize' || mode === 'recall') && (
                    <div className="space-y-8">
                        {/* Card Display */}
                        <div className="flex justify-center">
                            <div className="relative w-64 h-96 perspective-1000">
                                <div
                                    onClick={handleCardClick}
                                    className={`w-full h-full glass-panel rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${mode === 'recall' && !showCard
                                        ? 'bg-white/5 border-white/10'
                                        : 'bg-black/40 border-primary/20'
                                        }`}
                                >

                                    {mode === 'recall' && !showCard ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center group">
                                            <Eye className="w-12 h-12 text-white/20 group-hover:text-primary transition-all mb-4" />
                                            <span className="font-mono text-sm text-white/40 group-hover:text-white">TAP TO REVEAL</span>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Top Corner */}
                                            <div className="absolute top-4 left-4 flex flex-col items-center">
                                                <span className={`text-2xl font-bold font-mono ${getCardColor(deck[currentIndex])}`}>
                                                    {deck[currentIndex].replace(/[♠♥♣♦]/, '')}
                                                </span>
                                                <span className={`text-2xl ${getCardColor(deck[currentIndex])}`}>
                                                    {deck[currentIndex].match(/[♠♥♣♦]/)}
                                                </span>
                                            </div>

                                            {/* Center */}
                                            <div className={`text-6xl md:text-8xl font-bold font-mono ${getCardColor(deck[currentIndex])}`}>
                                                {deck[currentIndex]}
                                            </div>

                                            {/* Bottom Corner */}
                                            <div className="absolute bottom-4 right-4 flex flex-col items-center rotate-180">
                                                <span className={`text-2xl font-bold font-mono ${getCardColor(deck[currentIndex])}`}>
                                                    {deck[currentIndex].replace(/[♠♥♣♦]/, '')}
                                                </span>
                                                <span className={`text-2xl ${getCardColor(deck[currentIndex])}`}>
                                                    {deck[currentIndex].match(/[♠♥♣♦]/)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="text-center">
                            <p className="text-white/40 font-mono text-xs mb-2">
                                CARD {currentIndex + 1} / {deck.length}
                            </p>
                            <div className="w-full max-w-md mx-auto h-1 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-300"
                                    style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center items-center gap-8">
                            <button
                                onClick={(e) => { e.stopPropagation(); prevStep(); }}
                                disabled={currentIndex === 0}
                                className="p-4 rounded-full glass-panel hover:bg-white/10 disabled:opacity-30 transition-all"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            {mode === 'memorize' ? (
                                <button
                                    onClick={(e) => { e.stopPropagation(); startRecall(); }}
                                    className="px-8 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary font-mono text-sm transition-all flex items-center gap-2"
                                >
                                    <Brain className="w-4 h-4" />
                                    START RECALL
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextStep(); }}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-mono text-sm transition-all"
                                >
                                    NEXT CARD
                                </button>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); nextStep(); }}
                                disabled={currentIndex >= deck.length - 1}
                                className="p-4 rounded-full glass-panel hover:bg-white/10 disabled:opacity-30 transition-all"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    category: 'personal' | 'work' | 'urgent' | 'other';
    createdAt: number;
    updatedAt?: number;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('fairyfloss-todos');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [category, setCategory] = useState<'personal' | 'work' | 'urgent' | 'other'>('personal');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'work'>('all');

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        localStorage.setItem('fairyfloss-todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            completed: false,
            category,
            createdAt: Date.now()
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const startEditing = (todo: Todo) => {
        setEditingId(todo.id);
        setEditValue(todo.text);
    };

    const saveEdit = (id: string) => {
        if (!editValue.trim()) return;
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: editValue.trim(), updatedAt: Date.now() } : todo
        ));
        setEditingId(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        if (filter === 'work') return todo.category === 'work';
        return true;
    });

    const getCategoryColor = (c: string) => {
        switch (c) {
            case 'work': return 'text-fairy-purple';
            case 'personal': return 'text-fairy-teal';
            case 'urgent': return 'text-destructive';
            default: return 'text-white/60';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">todoList</span> = {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Smart tasks with priority & categories
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Add Todo Input */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new task..."
                            className="flex-1 glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm"
                        />
                        <button
                            onClick={addTodo}
                            disabled={!inputValue.trim()}
                            className="px-6 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary font-mono text-sm transition-all disabled:opacity-30 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            ADD
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                            <SelectTrigger className="w-[140px] glass-panel border-0 text-white/80 h-[38px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="glass-panel border-white/10 bg-[#1a1b26] text-white">
                                <SelectItem value="personal">Personal</SelectItem>
                                <SelectItem value="work">Work</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'active', 'completed', 'work'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-mono text-xs transition-all uppercase ${filter === f
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                    <div className="ml-auto text-white/40 font-mono text-xs py-2">
                        {todos.filter(t => !t.completed).length} pending
                    </div>
                </div>

                {/* Todo List */}
                <div className="space-y-3">
                    {filteredTodos.length === 0 ? (
                        <div className="text-center py-12 text-white/20 font-mono text-sm">
                            {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks found.`}
                        </div>
                    ) : (
                        filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`glass-panel rounded-lg p-4 flex items-center gap-4 group transition-all ${todo.completed ? 'opacity-50' : ''
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed
                                        ? 'border-primary bg-primary/20 text-primary'
                                        : 'border-white/20 text-transparent hover:border-primary/50'
                                        }`}
                                >
                                    <Check className="w-4 h-4" />
                                </button>

                                <div className="flex-1 min-w-0">
                                    {editingId === todo.id ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                                className="flex-1 bg-white/5 rounded px-2 py-1 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                autoFocus
                                            />
                                            <button onClick={() => saveEdit(todo.id)} className="text-green-400 hover:text-green-300"><Save className="w-4 h-4" /></button>
                                            <button onClick={cancelEdit} className="text-destructive hover:text-red-400"><X className="w-4 h-4" /></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={`font-mono text-sm truncate transition-all ${todo.completed ? 'text-white/40 line-through' : 'text-white/90'
                                                    }`}>
                                                    {todo.text}
                                                </p>

                                                {todo.category && (
                                                    <span className={`text-[10px] flex items-center gap-1 ${getCategoryColor(todo.category)}`}>
                                                        <Tag className="w-3 h-3" /> {todo.category}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-white/40 font-mono">
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEditing(todo)}
                                        className="p-2 text-white/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        className="p-2 text-white/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


// Time Calculator Component for Project Management
const TimeCalculator = () => {
    // Deadline Calculator State
    const [deadlineDate, setDeadlineDate] = useState<string>('');
    const [deadlineTime, setDeadlineTime] = useState<string>('');
    const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

    // Work Session Timer State
    const [sessionSeconds, setSessionSeconds] = useState(0);
    const [isSessionRunning, setIsSessionRunning] = useState(false);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

    // Time Estimation State
    const [estimatedHours, setEstimatedHours] = useState<string>('');
    const [estimatedMinutes, setEstimatedMinutes] = useState<string>('');
    const [completionTime, setCompletionTime] = useState<string>('');

    // Break Reminder State
    const [showBreakReminder, setShowBreakReminder] = useState(false);
    const [breakType, setBreakType] = useState<'pomodoro' | 'long'>('pomodoro');

    // Update deadline countdown
    useEffect(() => {
        if (!deadlineDate) {
            setCountdown(null);
            return;
        }

        const calculateCountdown = () => {
            const deadline = new Date(`${deadlineDate}T${deadlineTime || '23:59'}`);
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();

            if (diff <= 0) {
                setIsDeadlinePassed(true);
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setIsDeadlinePassed(false);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 1000);
        return () => clearInterval(interval);
    }, [deadlineDate, deadlineTime]);

    // Work session timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSessionRunning) {
            interval = setInterval(() => {
                setSessionSeconds(prev => {
                    const newSeconds = prev + 1;
                    // Check for break reminders
                    if (newSeconds === 25 * 60) {
                        setShowBreakReminder(true);
                        setBreakType('pomodoro');
                    } else if (newSeconds === 50 * 60) {
                        setShowBreakReminder(true);
                        setBreakType('long');
                    }
                    return newSeconds;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSessionRunning]);

    // Calculate completion time when estimation changes
    useEffect(() => {
        const hours = parseFloat(estimatedHours) || 0;
        const minutes = parseFloat(estimatedMinutes) || 0;
        const totalMinutes = hours * 60 + minutes;

        if (totalMinutes > 0) {
            const now = new Date();
            const endTime = new Date(now.getTime() + totalMinutes * 60 * 1000);
            setCompletionTime(endTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            }) + ' on ' + endTime.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            }));
        } else {
            setCompletionTime('');
        }
    }, [estimatedHours, estimatedMinutes]);

    const formatSessionTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleSession = () => {
        if (!isSessionRunning) {
            setSessionStartTime(new Date());
        }
        setIsSessionRunning(!isSessionRunning);
    };

    const resetSession = () => {
        setIsSessionRunning(false);
        setSessionSeconds(0);
        setSessionStartTime(null);
        setShowBreakReminder(false);
    };

    const dismissBreakReminder = () => {
        setShowBreakReminder(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        function <span className="text-fairy-teal">calculateTime</span>(deadline, estimation) {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Project time management & tracking
                        </div>
                        <div className="text-white/60">
                            return {'{'}countdown, sessionTime, completionTime{'}'}
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Break Reminder Alert */}
                {showBreakReminder && (
                    <div className="glass-panel rounded-xl p-4 mb-6 border-2 border-fairy-yellow/50 bg-fairy-yellow/10 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-fairy-yellow" />
                                <div>
                                    <p className="text-fairy-yellow font-mono font-bold">
                                        {breakType === 'pomodoro' ? '🍅 Pomodoro Break!' : '☕ Long Break Time!'}
                                    </p>
                                    <p className="text-white/60 text-sm font-mono">
                                        {breakType === 'pomodoro' 
                                            ? "You've worked 25 minutes. Take a 5-minute break!" 
                                            : "You've worked 50 minutes. Take a 10-minute break!"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={dismissBreakReminder}
                                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Deadline Calculator */}
                    <div className="glass-panel rounded-xl p-6 border-primary/30">
                        <h3 className="text-primary font-mono font-bold mb-4 text-lg flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            DEADLINE_COUNTDOWN
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-white/80 text-xs font-mono mb-2 block">TARGET_DATE</label>
                                <input
                                    type="date"
                                    value={deadlineDate}
                                    onChange={(e) => setDeadlineDate(e.target.value)}
                                    className="w-full glass-panel rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-white/80 text-xs font-mono mb-2 block">TARGET_TIME (optional)</label>
                                <input
                                    type="time"
                                    value={deadlineTime}
                                    onChange={(e) => setDeadlineTime(e.target.value)}
                                    className="w-full glass-panel rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                                />
                            </div>
                            {countdown && (
                                <div className={`glass-panel rounded-xl p-4 ${isDeadlinePassed ? 'border-destructive/50 bg-destructive/10' : 'border-fairy-teal/50'}`}>
                                    {isDeadlinePassed ? (
                                        <p className="text-destructive font-mono text-center font-bold">⚠️ DEADLINE_PASSED</p>
                                    ) : (
                                        <div className="grid grid-cols-4 gap-2 text-center">
                                            <div>
                                                <p className="text-2xl font-bold text-white font-mono">{countdown.days}</p>
                                                <p className="text-xs text-white/40 font-mono">DAYS</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white font-mono">{countdown.hours}</p>
                                                <p className="text-xs text-white/40 font-mono">HRS</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white font-mono">{countdown.minutes}</p>
                                                <p className="text-xs text-white/40 font-mono">MIN</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-fairy-teal font-mono">{countdown.seconds}</p>
                                                <p className="text-xs text-white/40 font-mono">SEC</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Work Session Timer */}
                    <div className="glass-panel rounded-xl p-6 border-fairy-purple/30">
                        <h3 className="text-fairy-purple font-mono font-bold mb-4 text-lg flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            WORK_SESSION
                        </h3>
                        <div className="space-y-4">
                            <div className="glass-panel rounded-xl p-6 text-center">
                                <p className="text-4xl font-bold text-white font-mono tracking-wider">
                                    {formatSessionTime(sessionSeconds)}
                                </p>
                                {sessionStartTime && (
                                    <p className="text-white/40 text-xs font-mono mt-2">
                                        Started at {sessionStartTime.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={toggleSession}
                                    className={`flex-1 py-3 rounded-lg font-mono text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        isSessionRunning 
                                            ? 'bg-fairy-yellow/20 text-fairy-yellow hover:bg-fairy-yellow/30' 
                                            : 'bg-fairy-teal/20 text-fairy-teal hover:bg-fairy-teal/30'
                                    }`}
                                >
                                    {isSessionRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isSessionRunning ? 'PAUSE' : 'START'}
                                </button>
                                <button
                                    onClick={resetSession}
                                    className="px-4 py-3 rounded-lg font-mono text-sm font-bold bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    RESET
                                </button>
                            </div>
                            {/* Session Progress Indicators */}
                            <div className="flex gap-2">
                                <div className={`flex-1 h-2 rounded-full ${sessionSeconds >= 25 * 60 ? 'bg-fairy-teal' : 'bg-white/10'}`} title="25 min (Pomodoro)"></div>
                                <div className={`flex-1 h-2 rounded-full ${sessionSeconds >= 50 * 60 ? 'bg-fairy-purple' : 'bg-white/10'}`} title="50 min"></div>
                                <div className={`flex-1 h-2 rounded-full ${sessionSeconds >= 90 * 60 ? 'bg-primary' : 'bg-white/10'}`} title="90 min (Deep Work)"></div>
                            </div>
                            <p className="text-white/40 text-xs font-mono text-center">
                                Progress: 25min → 50min → 90min (Deep Work)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Time Estimation Section */}
                <div className="glass-panel rounded-xl p-6 mt-6 border-fairy-teal/30">
                    <h3 className="text-fairy-teal font-mono font-bold mb-4 text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        TIME_ESTIMATION
                    </h3>
                    <p className="text-white/60 text-sm font-mono mb-4">
                        // Enter estimated work duration to calculate completion time
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-white/80 text-xs font-mono mb-2 block">HOURS</label>
                            <input
                                type="number"
                                min="0"
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value)}
                                placeholder="0"
                                className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-white/80 text-xs font-mono mb-2 block">MINUTES</label>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                value={estimatedMinutes}
                                onChange={(e) => setEstimatedMinutes(e.target.value)}
                                placeholder="0"
                                className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-white/80 text-xs font-mono mb-2 block">COMPLETION_TIME</label>
                            <div className="glass-panel rounded-lg px-4 py-3 font-mono">
                                {completionTime ? (
                                    <span className="text-fairy-teal font-bold">{completionTime}</span>
                                ) : (
                                    <span className="text-white/40">Enter time above</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Reference */}
                <div className="glass-panel rounded-xl p-4 mt-6 border-white/5">
                    <p className="text-fairy-yellow text-xs font-mono leading-relaxed">
                        <span className="text-white/80">// TIPS:</span> Use the Pomodoro technique (25 min work, 5 min break) for focused sessions.
                        <br />Deep work sessions of 90 minutes can boost productivity for complex tasks.
                    </p>
                </div>

                {/* Daily Schedule Planner */}
                <DailySchedulePlanner />
            </div>
        </div>
    );
};


// Daily Schedule Planner Component
interface ScheduleTask {
    id: string;
    name: string;
    duration: number; // in hours
    completed: boolean;
    color: 'research' | 'code' | 'review' | 'other';
    reminderTime?: string; // "14:30" format
    reminderSent?: boolean;
    startTime?: string; // "HH:MM"
    endTime?: string;   // "HH:MM"
}

interface ScheduleSettings {
    sleepStart: string; // "23:00"
    sleepEnd: string;   // "07:00"
    lunchStart: string;
    lunchEnd: string;
    dinnerStart: string;
    dinnerEnd: string;
}

const DailySchedulePlanner = () => {
    const [tasks, setTasks] = useState<ScheduleTask[]>([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDuration, setNewTaskDuration] = useState('1');
    const [newTaskColor, setNewTaskColor] = useState<ScheduleTask['color']>('code');
    const [newTaskReminder, setNewTaskReminder] = useState('');
    const [newTaskStart, setNewTaskStart] = useState(''); // New state for start time
    const [newTaskEnd, setNewTaskEnd] = useState('');     // New state for end time
    const [showSettings, setShowSettings] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
    const [settings, setSettings] = useState<ScheduleSettings>({
        sleepStart: '23:00',
        sleepEnd: '07:00',
        lunchStart: '12:00',
        lunchEnd: '13:00',
        dinnerStart: '19:00',
        dinnerEnd: '20:00'
    });

    // Check notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // Request notification permission
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
        }
    };

    // Send notification helper
    const sendNotification = (title: string, body: string) => {
        if (notificationPermission === 'granted') {
            new Notification(title, {
                body,
                icon: '/favicon.ico',
                tag: 'schedule-reminder'
            });
        }
    };

    // Check for reminders every minute
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            tasks.forEach(task => {
                if (task.reminderTime === currentTime && !task.reminderSent && !task.completed) {
                    sendNotification(
                        '⏰ Task Reminder',
                        `Time to work on: ${task.name} (${task.duration}h)`
                    );
                    // Mark reminder as sent
                    setTasks(prev => prev.map(t => 
                        t.id === task.id ? { ...t, reminderSent: true } : t
                    ));
                }
            });
        };

        checkReminders();
        const interval = setInterval(checkReminders, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [tasks, notificationPermission]);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('daily-schedule');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.tasks) setTasks(data.tasks);
            if (data.settings) setSettings(data.settings);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('daily-schedule', JSON.stringify({ tasks, settings }));
    }, [tasks, settings]);

    const colorMap = {
        research: { bg: 'bg-fairy-purple/30', border: 'border-fairy-purple', text: 'text-fairy-purple', label: '📚 Research' },
        code: { bg: 'bg-fairy-teal/30', border: 'border-fairy-teal', text: 'text-fairy-teal', label: '💻 Code' },
        review: { bg: 'bg-fairy-blue/30', border: 'border-fairy-blue', text: 'text-fairy-blue', label: '🔍 Review' },
        other: { bg: 'bg-white/10', border: 'border-white/30', text: 'text-white/80', label: '📌 Other' }
    };

    const timeToHour = (time: string): number => {
        const [h, m] = time.split(':').map(Number);
        return h + m / 60;
    };

    const addTask = () => {
        if (!newTaskName.trim()) return;

        let duration = 0;
        let startTime = newTaskStart || undefined;
        let endTime = newTaskEnd || undefined;

        if (startTime && endTime) {
            const startHour = timeToHour(startTime);
            const endHour = timeToHour(endTime);
            if (endHour > startHour) {
                duration = endHour - startHour;
            } else if (endHour < startHour) {
                // Overnight task, calculate duration across midnight
                duration = (24 - startHour) + endHour;
            } else {
                // Start and end times are the same, duration is 0
                duration = 0;
            }
        } else if (newTaskDuration) {
            duration = parseFloat(newTaskDuration);
        } else {
            duration = 1; // Default to 1 hour if no times and no duration
        }

        if (duration <= 0) {
            alert("Task duration must be positive. Please set valid start/end times or duration.");
            return;
        }

        const task: ScheduleTask = {
            id: Date.now().toString(),
            name: newTaskName.trim(),
            duration: duration,
            completed: false,
            color: newTaskColor,
            reminderTime: newTaskReminder || undefined,
            reminderSent: false,
            startTime: startTime,
            endTime: endTime
        };
        setTasks([...tasks, task]);
        setNewTaskName('');
        setNewTaskDuration('1');
        setNewTaskReminder('');
        setNewTaskStart(''); // Reset new task start time
        setNewTaskEnd('');   // Reset new task end time
    };

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    const clearCompleted = () => {
        setTasks(tasks.filter(t => !t.completed));
    };

    // Calculate available work hours
    const calculateAvailableHours = (): number => {
        const sleepHours = 8; // Fixed
        const lunchHours = timeToHour(settings.lunchEnd) - timeToHour(settings.lunchStart);
        const dinnerHours = timeToHour(settings.dinnerEnd) - timeToHour(settings.dinnerStart);
        return 24 - sleepHours - lunchHours - dinnerHours;
    };

    const totalTaskHours = tasks.reduce((sum, t) => sum + t.duration, 0);
    const availableHours = calculateAvailableHours();
    const remainingHours = availableHours - totalTaskHours;

    // Generate timeline blocks
    const generateTimelineBlocks = () => {
        const blocks: { start: number; end: number; type: 'sleep' | 'meal' | 'task' | 'free'; label: string; color?: string; taskColorClass?: string }[] = [];
        
        // Add fixed blocks first
        const sleepStart = timeToHour(settings.sleepStart);
        const sleepEnd = timeToHour(settings.sleepEnd);
        
        // Sleep block (handles overnight)
        if (sleepStart > sleepEnd) {
            blocks.push({ start: sleepStart, end: 24, type: 'sleep', label: '🌙 Sleep' });
            blocks.push({ start: 0, end: sleepEnd, type: 'sleep', label: '🌙 Sleep' });
        } else {
            blocks.push({ start: sleepStart, end: sleepEnd, type: 'sleep', label: '🌙 Sleep' });
        }
        
        // Meal blocks
        blocks.push({ 
            start: timeToHour(settings.lunchStart), 
            end: timeToHour(settings.lunchEnd), 
            type: 'meal', 
            label: '🍽️ Lunch' 
        });
        blocks.push({ 
            start: timeToHour(settings.dinnerStart), 
            end: timeToHour(settings.dinnerEnd), 
            type: 'meal', 
            label: '🍽️ Dinner' 
        });

        // Add task blocks
        tasks.forEach(task => {
            if (task.startTime && task.endTime) {
                const taskStart = timeToHour(task.startTime);
                const taskEnd = timeToHour(task.endTime);
                if (taskStart < taskEnd) {
                    blocks.push({ 
                        start: taskStart, 
                        end: taskEnd, 
                        type: 'task', 
                        label: task.name, 
                        taskColorClass: colorMap[task.color].bg 
                    });
                } else if (taskStart > taskEnd) {
                    // Overnight task
                    blocks.push({ 
                        start: taskStart, 
                        end: 24, 
                        type: 'task', 
                        label: task.name, 
                        taskColorClass: colorMap[task.color].bg 
                    });
                    blocks.push({ 
                        start: 0, 
                        end: taskEnd, 
                        type: 'task', 
                        label: task.name, 
                        taskColorClass: colorMap[task.color].bg 
                    });
                }
            }
        });

        return blocks.sort((a, b) => a.start - b.start);
    };

    const timelineBlocks = generateTimelineBlocks();

    // Generate hour labels
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="glass-panel rounded-xl p-6 mt-6 border-fairy-purple/30">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-fairy-purple font-mono font-bold text-lg flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    DAILY_SCHEDULE
                </h3>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className="glass-panel rounded-xl p-4 mb-6 border-white/10">
                    <h4 className="text-white/80 font-mono text-sm mb-4">⚙️ SCHEDULE_SETTINGS</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-mono mb-1 block">🌙 Sleep (8hrs fixed)</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={settings.sleepStart}
                                    onChange={(e) => setSettings({ ...settings, sleepStart: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                                <span className="text-white/40 self-center">→</span>
                                <input
                                    type="time"
                                    value={settings.sleepEnd}
                                    onChange={(e) => setSettings({ ...settings, sleepEnd: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-mono mb-1 block">🍽️ Lunch</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={settings.lunchStart}
                                    onChange={(e) => setSettings({ ...settings, lunchStart: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                                <span className="text-white/40 self-center">→</span>
                                <input
                                    type="time"
                                    value={settings.lunchEnd}
                                    onChange={(e) => setSettings({ ...settings, lunchEnd: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-mono mb-1 block">🍽️ Dinner</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={settings.dinnerStart}
                                    onChange={(e) => setSettings({ ...settings, dinnerStart: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                                <span className="text-white/40 self-center">→</span>
                                <input
                                    type="time"
                                    value={settings.dinnerEnd}
                                    onChange={(e) => setSettings({ ...settings, dinnerEnd: e.target.value })}
                                    className="flex-1 glass-panel rounded px-2 py-1 text-white font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Permission */}
            {notificationPermission !== 'granted' && (
                <div className="glass-panel rounded-xl p-4 mb-6 border-fairy-yellow/30 bg-fairy-yellow/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-fairy-yellow font-mono text-sm font-bold">🔔 Enable Reminders</p>
                            <p className="text-white/60 text-xs font-mono">Get browser notifications for your scheduled tasks</p>
                        </div>
                        <button
                            onClick={requestNotificationPermission}
                            className="px-4 py-2 bg-fairy-yellow/20 text-fairy-yellow rounded-lg font-mono text-sm font-bold hover:bg-fairy-yellow/30 transition-all"
                        >
                            Enable
                        </button>
                    </div>
                </div>
            )}

            {/* Add Task Form */}
            <div className="glass-panel rounded-xl p-4 mb-6 border-white/10">
                <div className="flex flex-wrap gap-3 items-center">
                    <input
                        type="text"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        placeholder="Task name..."
                        className="flex-1 min-w-[150px] glass-panel rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-fairy-teal transition-all font-mono text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-white/40 text-xs">Start:</span>
                        <input
                            type="time"
                            value={newTaskStart}
                            onChange={(e) => { setNewTaskStart(e.target.value); setNewTaskDuration(''); }}
                            className="glass-panel rounded-lg px-2 py-2 text-white font-mono text-sm"
                            title="Task start time"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-white/40 text-xs">End:</span>
                        <input
                            type="time"
                            value={newTaskEnd}
                            onChange={(e) => { setNewTaskEnd(e.target.value); setNewTaskDuration(''); }}
                            className="glass-panel rounded-lg px-2 py-2 text-white font-mono text-sm"
                            title="Task end time"
                        />
                    </div>
                    <span className="text-white/40 text-sm">or</span>
                    <input
                        type="number"
                        value={newTaskDuration}
                        onChange={(e) => { setNewTaskDuration(e.target.value); setNewTaskStart(''); setNewTaskEnd(''); }}
                        min="0.5"
                        max="12"
                        step="0.5"
                        className="w-20 glass-panel rounded-lg px-3 py-2 text-white font-mono text-sm text-center"
                        placeholder="1"
                    />
                    <span className="text-white/40 text-sm self-center">hrs</span>
                    <select
                        value={newTaskColor}
                        onChange={(e) => setNewTaskColor(e.target.value as ScheduleTask['color'])}
                        className="glass-panel rounded-lg px-3 py-2 text-white font-mono text-sm bg-transparent"
                    >
                        <option value="code" className="bg-background">💻 Code</option>
                        <option value="research" className="bg-background">📚 Research</option>
                        <option value="review" className="bg-background">🔍 Review</option>
                        <option value="other" className="bg-background">📌 Other</option>
                    </select>
                    <div className="flex items-center gap-1">
                        <span className="text-white/40 text-xs">⏰</span>
                        <input
                            type="time"
                            value={newTaskReminder}
                            onChange={(e) => setNewTaskReminder(e.target.value)}
                            className="glass-panel rounded-lg px-2 py-2 text-white font-mono text-sm"
                            title="Set reminder time"
                        />
                    </div>
                    <button
                        onClick={addTask}
                        className="px-4 py-2 bg-fairy-teal/20 text-fairy-teal rounded-lg font-mono text-sm font-bold hover:bg-fairy-teal/30 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        ADD
                    </button>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-fairy-teal font-mono">{availableHours.toFixed(1)}h</p>
                    <p className="text-xs text-white/40 font-mono">Available</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-fairy-purple font-mono">{totalTaskHours.toFixed(1)}h</p>
                    <p className="text-xs text-white/40 font-mono">Scheduled</p>
                </div>
                <div className={`glass-panel rounded-xl p-4 text-center ${remainingHours < 0 ? 'border-destructive/50' : ''}`}>
                    <p className={`text-2xl font-bold font-mono ${remainingHours < 0 ? 'text-destructive' : 'text-primary'}`}>
                        {remainingHours.toFixed(1)}h
                    </p>
                    <p className="text-xs text-white/40 font-mono">{remainingHours < 0 ? 'Over!' : 'Free'}</p>
                </div>
            </div>

            {/* Visual Timeline */}
            <div className="glass-panel rounded-xl p-4 mb-6 border-white/10 overflow-x-auto">
                <h4 className="text-white/60 font-mono text-xs mb-3">24-HOUR TIMELINE</h4>
                <div className="relative min-w-[600px]">
                    {/* Hour markers */}
                    <div className="flex mb-1">
                        {hours.map(h => (
                            <div key={h} className="flex-1 text-center text-[10px] text-white/30 font-mono">
                                {h.toString().padStart(2, '0')}
                            </div>
                        ))}
                    </div>
                    {/* Timeline bar */}
                    <div className="relative h-10 bg-white/5 rounded-lg overflow-hidden">
                        {/* Fixed blocks */}
                        {timelineBlocks.map((block, i) => {
                            const width = ((block.end - block.start) / 24) * 100;
                            const left = (block.start / 24) * 100;
                            let blockClass = '';
                            if (block.type === 'sleep') {
                                blockClass = 'bg-fairy-purple/40';
                            } else if (block.type === 'meal') {
                                blockClass = 'bg-fairy-yellow/40';
                            } else if (block.type === 'task') {
                                blockClass = block.taskColorClass || 'bg-white/20'; // Use task-specific color
                            }
                            return (
                                <div
                                    key={i}
                                    className={`absolute top-0 h-full flex items-center justify-center text-xs font-mono ${blockClass}`}
                                    style={{ left: `${left}%`, width: `${width}%` }}
                                    title={`${block.label} (${block.start.toFixed(0).padStart(2, '0')}:00 - ${block.end.toFixed(0).padStart(2, '0')}:00)`}
                                >
                                    <span className="truncate px-1 text-[10px]">{block.label}</span>
                                </div>
                            );
                        })}
                        {/* Current time indicator */}
                        {(() => {
                            const now = new Date();
                            const currentHour = now.getHours() + now.getMinutes() / 60;
                            const left = (currentHour / 24) * 100;
                            return (
                                <div
                                    className="absolute top-0 w-0.5 h-full bg-destructive z-10"
                                    style={{ left: `${left}%` }}
                                    title={`Now: ${now.toLocaleTimeString()}`}
                                />
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-2">
                {tasks.length === 0 ? (
                    <p className="text-white/40 text-sm font-mono text-center py-4">
                        No tasks yet. Add tasks above to plan your day!
                    </p>
                ) : (
                    <>
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={`glass-panel rounded-lg p-3 flex items-center gap-3 ${
                                    task.completed ? 'opacity-50' : ''
                                } ${colorMap[task.color].bg} border ${colorMap[task.color].border}`}
                            >
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                        task.completed 
                                            ? 'bg-fairy-teal border-fairy-teal' 
                                            : 'border-white/30 hover:border-fairy-teal'
                                    }`}
                                >
                                    {task.completed && <Check className="w-4 h-4 text-white" />}
                                </button>
                                <div className="flex-1">
                                    <p className={`font-mono text-sm ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                                        {task.name}
                                    </p>
                                    {(task.reminderTime || (task.startTime && task.endTime)) && (
                                        <p className="text-white/40 text-xs font-mono flex items-center gap-1">
                                            {task.startTime && task.endTime && (
                                                <span>{task.startTime} - {task.endTime}</span>
                                            )}
                                            {task.reminderTime && (
                                                <>
                                                    {task.startTime && task.endTime && <span className="mx-1">|</span>}
                                                    ⏰ {task.reminderTime}
                                                </>
                                            )}
                                            {task.reminderSent && <span className="text-fairy-teal">✓</span>}
                                        </p>
                                    )}
                                </div>
                                <span className={`text-xs font-mono ${colorMap[task.color].text}`}>
                                    {task.duration.toFixed(1)}h
                                </span>
                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="p-1 text-white/30 hover:text-destructive transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {tasks.some(t => t.completed) && (
                            <button
                                onClick={clearCompleted}
                                className="w-full py-2 text-white/40 hover:text-white text-xs font-mono hover:bg-white/5 rounded-lg transition-all"
                            >
                                Clear completed tasks
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/10">
                <span className="text-white/40 text-xs font-mono">Legend:</span>
                <span className="text-xs font-mono flex items-center gap-1">
                    <span className="w-3 h-3 bg-fairy-purple/40 rounded"></span> Sleep
                </span>
                <span className="text-xs font-mono flex items-center gap-1">
                    <span className="w-3 h-3 bg-fairy-yellow/40 rounded"></span> Meals
                </span>
                <span className="text-xs font-mono flex items-center gap-1">
                    <span className="w-3 h-3 bg-destructive rounded"></span> Now
                </span>
            </div>
        </div>
    );
};


// Hacker News Component
interface HNStory {
    id: number;
    title: string;
    url?: string;
    by: string;
    score: number;
    time: number;
    descendants?: number;
}

type SortOption = 'score' | 'time' | 'comments';
type FilterOption = 'all' | 'show' | 'ask' | 'jobs' | 'saved';

const HackerNews = () => {
    const [stories, setStories] = useState<HNStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [timeToMidnight, setTimeToMidnight] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    // Enhanced features
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('score');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [savedStories, setSavedStories] = useState<number[]>(() => {
        const saved = localStorage.getItem('hn-saved');
        return saved ? JSON.parse(saved) : [];
    });
    const [readStories, setReadStories] = useState<number[]>(() => {
        const read = localStorage.getItem('hn-read');
        return read ? JSON.parse(read) : [];
    });

    // Calculate seconds until midnight
    const getSecondsToMidnight = () => {
        const now = new Date();
        const midnight = new Date();
        midnight.setHours(24, 0, 0, 0);
        return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };

    const formatTimeToMidnight = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}h ${mins}m ${secs}s`;
    };

    const fetchStories = async (showFromCache = false) => {
        try {
            // Show cached data immediately for instant display
            if (showFromCache) {
                const cached = localStorage.getItem('hn-cache');
                if (cached) {
                    const { stories: cachedStories, timestamp } = JSON.parse(cached);
                    if (cachedStories && cachedStories.length > 0) {
                        setStories(cachedStories);
                        setLastUpdated(new Date(timestamp));
                        setLoading(false);
                    }
                }
            }

            setIsRefreshing(true);
            
            // Use Algolia HN API - search stories from last 24 hours, sorted by popularity
            const oneDayAgo = Math.floor(Date.now() / 1000) - (24 * 60 * 60);
            const response = await fetch(
                `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${oneDayAgo},points>10&hitsPerPage=100`
            );
            
            if (!response.ok) throw new Error('Failed to fetch stories');
            const data = await response.json();
            
            // Transform Algolia response to our HNStory format
            const fetchedStories: HNStory[] = data.hits.map((hit: {
                objectID: string;
                title: string;
                url?: string;
                author: string;
                points: number;
                created_at_i: number;
                num_comments: number;
            }) => ({
                id: parseInt(hit.objectID),
                title: hit.title,
                url: hit.url,
                by: hit.author,
                score: hit.points,
                time: hit.created_at_i,
                descendants: hit.num_comments
            }));

            // Sort by score
            const sortedStories = fetchedStories
                .filter(story => story && story.score)
                .sort((a, b) => b.score - a.score);

            const finalStories = sortedStories.length > 0 ? sortedStories : fetchedStories;
            
            // Cache for instant loading next time
            localStorage.setItem('hn-cache', JSON.stringify({
                stories: finalStories,
                timestamp: Date.now()
            }));

            setStories(finalStories);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stories');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        // Load from cache first, then fetch fresh data
        fetchStories(true);
    }, []);

    useEffect(() => {
        const updateTimer = () => {
            const seconds = getSecondsToMidnight();
            setTimeToMidnight(formatTimeToMidnight(seconds));
            if (seconds <= 1) fetchStories();
        };
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('hn-saved', JSON.stringify(savedStories));
    }, [savedStories]);

    useEffect(() => {
        localStorage.setItem('hn-read', JSON.stringify(readStories));
    }, [readStories]);

    // Mark stories as read when scrolled past (exits viewport from top)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Mark as read when story exits viewport from the TOP (user scrolled past it)
                    if (!entry.isIntersecting && entry.boundingClientRect.bottom < 0) {
                        const storyId = parseInt(entry.target.getAttribute('data-story-id') || '0');
                        if (storyId && !readStories.includes(storyId)) {
                            setReadStories(prev => [...prev, storyId]);
                        }
                    }
                });
            },
            { threshold: 0 }
        );

        // Observe all story elements
        const storyElements = document.querySelectorAll('[data-story-id]');
        storyElements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [stories, readStories]);

    const toggleSave = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        setSavedStories(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const markAsRead = (id: number) => {
        if (!readStories.includes(id)) {
            setReadStories(prev => [...prev, id]);
        }
    };

    const getStoryType = (title: string): { type: string; badge: string; color: string } | null => {
        if (title.startsWith('Show HN:')) return { type: 'show', badge: '🚀 Show', color: 'text-fairy-teal' };
        if (title.startsWith('Ask HN:')) return { type: 'ask', badge: '❓ Ask', color: 'text-fairy-purple' };
        if (title.includes('hiring') || title.includes('job')) return { type: 'jobs', badge: '💼 Job', color: 'text-fairy-yellow' };
        return null;
    };

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor(Date.now() / 1000 - timestamp);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const getDomain = (url?: string) => {
        if (!url) return 'news.ycombinator.com';
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return 'news.ycombinator.com';
        }
    };

    // Filter and sort stories
    const filteredStories = stories
        .filter(story => {
            if (!story) return false;
            // Search filter
            if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Type filter
            if (filterBy === 'saved') return savedStories.includes(story.id);
            if (filterBy === 'show') return story.title.startsWith('Show HN:');
            if (filterBy === 'ask') return story.title.startsWith('Ask HN:');
            if (filterBy === 'jobs') return story.title.toLowerCase().includes('hiring') || story.title.toLowerCase().includes('job');
            return true;
        })
        .sort((a, b) => {
            if (sortBy === 'score') return b.score - a.score;
            if (sortBy === 'time') return b.time - a.time;
            if (sortBy === 'comments') return (b.descendants || 0) - (a.descendants || 0);
            return 0;
        });

    // Stats - filter valid stories and handle undefined scores
    const validStories = stories.filter(s => s && typeof s.score === 'number');
    const stats = {
        total: stories.length,
        avgScore: validStories.length > 0 
            ? Math.round(validStories.reduce((a, b) => a + (b.score || 0), 0) / validStories.length) 
            : 0,
        totalComments: stories.reduce((a, b) => a + (b?.descendants || 0), 0),
        saved: savedStories.length,
        read: readStories.filter(id => stories.some(s => s?.id === id)).length
    };

    if (loading && stories.length === 0) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="glass-panel rounded-xl p-4 animate-pulse">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-white/10"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                                <div className="h-3 bg-white/10 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error && stories.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-8 border-destructive/50">
                <p className="text-destructive text-center font-mono">{error}</p>
                <button
                    onClick={() => fetchStories()}
                    className="mt-4 mx-auto block px-4 py-2 glass-panel rounded-lg hover:bg-white/10 transition-all text-sm font-mono text-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header Card */}
            <div className="glass-panel rounded-2xl p-6 border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="w-24 h-24 text-primary" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Newspaper className="w-5 h-5 text-primary" />
                            <h3 className="text-white/60 text-xs font-mono tracking-wider">HACKER_NEWS_DAILY</h3>
                        </div>
                        <p className="text-xl font-bold text-white font-mono">Today's Best Stories</p>
                        {lastUpdated && (
                            <p className="text-white/40 text-xs font-mono mt-1">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="glass-panel rounded-xl px-4 py-3 border-fairy-teal/30">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-fairy-teal" />
                                <div className="text-center">
                                    <p className="text-xs text-white/40 font-mono">Next daily update</p>
                                    <p className="text-lg font-bold text-fairy-teal font-mono">{timeToMidnight}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => fetchStories()}
                            disabled={isRefreshing}
                            className="glass-panel p-3 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-white font-mono">{stats.total}</p>
                    <p className="text-xs text-white/40 font-mono">Stories</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-fairy-yellow font-mono">{stats.avgScore}</p>
                    <p className="text-xs text-white/40 font-mono">Avg Score</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-fairy-teal font-mono">{stats.totalComments}</p>
                    <p className="text-xs text-white/40 font-mono">Comments</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-primary font-mono">{stats.saved}</p>
                    <p className="text-xs text-white/40 font-mono">Saved</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-fairy-purple font-mono">{stats.read}</p>
                    <p className="text-xs text-white/40 font-mono">Read</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass-panel rounded-xl p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search stories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full glass-panel rounded-lg px-4 py-2 pl-10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm"
                        />
                        <svg className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {(['all', 'show', 'ask', 'jobs', 'saved'] as FilterOption[]).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setFilterBy(filter)}
                                className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                                    filterBy === filter
                                        ? 'bg-primary/20 text-primary'
                                        : 'glass-panel text-white/60 hover:text-white'
                                }`}
                            >
                                {filter === 'all' && '📰 All'}
                                {filter === 'show' && '🚀 Show'}
                                {filter === 'ask' && '❓ Ask'}
                                {filter === 'jobs' && '💼 Jobs'}
                                {filter === 'saved' && `⭐ Saved (${stats.saved})`}
                            </button>
                        ))}
                    </div>

                    {/* Sort */}
                    <div className="flex gap-2">
                        {(['score', 'time', 'comments'] as SortOption[]).map((sort) => (
                            <button
                                key={sort}
                                onClick={() => setSortBy(sort)}
                                className={`px-3 py-2 rounded-lg font-mono text-xs transition-all ${
                                    sortBy === sort
                                        ? 'bg-fairy-teal/20 text-fairy-teal'
                                        : 'glass-panel text-white/60 hover:text-white'
                                }`}
                            >
                                {sort === 'score' && '▲ Score'}
                                {sort === 'time' && '🕐 New'}
                                {sort === 'comments' && '💬 Comments'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stories List */}
            <div className="space-y-3">
                {filteredStories.length === 0 ? (
                    <div className="glass-panel rounded-xl p-8 text-center">
                        <p className="text-white/40 font-mono">No stories found</p>
                    </div>
                ) : (
                    filteredStories.map((story, index) => {
                        const storyType = getStoryType(story.title);
                        const isRead = readStories.includes(story.id);
                        const isSaved = savedStories.includes(story.id);

                        return (
                            <a
                                key={story.id}
                                data-story-id={story.id}
                                href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => markAsRead(story.id)}
                                className={`block glass-panel rounded-xl p-4 hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20 ${
                                    isRead ? 'opacity-60' : ''
                                }`}
                            >
                                <div className="flex gap-4">
                                    {/* Rank */}
                                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-mono font-bold text-sm">{index + 1}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2 mb-2">
                                            {storyType && (
                                                <span className={`text-xs font-mono ${storyType.color} whitespace-nowrap`}>
                                                    {storyType.badge}
                                                </span>
                                            )}
                                            {isRead && (
                                                <span className="text-xs font-mono text-white/30">✓ Read</span>
                                            )}
                                        </div>
                                        <h4 className={`font-mono text-sm leading-relaxed mb-2 group-hover:text-primary transition-colors line-clamp-2 ${
                                            isRead ? 'text-white/60' : 'text-white'
                                        }`}>
                                            {story.title}
                                            <ExternalLink className="w-3 h-3 inline-block ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h4>

                                        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                                            <span className="text-fairy-yellow">▲ {story.score}</span>
                                            <span className="text-white/40">by {story.by}</span>
                                            <span className="text-white/40">{formatTimeAgo(story.time)}</span>
                                            <a
                                                href={`https://news.ycombinator.com/item?id=${story.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-white/40 hover:text-primary transition-colors"
                                            >
                                                💬 {story.descendants || 0}
                                            </a>
                                            <span className="text-primary/60 truncate max-w-[150px]">{getDomain(story.url)}</span>
                                        </div>
                                    </div>

                                    {/* Save Button */}
                                    <button
                                        onClick={(e) => toggleSave(e, story.id)}
                                        className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                                            isSaved
                                                ? 'bg-primary/20 text-primary'
                                                : 'text-white/30 hover:text-primary hover:bg-primary/10'
                                        }`}
                                    >
                                        {isSaved ? '⭐' : '☆'}
                                    </button>
                                </div>
                            </a>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <div className="glass-panel rounded-xl p-4 border-white/5">
                <div className="flex justify-between items-center">
                    <p className="text-white/40 text-xs font-mono">
                        Showing {filteredStories.length} of {stories.length} stories
                    </p>
                    <a
                        href="https://news.ycombinator.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-xs font-mono hover:underline flex items-center gap-1"
                    >
                        Visit HN <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Tools;
