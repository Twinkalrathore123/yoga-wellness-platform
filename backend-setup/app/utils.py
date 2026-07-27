def serialize_doc(doc: dict) -> dict:
    """MongoDB documents have `_id` as an ObjectId object, which Pydantic can't
    validate directly as a string. This converts it in place before returning
    the doc from an endpoint. Used by every router that reads from Mongo."""
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


def serialize_docs(docs: list[dict]) -> list[dict]:
    return [serialize_doc(doc) for doc in docs]
