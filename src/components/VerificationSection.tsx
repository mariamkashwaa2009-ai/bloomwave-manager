import { useState, useMemo } from "react";
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
import { ShieldCheck, Search, Sparkles } from "lucide-react";

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

const VerificationSection = () => {
  const [seed, setSeed] = useState("");
  const [waves, setWaves] = useState("");
  const [participantsText, setParticipantsText] = useState("");
  const [bloomData, setBloomData] = useState<Bloom[]>([]);
  const [results, setResults] = useState<WaveResult[] | null>(null);
  const [error, setError] = useState("");

  const wavesNum = parseInt(waves) || 0;

  const participants = useMemo(() => {
    const lines = participantsText.split("\n").map(l => l.trim()).filter(Boolean);
    return [...new Set(lines)];
  }, [participantsText]);

  const handleWavesChange = (val: string) => {
    setWaves(val);
    const n = parseInt(val) || 0;
    if (n > 0 && n !== bloomData.length) {
      setBloomData(Array.from({ length: n }, (_, i) => bloomData[i] || { name: "", difficulty: "Medium" as Difficulty }));
    }
    setResults(null);
  };

  const updateBloom = (index: number, field: keyof Bloom, value: string) => {
    setBloomData(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const verify = () => {
    setError("");
    const s = parseInt(seed.trim());
    if (!seed.trim() || isNaN(s) || s < 1) {
      setError("Please enter a valid positive seed number.");
      return;
    }
    if (wavesNum < 1) {
      setError("Enter the number of waves used.");
      return;
    }
    if (participants.length < wavesNum) {
      setError(`Need at least ${wavesNum} participants.`);
      return;
    }
    if (bloomData.some(b => !b.name.trim())) {
      setError("All bloom names are required.");
      return;
    }

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

  return (
    <section className="py-24 bg-background" id="verify">
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Verify a Distribution
            </h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Got a seed from a previous distribution? Enter it along with the original inputs to reproduce the exact same results and confirm fairness.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-xl p-8 shadow-card border border-border/50 space-y-6">
            {/* Seed input */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Verification Seed</label>
              <Input
                type="number"
                placeholder="Enter the seed number (e.g. 1234567890)"
                value={seed}
                onChange={e => { setSeed(e.target.value); setResults(null); }}
                className="font-mono text-lg"
              />
            </div>

            {/* Waves */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of Waves / Blooms</label>
              <Input
                type="number"
                min={1}
                placeholder="e.g. 5"
                value={waves}
                onChange={e => handleWavesChange(e.target.value)}
              />
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Participants (one per line)</label>
              <Textarea
                placeholder={"Alice\nBob\nCharlie\n..."}
                rows={6}
                value={participantsText}
                onChange={e => { setParticipantsText(e.target.value); setResults(null); }}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {participants.length} unique participant{participants.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Bloom names & difficulties */}
            {wavesNum > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bloom Names & Difficulties</label>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {bloomData.map((bloom, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-muted-foreground w-8 flex-shrink-0">#{i + 1}</span>
                      <Input
                        placeholder={`Goal ${i + 1}`}
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
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Verify button */}
            <Button variant="hero" className="w-full" onClick={verify}>
              <Search className="w-4 h-4" />
              Verify Distribution
            </Button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-8 space-y-4"
              >
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 text-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    Distribution verified! These results are identical to the original.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.map((res, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.4 }}
                      className="bg-card rounded-xl p-5 shadow-card border border-border/50"
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default VerificationSection;
