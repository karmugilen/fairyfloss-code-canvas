
import { useState, useEffect } from "react";
import { Heart, Calendar, Gift, Camera, Star, Sparkles, Music, Coffee, Utensils, Film, MapPin, Mail, Quote, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const MyLove = () => {
    const [activeTab, setActiveTab] = useState("journey");

    return (
        <div className="min-h-screen bg-background text-foreground font-mono selection:bg-primary/30">
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

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <div className="code-block mb-6">
                        <div className="text-white/60">
                            const <span className="text-primary">myLove</span> = {'{'}
                        </div>
                        <div className="pl-8 py-4">
                            <div className="text-fairy-yellow">
                                // A collection of our memories
                            </div>
                        </div>
                        <div className="text-white/60">{'}'}</div>
                    </div>
                </div>

                {/* Daily Affirmation */}
                <DailyAffirmation />

                {/* Main Content */}
                <Tabs defaultValue="journey" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-center mb-12">
                        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-lg backdrop-blur-md">
                            <TabsTrigger
                                value="journey"
                                className="rounded-md px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all flex items-center gap-2 font-mono text-xs"
                            >
                                <Calendar className="w-4 h-4" /> Journey
                            </TabsTrigger>
                            <TabsTrigger
                                value="letters"
                                className="rounded-md px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all flex items-center gap-2 font-mono text-xs"
                            >
                                <Mail className="w-4 h-4" /> Letters
                            </TabsTrigger>
                            <TabsTrigger
                                value="reasons"
                                className="rounded-md px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all flex items-center gap-2 font-mono text-xs"
                            >
                                <Star className="w-4 h-4" /> Reasons
                            </TabsTrigger>
                            <TabsTrigger
                                value="dates"
                                className="rounded-md px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all flex items-center gap-2 font-mono text-xs"
                            >
                                <Sparkles className="w-4 h-4" /> Date Ideas
                            </TabsTrigger>
                            <TabsTrigger
                                value="gallery"
                                className="rounded-md px-6 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary transition-all flex items-center gap-2 font-mono text-xs"
                            >
                                <Camera className="w-4 h-4" /> Gallery
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="min-h-[400px]">
                        <TabsContent value="journey" className="animate-fade-in focus-visible:outline-none">
                            <JourneyCounter />
                        </TabsContent>

                        <TabsContent value="letters" className="animate-fade-in focus-visible:outline-none">
                            <OpenWhenLetters />
                        </TabsContent>

                        <TabsContent value="reasons" className="animate-fade-in focus-visible:outline-none">
                            <ReasonsList />
                        </TabsContent>

                        <TabsContent value="dates" className="animate-fade-in focus-visible:outline-none">
                            <DateIdeas />
                        </TabsContent>

                        <TabsContent value="gallery" className="animate-fade-in focus-visible:outline-none">
                            <Gallery />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

// --- Components ---

const JourneyCounter = () => {
    // Example start date - you can change this
    const startDate = new Date("2023-01-01");
    const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - startDate.getTime();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeTogether({ days, hours, minutes });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full text-center mb-8">
                <div className="inline-block glass-panel px-8 py-6 rounded-2xl border-primary/20 bg-primary/5">
                    <p className="text-primary/60 uppercase tracking-widest text-xs mb-2 font-mono">We have been together for</p>
                    <div className="text-5xl md:text-7xl font-bold text-white font-mono tracking-tighter">
                        {timeTogether.days}
                        <span className="text-2xl text-primary ml-2">days</span>
                    </div>
                    <div className="flex justify-center gap-4 mt-4 text-sm text-white/40 font-mono">
                        <span>{timeTogether.hours} hours</span>
                        <span>•</span>
                        <span>{timeTogether.minutes} mins</span>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            {[
                { date: "2023-01-01", title: "First Met", icon: <MapPin className="w-4 h-4" /> },
                { date: "2023-02-14", title: "First Date", icon: <Coffee className="w-4 h-4" /> },
                { date: "2023-06-01", title: "First Trip", icon: <Camera className="w-4 h-4" /> },
            ].map((milestone, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl border-white/5 hover:border-primary/30 transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            {milestone.icon}
                        </div>
                        <span className="text-xs font-mono text-white/40">{milestone.date}</span>
                    </div>
                    <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors font-mono">{milestone.title}</h3>
                </div>
            ))}
        </div>
    );
};

const ReasonsList = () => {
    const reasons = [
        "Your smile lights up my entire world.",
        "The way you laugh at my terrible jokes.",
        "Your kindness towards everyone you meet.",
        "How you make even boring days feel like adventures.",
        "The way you look at me.",
        "Your unwavering support for my dreams.",
        "How safe I feel when I'm with you.",
        "Your incredible cooking (even when it burns!).",
        "The way you scrunch your nose when you're thinking.",
        "Because you are simply you."
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {reasons.map((reason, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl border-white/5 flex items-start gap-4 hover:bg-primary/5 transition-all">
                    <div className="mt-1">
                        <Heart className="w-4 h-4 text-primary fill-primary" />
                    </div>
                    <p className="text-white/80 leading-relaxed font-mono text-sm">{reason}</p>
                </div>
            ))}
        </div>
    );
};

const DateIdeas = () => {
    const [idea, setIdea] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const ideas = [
        { text: "Homemade Pizza Night", icon: <Utensils /> },
        { text: "Stargazing Picnic", icon: <Star /> },
        { text: "Movie Marathon Fort", icon: <Film /> },
        { text: "Sunset Beach Walk", icon: <MapPin /> },
        { text: "Karaoke Night at Home", icon: <Music /> },
        { text: "Cook a New Cuisine", icon: <Utensils /> },
        { text: "Visit a Museum", icon: <Camera /> },
        { text: "Board Game Tournament", icon: <Gift /> },
    ];

    const spin = () => {
        setIsSpinning(true);
        let counter = 0;
        const interval = setInterval(() => {
            setIdea(ideas[Math.floor(Math.random() * ideas.length)].text);
            counter++;
            if (counter > 20) {
                clearInterval(interval);
                setIsSpinning(false);
            }
        }, 100);
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
                <div className={`absolute inset-0 border-4 border-primary/20 rounded-full ${isSpinning ? 'animate-spin' : ''}`} style={{ borderTopColor: 'var(--primary)' }} />
                <div className="text-center p-6">
                    {idea ? (
                        <div className="animate-fade-in">
                            <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2 font-mono">{idea}</h3>
                            <p className="text-white/40 text-xs font-mono">Let's do this!</p>
                        </div>
                    ) : (
                        <div className="text-white/40">
                            <Gift className="w-8 h-8 mx-auto mb-4 opacity-50" />
                            <p className="font-mono text-sm">Tap to decide our next date</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={spin}
                disabled={isSpinning}
                className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-lg text-black font-bold tracking-wide transition-all disabled:opacity-50 font-mono"
            >
                {isSpinning ? "CHOOSING..." : "PICK A DATE IDEA"}
            </button>
        </div>
    );
};

const Gallery = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square glass-panel rounded-xl border-white/5 flex items-center justify-center group overflow-hidden relative cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-end p-4">
                        <p className="text-white font-medium">Memory #{i}</p>
                    </div>
                    <Camera className="w-8 h-8 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                    {/* Placeholder for actual images */}
                    {/* <img src={`/path/to/image${i}.jpg`} alt="" className="absolute inset-0 w-full h-full object-cover" /> */}
                </div>
            ))}
        </div>
    );
};

export default MyLove;

const DailyAffirmation = () => {
    const [quote, setQuote] = useState("");

    useEffect(() => {
        const quotes = [
            "I love you more than yesterday, but less than tomorrow.",
            "You are my favorite notification.",
            "Every love story is beautiful, but ours is my favorite.",
            "You make my heart smile.",
            "Home is wherever I'm with you.",
            "You are the best thing that's ever been mine.",
            "I look at you and see the rest of my life in front of my eyes.",
            "My favorite place is inside your hug."
        ];
        setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    return (
        <div className="mb-12 text-center animate-fade-in delay-100">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-primary/80 text-xs font-mono">
                <Quote className="w-3 h-3" />
                "{quote}"
            </div>
        </div>
    );
};

const OpenWhenLetters = () => {
    const [openLetter, setOpenLetter] = useState<string | null>(null);

    const letters = [
        {
            id: "sad",
            title: "Open when you're sad",
            content: "Remember that this feeling is temporary. I am here for you, always. Close your eyes and imagine my arms around you. You are so loved, so strong, and you will get through this. Call me, I want to hear your voice."
        },
        {
            id: "miss",
            title: "Open when you miss me",
            content: "I miss you too, probably more! Look at our photos, remember our last hug. We are under the same sky, dreaming the same dreams. Soon we will be together again, and I won't let go."
        },
        {
            id: "mad",
            title: "Open when you're mad at me",
            content: "I'm sorry. Even if I don't know why yet, I hate that we're fighting. I love you more than any argument. Let's take a breath, talk it out, and fix this. You are more important to me than being right."
        },
        {
            id: "happy",
            title: "Open when you're happy",
            content: "Yay! I love seeing you happy! Your smile is my favorite thing in the world. Capture this moment, remember how good it feels. I hope I'm part of the reason you're smiling today!"
        },
        {
            id: "doubt",
            title: "Open when you doubt yourself",
            content: "Stop right there. You are incredible. You are capable, smart, and talented. Look at everything you've achieved. I believe in you so much, even when you don't. You've got this!"
        },
        {
            id: "sleep",
            title: "Open when you can't sleep",
            content: "Close your eyes and count the reasons I love you (you'll be counting forever!). Relax your shoulders, take a deep breath. I'll meet you in our dreams. Goodnight, my love."
        }
    ];

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {letters.map((letter) => (
                    <button
                        key={letter.id}
                        onClick={() => setOpenLetter(letter.id)}
                        className="group relative aspect-[4/3] perspective-1000 text-left focus:outline-none"
                    >
                        <div className="absolute inset-0 bg-[#1a1b26] rounded-xl shadow-xl transform transition-transform group-hover:-translate-y-2 duration-300 flex flex-col items-center justify-center border-2 border-primary/20 p-6">
                            {/* Envelope Flap */}
                            <div className="absolute top-0 left-0 right-0 h-1/2 bg-primary/5 clip-path-polygon-[0_0,50%_100%,100%_0] rounded-t-xl opacity-50" />

                            <Heart className="w-8 h-8 text-primary fill-primary mb-4 z-10" />
                            <h3 className="font-mono text-white/80 text-sm font-medium text-center z-10">
                                {letter.title}
                            </h3>
                            <div className="absolute bottom-4 text-[10px] text-white/40 uppercase tracking-widest font-mono">
                                Tap to open
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Letter Modal */}
            {openLetter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-[#1a1b26] text-white rounded-xl border border-white/10 shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setOpenLetter(null)}
                            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8">
                            <Heart className="w-8 h-8 text-primary fill-primary mx-auto mb-4" />
                            <h3 className="font-mono text-xl text-white">
                                {letters.find(l => l.id === openLetter)?.title}
                            </h3>
                        </div>

                        <div className="font-mono text-sm leading-relaxed text-white/80 space-y-4">
                            <p>{letters.find(l => l.id === openLetter)?.content}</p>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="font-mono text-lg text-primary transform -rotate-2">
                                Love you always x
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
