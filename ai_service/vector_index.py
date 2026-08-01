import numpy as np

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False

def calculate_cosine_similarity(vec1, vec2):
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(dot_product / (norm_v1 * norm_v2))

class VectorIndex:
    def __init__(self):
        self.index = None
        self.patent_mapping = [] 
        self.patent_data = {} 
        self.vectors = []

    def build_index(self, patents: list, embeddings: list):
        self.patent_mapping = [p["id"] for p in patents]
        self.patent_data = {p["id"]: p for p in patents}
        self.vectors = embeddings
        
        if len(embeddings) == 0:
            return
            
        dim = len(embeddings[0])
        np_vectors = np.array(embeddings).astype('float32')
        
        if HAS_FAISS:
            try:
                # FAISS IndexFlatIP (Inner Product) handles Cosine Similarity for L2-normalized vectors
                self.index = faiss.IndexFlatIP(dim)
                faiss.normalize_L2(np_vectors)
                self.index.add(np_vectors)
                print(f"FAISS index built successfully with {len(patents)} records.")
            except Exception as e:
                print(f"FAISS build failed: {e}. Falling back to NumPy vector search.")
                self.index = None
        else:
            print("FAISS library not found. Using NumPy cosine vector database.")

    def search(self, query_vector: list, top_k: int = 5) -> list:
        if len(self.patent_mapping) == 0:
            return []
            
        if HAS_FAISS and self.index is not None:
            try:
                np_query = np.array([query_vector]).astype('float32')
                faiss.normalize_L2(np_query)
                scores, indices = self.index.search(np_query, top_k)
                
                results = []
                for score, idx in zip(scores[0], indices[0]):
                    if idx < 0 or idx >= len(self.patent_mapping):
                        continue
                    patent_id = self.patent_mapping[idx]
                    results.append((patent_id, float(score)))
                return results
            except Exception as e:
                print(f"FAISS search failed: {e}. Falling back to NumPy search.")
        
        # NumPy fallback search
        results = []
        for patent_id, vec in zip(self.patent_mapping, self.vectors):
            score = calculate_cosine_similarity(query_vector, vec)
            results.append((patent_id, score))
            
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

vector_index = VectorIndex()
