
// A simplified list of common English words (representing a subset of Oxford 3000/5000)
// Words NOT in this list will be treated as "learning opportunities" or "rare".
const COMMON_WORDS = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "was", "were", "has", "had", "been", "am", "did", "does", "doing", "saying", "going", "getting", "making", "taking", "looking", "coming", "thinking", "giving",
  "working", "using", "wanting", "having", "being", "seen", "gone", "got", "made", "known", "taken", "thought", "given", "worked", "used", "wanted",
  "very", "really", "much", "many", "great", "same", "own", "should", "tell", "ask", "why", "where", "find", "need", "try", "let", "feel", "big", "high", "long",
  "small", "large", "right", "left", "down", "still", "place", "life", "world", "hand", "part", "child", "eye", "woman", "man", "thing", "student", "group", "problem", "country",
  "fact", "example", "point", "government", "company", "number", "case", "week", "system", "program", "question", "work", "night", "mr", "point", "home", "water", "room", "mother",
  "area", "money", "story", "young", "fact", "month", "lot", "right", "study", "book", "eye", "job", "word", "business", "issue", "side", "kind", "head", "house", "service",
  "friend", "father", "power", "hour", "game", "line", "end", "member", "law", "car", "city", "community", "name", "president", "team", "minute", "idea", "kid", "body",
  "information", "back", "parent", "face", "others", "level", "office", "door", "health", "person", "art", "war", "history", "party", "result", "change", "morning", "reason", "research",
  "girl", "guy", "food", "moment", "air", "teacher", "force", "education", "foot", "boy", "age", "policy", "process", "music", "market", "sense", "nation", "plan", "college",
  "interest", "death", "experience", "effect", "use", "class", "control", "care", "field", "development", "role", "effort", "rate", "heart", "drug", "show", "leader", "light",
  "voice", "wife", "police", "mind", "price", "report", "decision", "son", "view", "relationship", "town", "road", "arm", "difference", "value", "building", "action", "model",
  "season", "society", "tax", "director", "position", "player", "record", "paper", "space", "ground", "form", "event", "official", "matter", "center", "couple", "site", "project",
  "activity", "star", "table", "need", "court", "american", "oil", "situation", "cost", "industry", "figure", "street", "image", "itself", "phone", "data", "picture", "practice",
  "piece", "land", "product", "doctor", "wall", "patient", "worker", "news", "test", "movie", "north", "love", "support", "technology", "step", "baby", "computer", "type",
  "attention", "film", "republican", "tree", "source", "red", "nearly", "organization", "choose", "cause", "hair", "century", "evidence", "window", "difficult", "listen", "soon",
  "culture", "billion", "chance", "brother", "energy", "period", "summer", "realize", "hundred", "available", "plant", "likely", "opportunity", "term", "short", "letter", "condition",
  "choice", "single", "rule", "daughter", "administration", "south", "husband", "congress", "floor", "campaign", "material", "population", "economy", "medical", "hospital", "church",
  "close", "thousand", "risk", "current", "fire", "future", "wrong", "involve", "defense", "anyone", "increase", "security", "bank", "myself", "certainly", "west", "sport", "board",
  "seek", "per", "subject", "officer", "private", "rest", "behavior", "deal", "performance", "fight", "throw", "top", "past", "goal", "second", "bed", "order", "author", "fill",
  "represent", "focus", "foreign", "drop", "blood", "upon", "agency", "push", "nature", "color", "recently", "store", "reduce", "sound", "note", "fine", "near", "movement", "page",
  "enter", "share", "common", "poor", "natural", "race", "concern", "series", "significant", "similar", "hot", "language", "usually", "response", "dead", "rise", "animal", "factor",
  "decade", "article", "shoot", "east", "save", "seven", "artist", "away", "scene", "stock", "career", "despite", "central", "eight", "thus", "treatment", "beyond", "happy", "exactly",
  "protect", "approach", "lie", "size", "dog", "fund", "serious", "occur", "media", "ready", "sign", "thought", "list", "individual", "simple", "quality", "pressure", "accept", "answer",
  "hard", "resource", "identify", "meeting", "determine", "prepare", "disease", "whatever", "success", "argue", "cup", "particularly", "amount", "ability", "staff", "recognize",
  "indicate", "character", "growth", "loss", "degree", "wonder", "attack", "herself", "region", "television", "box", "training", "pretty", "trade", "deal", "election", "everybody",
  "physical", "lay", "general", "feeling", "standard", "bill", "message", "fail", "outside", "arrive", "analysis", "benefit", "sex", "forward", "lawyer", "present", "section",
  "environmental", "glass", "skill", "sister", "pm", "professor", "operation", "financial", "crime", "stage", "ok", "compare", "authority", "miss", "design", "sort", "one", "act",
  "ten", "knowledge", "gun", "station", "blue", "state", "strategy", "little", "clearly", "discuss", "indeed", "force", "truth", "song", "example", "democratic", "check", "environment",
  "leg", "dark", "various", "rather", "laugh", "guess", "executive", "set", "study", "prove", "hang", "entire", "rock", "design", "enough", "forget", "since", "claim", "note", "remove",
  "manager", "help", "close", "sound", "enjoy", "network", "legal", "religious", "cold", "form", "final", "main", "science", "green", "memory", "card", "above", "seat", "cell",
  "establish", "nice", "trial", "expert", "spring", "firm", "democrat", "radio", "visit", "management", "care", "avoid", "imagine", "tonight", "huge", "ball", "finish", "yourself",
  "talk", "theory", "impact", "respond", "statement", "maintain", "charge", "popular", "traditional", "onto", "reveal", "direction", "weapon", "employee", "cultural", "contain",
  "peace", "head", "control", "base", "pain", "apply", "play", "measure", "wide", "shake", "fly", "interview", "manage", "chair", "fish", "particular", "camera", "structure",
  "politics", "perform", "bit", "weight", "suddenly", "discover", "candidate", "top", "production", "treat", "trip", "evening", "affect", "inside", "conference", "unit", "best",
  "style", "adult", "worry", "range", "mention", "deep", "edge", "specific", "writer", "trouble", "necessary", "throughout", "challenge", "fear", "shoulder", "institution", "middle",
  "sea", "dream", "bar", "beautiful", "property", "instead", "improve", "stuff", "detail", "method", "somebody", "magazine", "hotel", "soldier", "reflect", "heavy", "sexual", "bag",
  "heat", "marriage", "tough", "sing", "surface", "purpose", "exist", "pattern", "whom", "skin", "agent", "owner", "machine", "gas", "down", "ahead", "generation", "commercial",
  "address", "cancer", "item", "reality", "coach", "step", "mrs", "yard", "beat", "violence", "total", "tend", "investment", "discussion", "finger", "garden", "notice", "collection",
  "modern", "task", "partner", "positive", "civil", "kitchen", "consumer", "shot", "budget", "wish", "painting", "scientist", "safe", "agreement", "capital", "mouth", "victim",
  "newspaper", "threat", "responsibility", "smile", "attorney", "score", "account", "interesting", "audience", "rich", "dinner", "vote", "western", "relate", "travel", "debate",
  "prevent", "citizen", "majority", "none", "front", "born", "admit", "senior", "assume", "wind", "key", "professional", "mission", "fast", "alone", "customer", "suffer", "speech",
  "successful", "option", "participant", "southern", "fresh", "eventually", "forest", "video", "global", "senate", "reform", "access", "restaurant", "judge", "publish", "cost",
  "relation", "like", "release", "own", "bird", "opinion", "credit", "critical", "corner", "concerned", "recall", "version", "stare", "safety", "effective", "neighborhood", "original",
  "act", "troop", "income", "directly", "hurt", "species", "immediately", "track", "basic", "strike", "hope", "sky", "freedom", "plane", "object", "nine", "refer", "concept", "client",
  "conversation", "variety", "turn", "lesson", "master", "app", "context", "prefix", "suffix", "verb", "noun", "adjective", "adverb"
]);

// Simple basic sanitization to normalize words
const sanitizeWord = (word: string): string => {
    return word.toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
};

export const vocabularyService = {
    /**
     * Checks if a word is considered "rare" or "difficult" based on the exclusion list.
     * If the word is NOT in the common words list, it returns true.
     */
    isRareWord: (word: string): boolean => {
        const cleanWord = sanitizeWord(word);
        // If empty after cleaning or is a number, ignore
        if (!cleanWord || !isNaN(Number(cleanWord)) || cleanWord.length <= 2) {
            return false;
        }
        return !COMMON_WORDS.has(cleanWord);
    },

    /**
     * Takes a raw word and returns a clean version for display in definitions
     */
    cleanWord: (word: string): string => {
        return sanitizeWord(word);
    }
};
