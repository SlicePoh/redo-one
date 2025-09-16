from sentence_transformers import SentenceTransformer # type: ignore
import psycopg2 # type: ignore

embedder = SentenceTransformer("all-MiniLM-L6-v2")

def insert_knowledge(texts):
    conn = psycopg2.connect("postgresql://user:pass@db:5432/postgres")
    cur = conn.cursor()
    for text in texts:
        vec = embedder.encode(text).tolist()
        cur.execute(
            "insert into quest_knowledge (content, embedding) values (%s, %s)",
            (text, vec)
        )
    conn.commit()
    conn.close()

def retrieve_context(query_text, top_k=5):
    conn = psycopg2.connect("postgresql://user:pass@db:5432/postgres")
    cur = conn.cursor()
    query_vec = embedder.encode(query_text).tolist()
    cur.execute(
        "select content from quest_knowledge order by embedding <-> %s limit %s",
        (query_vec, top_k)
    )
    rows = cur.fetchall()
    conn.close()
    return [row[0] for row in rows]
