import { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Clock, Activity, DollarSign, Calculator, Trash2, Calendar, Plus, CheckCircle2, ListTodo, Wifi, Zap, Check, Pencil, Tag, Flag, X, Save, Brain, RotateCcw, ChevronRight, ChevronLeft, Eye, EyeOff, Layers, Play, Pause, Timer, Settings } from 'lucide-react';
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
                    <TabsList className="grid w-full grid-cols-4 glass-panel p-1 rounded-lg mb-8">
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
                    </TabsList>

                    <TabsContent value="location">
                        <IPLocationTool />
                    </TabsContent>

                    <TabsContent value="calculator">
                        <CostCalculator />
                    </TabsContent>

                    <TabsContent value="todo">
                        <TodoList />
                    </TabsContent>

                    <TabsContent value="memory">
                        <CardMemorizer />
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


export default Tools;
