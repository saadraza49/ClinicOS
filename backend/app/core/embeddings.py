from fastembed import TextEmbedding
from typing import List

_embedding_model = None

def get_embedding_model() -> TextEmbedding:
    global _embedding_model
    if _embedding_model is None:
        # FastEmbed uses ONNX runtime for ultra-fast, zero-PyTorch 384-dim embeddings
        _embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _embedding_model

def get_embedding(text: str) -> List[float]:
    """
    Generate a 384-dimensional embedding vector for the given text.
    """
    model = get_embedding_model()
    cleaned_text = text.replace("\n", " ").strip()
    embeddings = list(model.embed([cleaned_text]))
    return embeddings[0].tolist()

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate 384-dimensional embedding vectors for multiple texts.
    """
    model = get_embedding_model()
    cleaned_texts = [t.replace("\n", " ").strip() for t in texts]
    embeddings = list(model.embed(cleaned_texts))
    return [emb.tolist() for emb in embeddings]

