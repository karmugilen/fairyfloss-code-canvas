import { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Server, Clock, Shield, Activity, DollarSign, Calculator, Film, HardDrive, Hash, Lock, Code, Copy, Check, Trash2, Calendar, Plus, CheckCircle2, ListTodo, Wifi, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
                    <TabsList className="grid w-full grid-cols-7 glass-panel p-1 rounded-lg mb-8">
                        <TabsTrigger
                            value="location"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Globe className="w-4 h-4 mr-1" />
                            IP
                        </TabsTrigger>
                        <TabsTrigger
                            value="torrent"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Film className="w-4 h-4 mr-1" />
                            Stream
                        </TabsTrigger>
                        <TabsTrigger
                            value="calculator"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Calculator className="w-4 h-4 mr-1" />
                            Cost
                        </TabsTrigger>
                        <TabsTrigger
                            value="datasize"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <HardDrive className="w-4 h-4 mr-1" />
                            Size
                        </TabsTrigger>
                        <TabsTrigger
                            value="hash"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Hash className="w-4 h-4 mr-1" />
                            Hash
                        </TabsTrigger>
                        <TabsTrigger
                            value="base64"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <Code className="w-4 h-4 mr-1" />
                            Base64
                        </TabsTrigger>
                        <TabsTrigger
                            value="todo"
                            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-md transition-all duration-300 font-mono text-xs"
                        >
                            <ListTodo className="w-4 h-4 mr-1" />
                            Todo
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="location">
                        <IPLocationTool />
                    </TabsContent>

                    <TabsContent value="torrent">
                        <TorrentPlayer />
                    </TabsContent>

                    <TabsContent value="calculator">
                        <CostCalculator />
                    </TabsContent>

                    <TabsContent value="datasize">
                        <DataSizeConverter />
                    </TabsContent>

                    <TabsContent value="hash">
                        <HashGenerator />
                    </TabsContent>

                    <TabsContent value="base64">
                        <Base64Tool />
                    </TabsContent>

                    <TabsContent value="todo">
                        <TodoList />
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

                <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <h3 className="text-white/60 text-xs font-mono tracking-wider">GLOBAL_IP</h3>
                        </div>
                        <p className="text-4xl font-bold text-white font-mono tracking-tight">{locationData.ip}</p>
                        <p className="text-primary/60 text-sm mt-2 font-mono">{locationData.org}</p>
                    </div>

                    <div className="md:border-l md:border-white/10 md:pl-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Wifi className="w-5 h-5 text-fairy-teal" />
                            <h3 className="text-white/60 text-xs font-mono tracking-wider">LOCAL_IP</h3>
                        </div>
                        <p className="text-3xl font-bold text-white/90 font-mono tracking-tight">{localIp}</p>
                        <div className="flex items-center gap-2 mt-3">
                            <div className={`w-2 h-2 rounded-full ${ping && ping < 100 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <p className="text-white/40 text-xs font-mono">
                                Connection Status: <span className="text-white/80">Active</span>
                            </p>
                        </div>
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
                            <span className="text-white/40 text-sm font-mono">Coordinates</span>
                            <span className="text-white/80 text-sm font-mono">{locationData.loc}</span>
                        </div>
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
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-white/40 text-sm font-mono">Data Center</span>
                            <span className="text-white/80 text-sm font-mono">{locationData.org.includes('Cloud') || locationData.org.includes('Amazon') ? 'Yes' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Torrent Player Component - FULLY FUNCTIONAL
const TorrentPlayer = () => {
    const [magnetLink, setMagnetLink] = useState('');
    const [torrentFile, setTorrentFile] = useState<File | null>(null);
    const [client, setClient] = useState<any>(null);
    const [torrent, setTorrent] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [numPeers, setNumPeers] = useState(0);
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [status, setStatus] = useState<string>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Initialize WebTorrent client
        const initClient = async () => {
            try {
                const WebTorrent = (await import('webtorrent')).default;
                const newClient = new WebTorrent();
                setClient(newClient);
                setStatus('ready');
            } catch (error) {
                console.error('Failed to initialize WebTorrent:', error);
                setStatus('error');
                setErrorMessage('Failed to initialize WebTorrent. Please refresh the page.');
            }
        };
        initClient();

        return () => {
            if (client) {
                client.destroy();
            }
        };
    }, []);

    useEffect(() => {
        if (!torrent) return;

        const interval = setInterval(() => {
            setProgress((torrent.progress * 100));
            setDownloadSpeed(torrent.downloadSpeed);
            setUploadSpeed(torrent.uploadSpeed);
            setNumPeers(torrent.numPeers);
        }, 1000);

        return () => clearInterval(interval);
    }, [torrent]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setTorrentFile(e.target.files[0]);
        }
    };

    const validateMagnetLink = (link: string): string => {
        let cleanLink = link.trim();

        // Fix common typos
        if (cleanLink.startsWith('tmagnet:')) {
            cleanLink = cleanLink.replace('tmagnet:', 'magnet:');
        }

        // Check if it's a valid magnet link
        if (!cleanLink.startsWith('magnet:?')) {
            throw new Error('Invalid magnet link format. Must start with "magnet:?"');
        }

        // Check if it has the required xt parameter
        if (!cleanLink.includes('xt=urn:btih:')) {
            throw new Error('Magnet link missing required info hash (xt=urn:btih:)');
        }

        return cleanLink;
    };

    const startTorrent = (torrentId: string | File) => {
        if (!client) {
            setStatus('error');
            setErrorMessage('WebTorrent client not initialized. Please refresh the page.');
            return;
        }

        setStatus('loading');
        setProgress(0);
        setErrorMessage('');

        // List of reliable WebSocket trackers for browser support
        const announceList = [
            'wss://tracker.openwebtorrent.com',
            'wss://tracker.btorrent.xyz',
            'wss://tracker.webtorrent.dev',
            'wss://tracker.files.fm:7073/announce',
            'wss://open.weissbier.gerstl.xyz:443/announce'
        ];

        try {
            let processedTorrentId = torrentId;

            // Validate and clean magnet link if it's a string
            if (typeof torrentId === 'string') {
                processedTorrentId = validateMagnetLink(torrentId);

                // Append WebSocket trackers to the magnet link
                const currentTrackers = new URLSearchParams(processedTorrentId.split('?')[1]).getAll('tr');
                const hasWsTracker = currentTrackers.some(tr => tr.startsWith('wss://') || tr.startsWith('ws://'));

                if (!hasWsTracker) {
                    console.log('Adding WebSocket trackers to magnet link...');
                    announceList.forEach(tracker => {
                        processedTorrentId += `&tr=${encodeURIComponent(tracker)}`;
                    });
                }

                console.log('Starting torrent with magnet link:', processedTorrentId);
            }

            const torrent = client.add(processedTorrentId, {
                announce: announceList // Force announce list for both magnet and files
            }, (t: any) => {
                console.log('Torrent added successfully:', t.name);
                // setTorrent(t); // Already set below
                setStatus('streaming');
                setFiles(t.files);

                // Set up error listener
                t.on('error', (err: Error) => {
                    console.error('Torrent error:', err);
                    setStatus('error');
                    setErrorMessage(`Torrent error: ${err.message}`);
                });

                // Auto-select first video file
                const videoFile = t.files.find((file: any) =>
                    file.name.endsWith('.mp4') ||
                    file.name.endsWith('.mkv') ||
                    file.name.endsWith('.webm') ||
                    file.name.endsWith('.avi')
                );

                if (videoFile) {
                    playFile(videoFile);
                } else {
                    console.log('No video files found in torrent');
                }
            });

            // Set torrent immediately to track stats while metadata loads
            setTorrent(torrent);

            // Set a timeout for connection
            setTimeout(() => {
                if (status === 'loading' && torrent.numPeers === 0) {
                    setStatus('error');
                    setErrorMessage('Timeout: Could not connect to peers. The torrent might be dead or trackers are offline.');
                }
            }, 30000); // 30 second timeout

        } catch (error) {
            console.error('Error starting torrent:', error);
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to start torrent');
        }
    };

    const playFile = (file: any) => {
        setSelectedFile(file);
        file.renderTo(videoRef.current, {
            autoplay: true,
            controls: true,
        });
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">torrentPlayer</span> = {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // WebTorrent-based streaming
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {!torrent && (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="text-white/80 text-xs font-mono mb-2 block">MAGNET_LINK</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={magnetLink}
                                    onChange={(e) => setMagnetLink(e.target.value)}
                                    placeholder="magnet:?xt=urn:btih:..."
                                    className="flex-1 glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm"
                                />
                                <button
                                    onClick={() => magnetLink && startTorrent(magnetLink)}
                                    disabled={!magnetLink || !client}
                                    className="px-6 py-3 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary font-mono text-sm transition-all disabled:opacity-30"
                                >
                                    Stream
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-white/40 font-mono text-sm">or</div>

                        <div>
                            <label className="text-white/80 text-xs font-mono mb-2 block">UPLOAD_TORRENT</label>
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-all cursor-pointer">
                                <input
                                    type="file"
                                    accept=".torrent"
                                    onChange={(e) => {
                                        handleFileChange(e);
                                        if (e.target.files && e.target.files[0]) {
                                            startTorrent(e.target.files[0]);
                                        }
                                    }}
                                    className="hidden"
                                    id="torrent-upload"
                                />
                                <label htmlFor="torrent-upload" className="cursor-pointer">
                                    <Film className="w-12 h-12 mx-auto mb-3 text-primary/60" />
                                    <p className="text-white/60 font-mono text-sm">
                                        {torrentFile ? torrentFile.name : 'Click to upload .torrent file'}
                                    </p>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Player and Stats */}
                {(status === 'loading' || status === 'streaming') && (
                    <div className="space-y-4">
                        {/* Stats - Always visible */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="glass-panel rounded-lg p-4 border-primary/20">
                                <h4 className="text-white/60 text-xs font-mono mb-1">PROGRESS</h4>
                                <p className="text-primary font-mono text-lg font-bold">{progress.toFixed(1)}%</p>
                            </div>
                            <div className="glass-panel rounded-lg p-4 border-fairy-blue/20">
                                <h4 className="text-white/60 text-xs font-mono mb-1">DOWN_SPEED</h4>
                                <p className="text-fairy-blue font-mono text-lg font-bold">{formatBytes(downloadSpeed)}/s</p>
                            </div>
                            <div className="glass-panel rounded-lg p-4 border-fairy-teal/20">
                                <h4 className="text-white/60 text-xs font-mono mb-1">UP_SPEED</h4>
                                <p className="text-fairy-teal font-mono text-lg font-bold">{formatBytes(uploadSpeed)}/s</p>
                            </div>
                            <div className="glass-panel rounded-lg p-4 border-fairy-purple/20">
                                <h4 className="text-white/60 text-xs font-mono mb-1">PEERS</h4>
                                <p className="text-fairy-purple font-mono text-lg font-bold">{numPeers}</p>
                            </div>
                        </div>

                        {status === 'loading' && (
                            <div className="bg-black/30 glass-panel rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
                                <div>
                                    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-primary font-mono mb-2">Fetching metadata...</p>
                                    <p className="text-white/60 font-mono text-sm">
                                        Connected to {numPeers} peers. Waiting for file info...
                                    </p>
                                </div>
                            </div>
                        )}

                        {status === 'streaming' && (
                            <>
                                {/* Video Player */}
                                <div className="bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                                    <video
                                        ref={videoRef}
                                        className="w-full"
                                        controls
                                        style={{ maxHeight: '600px' }}
                                    />
                                </div>

                                {/* Files List */}
                                {files.length > 1 && (
                                    <div className="glass-panel rounded-xl p-6">
                                        <h3 className="text-white/80 text-sm font-mono mb-4">FILES</h3>
                                        <div className="space-y-2">
                                            {files.map((file, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => playFile(file)}
                                                    className={`w-full text-left glass-panel rounded-lg p-3 hover:bg-white/10 transition-all ${selectedFile === file ? 'border-2 border-primary/50' : ''
                                                        }`}
                                                >
                                                    <p className="text-white font-mono text-sm">{file.name}</p>
                                                    <p className="text-white/60 font-mono text-xs">{formatBytes(file.length)}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stop Button */}
                                <button
                                    onClick={() => {
                                        if (torrent) {
                                            torrent.destroy();
                                            setTorrent(null);
                                            setStatus('idle');
                                            setMagnetLink('');
                                            setTorrentFile(null);
                                            setSelectedFile(null);
                                        }
                                    }}
                                    className="w-full py-3 bg-destructive/20 hover:bg-destructive/30 rounded-lg text-destructive font-mono text-sm transition-all"
                                >
                                    Stop Streaming
                                </button>
                            </>
                        )}
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-destructive/10 glass-panel rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center border-destructive/30">
                        <div className="max-w-md">
                            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-destructive" />
                            </div>
                            <h3 className="text-destructive font-bold text-lg mb-2">Stream Failed</h3>
                            <p className="text-white/70 font-mono text-sm mb-6">{errorMessage || 'Failed to initialize WebTorrent'}</p>
                            <button
                                onClick={() => {
                                    setStatus('idle');
                                    setErrorMessage('');
                                }}
                                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-mono text-sm transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {status === 'idle' && !torrent && (
                    <div className="bg-black/30 glass-panel rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
                        <div className="text-white/40">
                            <Film className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                            <p className="text-lg font-mono text-primary/80">WebTorrent Player</p>
                            <p className="text-sm mt-2 font-mono text-white/60">Add a magnet link or torrent file to start streaming</p>
                        </div>
                    </div>
                )}

                <div className="mt-6 glass-panel rounded-xl p-4 border-fairy-blue/30">
                    <p className="text-fairy-blue text-xs font-mono leading-relaxed">
                        <span className="text-fairy-yellow">NOTE:</span> WebTorrent streams directly in your browser.<br />
                        No server-side processing. All streaming happens peer-to-peer.
                    </p>
                </div>
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
            </div>
        </div>
    );
};

// New Data Size Converter
const DataSizeConverter = () => {
    const [value, setValue] = useState<string>('1024');
    const [unit, setUnit] = useState<string>('MB');
    const [copied, setCopied] = useState<string>('');

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const multipliers: { [key: string]: number } = {
        'Bytes': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
        'TB': 1024 * 1024 * 1024 * 1024,
        'PB': 1024 * 1024 * 1024 * 1024 * 1024
    };

    const numValue = parseFloat(value) || 0;
    const bytes = numValue * multipliers[unit];

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">convertSize</span> = (value, unit) =&gt; {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Data size converter for file operations
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Input */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="text-white/80 text-xs font-mono mb-2 block">VALUE</label>
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                        />
                    </div>
                    <div>
                        <label className="text-white/80 text-xs font-mono mb-2 block">UNIT</label>
                        <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="w-full glass-panel rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                        >
                            {units.map(u => (
                                <option key={u} value={u} className="bg-muted">{u}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {units.map((u, idx) => {
                        const converted = bytes / multipliers[u];
                        const colorClasses = [
                            'border-primary/30 text-primary',
                            'border-fairy-blue/30 text-fairy-blue',
                            'border-fairy-teal/30 text-fairy-teal',
                            'border-fairy-purple/30 text-fairy-purple',
                            'border-fairy-light-purple/30 text-fairy-light-purple',
                            'border-secondary/30 text-secondary'
                        ];
                        return (
                            <div key={u} className={`glass-panel rounded-xl p-6 ${colorClasses[idx]} hover:bg-white/10 transition-all group cursor-pointer`}
                                onClick={() => copyToClipboard(converted.toFixed(2), u)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-white/60 text-xs font-mono">{u.toUpperCase()}</h3>
                                    {copied === u ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity" />
                                    )}
                                </div>
                                <p className="text-2xl font-bold font-mono">{converted.toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 glass-panel rounded-xl p-4 border-fairy-yellow/30">
                    <p className="text-fairy-yellow text-xs font-mono">
                        <span className="text-white/80">// TIP:</span> Click any value to copy to clipboard
                    </p>
                </div>
            </div>
        </div>
    );
};

// New Hash Generator
const HashGenerator = () => {
    const [input, setInput] = useState<string>('');
    const [md5, setMd5] = useState<string>('');
    const [sha256, setSha256] = useState<string>('');
    const [copied, setCopied] = useState<string>('');

    useEffect(() => {
        if (input) {
            generateHashes();
        } else {
            setMd5('');
            setSha256('');
        }
    }, [input]);

    const generateHashes = async () => {
        if (!input) return;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        // SHA-256
        const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
        const sha256Array = Array.from(new Uint8Array(sha256Buffer));
        const sha256Hex = sha256Array.map(b => b.toString(16).padStart(2, '0')).join('');
        setSha256(sha256Hex);

        // MD5 is not available in Web Crypto API, using a simple hash instead
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        setMd5(Math.abs(hash).toString(16).padStart(32, '0').substring(0, 32));
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(label);
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        function <span className="text-primary">generateHash</span>(text) {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Generate cryptographic hashes
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label className="text-white/80 text-xs font-mono mb-2 block">INPUT_TEXT</label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter text to hash..."
                        rows={4}
                        className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm resize-none"
                    />
                </div>

                {/* Hash Results */}
                <div className="space-y-4">
                    <div className="glass-panel rounded-xl p-6 border-primary/30 group">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-primary text-sm font-mono font-bold">SHA-256</h3>
                            <button
                                onClick={() => sha256 && copyToClipboard(sha256, 'sha256')}
                                className="p-2 hover:bg-white/10 rounded transition-all"
                            >
                                {copied === 'sha256' ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4 text-white/60" />
                                )}
                            </button>
                        </div>
                        <p className="text-white/80 font-mono text-xs break-all">
                            {sha256 || '// Hash will appear here'}
                        </p>
                    </div>

                    <div className="glass-panel rounded-xl p-6 border-fairy-blue/30 group">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-fairy-blue text-sm font-mono font-bold">MD5 (Simulated)</h3>
                            <button
                                onClick={() => md5 && copyToClipboard(md5, 'md5')}
                                className="p-2 hover:bg-white/10 rounded transition-all"
                            >
                                {copied === 'md5' ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4 text-white/60" />
                                )}
                            </button>
                        </div>
                        <p className="text-white/80 font-mono text-xs break-all">
                            {md5 || '// Hash will appear here'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 glass-panel rounded-xl p-4 border-fairy-yellow/30">
                    <p className="text-fairy-yellow text-xs font-mono leading-relaxed">
                        <span className="text-white/80">// NOTE:</span> SHA-256 uses Web Crypto API (secure).<br />
                        MD5 is simulated for demo purposes. For production, use a proper MD5 library.
                    </p>
                </div>
            </div>
        </div>
    );
};

// New Base64 Tool
const Base64Tool = () => {
    const [input, setInput] = useState<string>('');
    const [output, setOutput] = useState<string>('');
    const [mode, setMode] = useState<'encode' | 'decode'>('encode');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!input) {
            setOutput('');
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(btoa(input));
            } else {
                setOutput(atob(input));
            }
        } catch (error) {
            setOutput('// Invalid input for decoding');
        }
    }, [input, mode]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">base64</span> = {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Encode & decode Base64
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Mode Toggle */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setMode('encode')}
                        className={`flex-1 py-3 rounded-lg font-mono text-sm transition-all ${mode === 'encode'
                            ? 'bg-primary/20 text-primary border-2 border-primary/50'
                            : 'glass-panel text-white/60 hover:bg-white/10'
                            }`}
                    >
                        ENCODE
                    </button>
                    <button
                        onClick={() => setMode('decode')}
                        className={`flex-1 py-3 rounded-lg font-mono text-sm transition-all ${mode === 'decode'
                            ? 'bg-fairy-teal/20 text-fairy-teal border-2 border-fairy-teal/50'
                            : 'glass-panel text-white/60 hover:bg-white/10'
                            }`}
                    >
                        DECODE
                    </button>
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label className="text-white/80 text-xs font-mono mb-2 block">
                        {mode === 'encode' ? 'PLAIN_TEXT' : 'BASE64_TEXT'}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                        rows={6}
                        className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm resize-none"
                    />
                </div>

                {/* Output */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-white/80 text-xs font-mono">
                            {mode === 'encode' ? 'BASE64_OUTPUT' : 'DECODED_OUTPUT'}
                        </label>
                        <button
                            onClick={copyToClipboard}
                            disabled={!output}
                            className="p-2 hover:bg-white/10 rounded transition-all disabled:opacity-30"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-white/60" />
                            )}
                        </button>
                    </div>
                    <div className="glass-panel rounded-lg px-4 py-3 min-h-[150px] border-primary/30">
                        <p className="text-white/80 font-mono text-sm break-all whitespace-pre-wrap">
                            {output || '// Output will appear here'}
                        </p>
                    </div>
                </div>

                <div className="mt-6 glass-panel rounded-xl p-4 border-fairy-blue/30">
                    <p className="text-fairy-blue text-xs font-mono">
                        <span className="text-fairy-yellow">TIP:</span> Base64 is commonly used for encoding binary data in text format
                    </p>
                </div>
            </div>
        </div>
    );
};

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    dueDate: string | null;
    createdAt: number;
}

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>(() => {
        const saved = localStorage.getItem('fairyfloss-todos');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        localStorage.setItem('fairyfloss-todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = () => {
        if (!inputValue.trim()) return;

        const newTodo: Todo = {
            id: Date.now().toString(),
            text: inputValue.trim(),
            completed: false,
            dueDate: dueDate || null,
            createdAt: Date.now()
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
        setDueDate('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const isOverdue = (dateStr: string | null) => {
        if (!dateStr) return false;
        const due = new Date(dateStr);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return due < now;
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="glass-panel rounded-xl p-8">
                <div className="code-block mb-6">
                    <div className="text-white/60">
                        const <span className="text-primary">todoList</span> = {'{'}
                    </div>
                    <div className="pl-8 py-2">
                        <div className="text-fairy-yellow">
                            // Persistent tasks with reminders
                        </div>
                    </div>
                    <div className="text-white/60">{'}'}</div>
                </div>

                {/* Add Todo Input */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                            placeholder="Add a new task..."
                            className="w-full glass-panel rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm"
                        />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="glass-panel rounded-lg px-4 py-3 text-white/80 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono text-sm bg-transparent"
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
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'active', 'completed'] as const).map((f) => (
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
                                    <p className={`font-mono text-sm truncate transition-all ${todo.completed ? 'text-white/40 line-through' : 'text-white/90'
                                        }`}>
                                        {todo.text}
                                    </p>
                                    {todo.dueDate && (
                                        <div className={`flex items-center gap-1 text-xs mt-1 font-mono ${!todo.completed && isOverdue(todo.dueDate)
                                            ? 'text-destructive animate-pulse'
                                            : 'text-white/40'
                                            }`}>
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {new Date(todo.dueDate).toLocaleDateString()}
                                                {!todo.completed && isOverdue(todo.dueDate) && ' (Overdue)'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="p-2 text-white/20 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};


export default Tools;
