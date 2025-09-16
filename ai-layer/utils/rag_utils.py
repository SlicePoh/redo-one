import os
import psycopg2
from sentence_transformers import SentenceTransformer  # type: ignore

embedder = SentenceTransformer("all-MiniLM-L6-v2")
DATABASE_URL = os.getenv("DATABASE_URL")

def get_conn():
    return psycopg2.connect(DATABASE_URL, sslmode="require")

def insert_knowledge(texts):
    conn = get_conn()
    cur = conn.cursor()
    for text in texts:
        vec = embedder.encode(text).tolist()
        vec_str = "[" + ",".join(str(x) for x in vec) + "]"
        cur.execute(
            "insert into quest_knowledge (content, embedding) values (%s, %s::vector)",
            (text, vec_str)
        )
    conn.commit()
    conn.close()

def retrieve_context(query_text, top_k=5):
    conn = get_conn()
    cur = conn.cursor()
    query_vec = embedder.encode(query_text).tolist()
    query_vec_str = "[" + ",".join(str(x) for x in query_vec) + "]"
    cur.execute(
        "select content from quest_knowledge order by embedding <-> %s::vector limit %s",
        (query_vec_str, top_k)
    )
    rows = cur.fetchall()
    conn.close()
    return [row[0] for row in rows]

