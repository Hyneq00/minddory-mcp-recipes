# 05. Mark a word you turned out to know

**Recorded 2026-09-07.** Raw JSON: [`../transcripts/2026-09-07-mark-demonstrated.json`](../transcripts/2026-09-07-mark-demonstrated.json)

A card app only ever finds out what you know when it asks you. A conversation is full of evidence it never gets to see: you used the word correctly, unprompted, in a sentence about something else. `mark_demonstrated` is how that evidence reaches the deck.

## Prompt

Usually implicit, from the same setup line as recipe 01. To be explicit:

```
I clearly know "brittle" already, stop drilling me on it.
```

## The card before

```json
{
  "word": "brittle",
  "translation": "křehký, lámavý",
  "mastery": "new",
  "next_review_at": "2026-09-07T15:39:41.828Z",
  "history": [
    { "answer": "read_in_context", "at": "2026-09-07T15:39:41.828Z" }
  ]
}
```

Captured twenty-six seconds earlier in recipe 01, one event in its history, due now.

## The call

```json
{
  "word": "brittle",
  "lang": "en",
  "confidence": "high",
  "source": "claude_mcp",
  "context": "Old plastic goes brittle and snaps instead of bending."
}
```

`confidence` is required and takes `high`, `medium` or `low`. The distinction is real: using a word correctly in your own sentence is `high`, recognising it when the assistant used it first is `medium` at best. A model that logs everything as `high` is worse than useless, because it will push words out of your queue that you cannot actually produce.

## What came back

```json
{
  "ok": true,
  "data": {
    "card_id": 25395,
    "ease_factor": 2.8,
    "next_review_at": "2026-09-08T15:40:07.396Z",
    "lang": "en",
    "lang_defaulted": false,
    "note": null
  }
}
```

The card was due at 15:39:41 on the 7th. It is now due at 15:40:07 on the 8th. One demonstration moved it out of today and into tomorrow, and it did that in the twenty-six seconds between the two calls.

That is what "further out" means concretely, and it is worth saying plainly rather than dressing it up: one signal, one modest step. The card did not vanish and it did not get marked mastered. Words leave the rotation by being answered easily twice in the app, not by an assistant vouching for you in a chat.

## The mirror image

```json
{ "word": "brittle", "lang": "en", "source": "claude_mcp", "context": "..." }
```

`mark_struggled` takes the same shape without `confidence`, and pulls the card back toward the front instead. Use it when you get a word wrong during recipe 02. Both tools write an answer row even when no flashcard exists for the word, so the signal is not lost on something you have never formally added.

## Reading the write back

Nothing here happens invisibly. `get_recent_activity` returned this event as id 12266, `answer: "demonstrated"`, `confidence: "high"`, with the sentence attached, alongside every other write in this repo. See [`../transcripts/2026-09-07-get-recent-activity.json`](../transcripts/2026-09-07-get-recent-activity.json).
