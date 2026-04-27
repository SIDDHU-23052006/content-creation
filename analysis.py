import re
from collections import Counter

# Basic stop words for keyword extraction
STOP_WORDS = {
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", 
    "he", "him", "his", "she", "her", "hers", "it", "its", "they", "them", "their", 
    "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", 
    "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", 
    "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", 
    "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", 
    "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", 
    "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", 
    "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", 
    "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", 
    "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
}

POSITIVE_WORDS = {"good", "great", "excellent", "amazing", "awesome", "perfect", "love", "best", "happy", "success", "innovative", "effective", "valuable"}
NEGATIVE_WORDS = {"bad", "terrible", "awful", "worst", "hate", "poor", "fail", "error", "wrong", "difficult", "hard", "issue"}

def analyze_content(text):
    if not text:
        text = ""
        
    words = text.split()
    word_count = len(words)
    
    # Sentence count
    sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    sentence_count = len(sentences)
    
    # Readability heuristic
    readability = min(100, int((sentence_count / max(word_count, 1)) * 1000))
    if readability == 0 and word_count > 0:
        readability = 50

    # Basic Sentiment
    lower_words = re.findall(r'\b\w+\b', text.lower())
    pos_count = sum(1 for w in lower_words if w in POSITIVE_WORDS)
    neg_count = sum(1 for w in lower_words if w in NEGATIVE_WORDS)
    
    sentiment_score = 0
    if pos_count > neg_count:
        sentiment_score = min(1.0, (pos_count - neg_count) / max(len(lower_words), 1) * 10)
        sentiment = "Positive"
    elif neg_count > pos_count:
        sentiment_score = max(-1.0, (pos_count - neg_count) / max(len(lower_words), 1) * 10)
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    # Keywords
    valid_tokens = [w for w in lower_words if w.isalpha() and w not in STOP_WORDS]
    freq = Counter(valid_tokens).most_common(5)
    keywords = [
        {"keyword": k, "density": round((v / max(len(valid_tokens), 1)) * 100, 2)}
        for k, v in freq
    ]

    # Engagement heuristic
    engagement = min(100, int(
        (abs(sentiment_score) + 1) * 40 + min(word_count, 300) / 6
    ))

    # Suggestions
    suggestions = []
    if readability < 60:
        suggestions.append("Use shorter sentences for better readability.")
    if sentiment == "Neutral":
        suggestions.append("Add emotionally engaging words.")
    if engagement < 60:
        suggestions.append("Include a call-to-action or storytelling elements.")
    if not suggestions:
        suggestions.append("Great job! Your content is highly engaging.")

    return {
        "metrics": {
            "readability": readability,
            "sentiment": {
                "label": sentiment,
                "score": sentiment_score
            },
            "keywords": keywords,
            "engagement": engagement
        },
        "suggestions": suggestions
    }
