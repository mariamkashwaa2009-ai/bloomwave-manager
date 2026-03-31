import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Copy, RotateCcw, Check, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Difficulty = "Low" | "Medium" | "High";
interface Bloom {
  name: string;
  difficulty: Difficulty;
}
interface WaveResult {
  waveIndex: number;
  bloom: Bloom;
  participants: string[];
}

// Seeded RNG
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const difficultyWeight: Record<Difficulty, number> = { Low: 1, Medium: 2, High: 3 };
const difficultyColor: Record<Difficulty, string> = {
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-rose-100 text-rose-700 border-rose-200",
};

const ToolSection = () => {
  const [step, setStep] = useState(1);
  const [waves, setWaves] = useState("");
  const [blooms, setBlooms] = useState("");
  const [participantsText, setParticipantsText] = useState("");
  const [bloomData, setBloomData] = useState<Bloom[]>([]);
  const [results, setResults] = useState<WaveResult[]>([]);
  const [seed, setSeed] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [verifySeed, setVerifySeed] = useState("");

  const wavesNum = parseInt(waves) || 0;
  const bloomsNum = parseInt(blooms) || 0;

  const participants = useMemo(() => {
    const lines = participantsText.split("\n").map(l => l.trim()).filter(Boolean);
    return [...new Set(lines)];
  }, [participantsText]);

  const validateStep1 = useCallback(() => {
    const errs: string[] = [];
    if (wavesNum < 1) errs.push("Waves must be at least 1.");
    if (bloomsNum < 1) errs.push("Blooms must be at least 1.");
    if (wavesNum > 0 && bloomsNum > 0 && wavesNum !== bloomsNum) errs.push("Waves must equal Blooms.");
    setErrors(errs);
    return errs.length === 0;
  }, [wavesNum, bloomsNum]);

  const validateStep2 = useCallback(() => {
    const errs: string[] = [];
    if (participants.length < 1) errs.push("Enter at least one participant.");
    if (participants.length < wavesNum) errs.push(`Need at least ${wavesNum} participants (one per wave).`);
    setErrors(errs);
    return errs.length === 0;
  }, [participants, wavesNum]);

  const validateStep3 = useCallback(() => {
    const errs: string[] = [];
    bloomData.forEach((b, i) => {
      if (!b.name.trim()) errs.push(`Goal ${i + 1} name is required.`);
    });
    setErrors(errs);
    return errs.length === 0;
  }, [bloomData]);

  const goNext = () => {
    if (step === 1 && validateStep1()) {
      setBloomData(Array.from({ length: bloomsNum }, () => ({ name: "", difficulty: "Medium" as Difficulty })));
      setStep(2);
      setErrors([]);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
      setErrors([]);
    } else if (step === 3 && validateStep3()) {
      distribute();
      setStep(4);
      setErrors([]);
    }
  };

  const goBack = () => {
    setErrors([]);
    setStep(s => Math.max(1, s - 1));
  };

  const distribute = () => {
    const s = verifySeed.trim()
      ? parseInt(verifySeed.trim())
      : Math.floor(Math.random() * 2147483646) + 1;
    
    if (verifySeed.trim() && (isNaN(s) || s < 1)) {
      setErrors(["Invalid seed. Please enter a positive number."]);
      return;
    }
    
    setSeed(s);

    const shuffled = seededShuffle(participants, s);

    const indexed = bloomData.map((b, i) => ({ ...b, origIndex: i }));
    indexed.sort((a, b) => difficultyWeight[b.difficulty] - difficultyWeight[a.difficulty]);

    const n = shuffled.length;
    const w = wavesNum;
    const baseSize = Math.floor(n / w);
    const remainder = n % w;

    const groupSizes = indexed.map((_, i) => baseSize + (i < remainder ? 1 : 0));

    let offset = 0;
    const res: WaveResult[] = indexed.map((bloom, i) => {
      const size = groupSizes[i];
      const members = shuffled.slice(offset, offset + size);
      offset += size;
      return {
        waveIndex: i + 1,
        bloom: { name: bloom.name, difficulty: bloom.difficulty },
        participants: members,
      };
    });

    setResults(res);
  };

  const resetTool = () => {
    setStep(1);
    setWaves("");
    setBlooms("");
    setParticipantsText("");
    setBloomData([]);
    setResults([]);
    setSeed(0);
    setErrors([]);
    setVerifySeed("");
  };

  const copySeed = () => {
    navigator.clipboard.writeText(String(seed));
    toast.success("Seed copied to clipboard!");
  };

  const updateBloom = (index: number, field: keyof Bloom, value: string) => {
    setBloomData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const slideVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <section className="py-24 bg-secondary/20" id="tool">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Interactive Tool
          </h2>
          <p className="text-muted-foreground text-lg">
            Build your wave structure right here.
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s <= step ? "gradient-bg text-primary-foreground shadow-glow" : "bg-muted text-muted-foreground"
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {s === 1 ? "Framework" : s === 2 ? "Participants" : s === 3 ? "Weights" : "Results"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-bg rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / 3) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Errors */}
        <AnimatePresence>
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-6"
            >
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                {errors.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {e}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-card rounded-xl p-8 shadow-card border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-6">Define Your Framework</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Number of Waves</label>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        placeholder="e.g. 5"
                        value={waves}
                        onChange={e => setWaves(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Groups/phases to split into</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Number of Blooms</label>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        placeholder="e.g. 5"
                        value={blooms}
                        onChange={e => setBlooms(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Goals to assign (must equal Waves)</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-card rounded-xl p-8 shadow-card border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Add Participants</h3>
                  <p className="text-sm text-muted-foreground mb-6">One name per line. Duplicates are removed automatically.</p>
                  <Textarea
                    placeholder={"Alice\nBob\nCharlie\n..."}
                    rows={10}
                    value={participantsText}
                    onChange={e => setParticipantsText(e.target.value)}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {participants.length} unique participant{participants.length !== 1 ? "s" : ""} detected
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-card rounded-xl p-8 shadow-card border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Set Bloom Weights</h3>
                  <p className="text-sm text-muted-foreground mb-6">Name each goal and choose its difficulty level.</p>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {bloomData.map((bloom, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted-foreground w-8 flex-shrink-0">#{i + 1}</span>
                        <Input
                          placeholder={`Goal ${i + 1} name`}
                          value={bloom.name}
                          onChange={e => updateBloom(i, "name", e.target.value)}
                          className="flex-1"
                        />
                        <Select value={bloom.difficulty} onValueChange={v => updateBloom(i, "difficulty", v)}>
                          <SelectTrigger className="w-32 flex-shrink-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="s4" variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="space-y-6">
                  {/* Seed */}
                  <div className={`bg-card rounded-xl p-6 shadow-card border ${verifySeed.trim() ? "border-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-border/50"} flex items-center justify-between`}>
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-2">
                        {verifySeed.trim() ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-600" />
                            Verified with Seed
                          </>
                        ) : (
                          "Fairness Verification Seed"
                        )}
                      </p>
                      <p className="text-2xl font-mono font-bold gradient-text">{seed}</p>
                      {verifySeed.trim() && (
                        <p className="text-xs text-emerald-600 mt-1">
                          This distribution was reproduced using the provided seed — results are identical.
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={copySeed}>
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>

                  {/* Result cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((res, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                        className="bg-card rounded-xl p-5 shadow-card border border-border/50 hover:shadow-elevated transition-shadow duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                              Wave {res.waveIndex}
                            </span>
                          </div>
                          <Badge variant="outline" className={`text-xs ${difficultyColor[res.bloom.difficulty]}`}>
                            {res.bloom.difficulty}
                          </Badge>
                        </div>
                        <h4 className="text-base font-semibold text-foreground mb-3">{res.bloom.name}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {res.participants.map((p, j) => (
                            <span key={j} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md">
                              {p}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {res.participants.length} participant{res.participants.length !== 1 ? "s" : ""}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 && step < 4 ? (
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button variant="hero" onClick={goNext}>
                {step === 3 ? "Generate Results" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={resetTool}>
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolSection;
