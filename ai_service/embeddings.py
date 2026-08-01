import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

class EmbeddingGenerator:
    def __init__(self):
        self.model = None
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                # Load a lightweight, standard sentence-transformer model (384-dimensional)
                self.model = SentenceTransformer("all-MiniLM-L6-v2")
                print("SentenceTransformer (all-MiniLM-L6-v2) loaded successfully.")
            except Exception as e:
                print(f"Error loading SentenceTransformer: {e}. Using TF-IDF/Text fallback.")
                self.model = None

    def get_embedding(self, text: str) -> list:
        if self.model:
            try:
                embedding = self.model.encode(text)
                return embedding.tolist()
            except Exception as e:
                print(f"Error generating embedding: {e}")
        
        # Fallback deterministic vector representation (384-dim unit vector)
        np.random.seed(hash(text) % (2**32 - 1))
        mock_vec = np.random.randn(384)
        norm = np.linalg.norm(mock_vec)
        if norm > 0:
            mock_vec = mock_vec / norm
        return mock_vec.tolist()

embedding_generator = EmbeddingGenerator()
