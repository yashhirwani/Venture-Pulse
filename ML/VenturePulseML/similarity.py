import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DATA_PATH = "data/startup_similarity_clean.csv"

class SimilarityEngine:
    def __init__(self, data_path=DATA_PATH):
        print("Loading startup similarity data...")
        self.df = pd.read_csv(data_path)

        # Combine text fields for better semantic meaning
        self.df['text_for_embedding'] = (
            self.df['name'].fillna('') + " " +
            self.df['category_list'].fillna('') + " " +
            self.df['domain_clean'].fillna('')
        )

        print(f"Loaded {len(self.df)} startups for similarity search")

        # Load embedding model
        print("Loading embedding model...")
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

        # Generate embeddings for all startups (ONCE)
        print("Generating embeddings for startups (this may take 1–2 minutes)...")
        self.startup_embeddings = self.model.encode(
            self.df['text_for_embedding'].tolist(),
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        print("✅ Embeddings generated")

    def find_similar_startups(self, user_idea_text, top_n=5):
        """
        Given a user startup idea, return top N most similar startups.
        """

        # Encode user idea
        user_embedding = self.model.encode(
            [user_idea_text],
            convert_to_numpy=True,
            normalize_embeddings=True
        )

        # Compute cosine similarity
        similarities = cosine_similarity(user_embedding, self.startup_embeddings)[0]

        # Get top N indices
        top_indices = np.argsort(similarities)[::-1][:top_n]

        results = []
        for idx in top_indices:
            row = self.df.iloc[idx]
            results.append({
                "startup_name": row['name'],
                "category_list": row['category_list'],
                "domain": row['domain_clean'],
                "similarity_score": float(similarities[idx])
            })

        return results


# -----------------------------
# Manual Test (run this file directly)
# -----------------------------
if __name__ == "__main__":
    engine = SimilarityEngine()

    test_idea = "AI tool for automating resume screening for HR teams"

    print("\nUser Idea:", test_idea)
    print("\nTop Similar Startups:\n")

    similar = engine.find_similar_startups(test_idea, top_n=5)

    for i, s in enumerate(similar, 1):
        print(f"{i}. {s['startup_name']} | {s['domain']} | Score: {s['similarity_score']:.3f}")
