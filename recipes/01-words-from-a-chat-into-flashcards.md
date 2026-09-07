# 01. Words from a chat into flashcards

**Recorded 2026-09-07 against `https://api.minddory.com/v1/brain/mcp`.**
Raw JSON: [`../transcripts/2026-09-07-capture-word.json`](../transcripts/2026-09-07-capture-word.json)

The usual way to get vocabulary out of an AI conversation and into a card app is to keep a second window open, paste words across, and clean them up later. That works for about four days. This is the version where the words never leave the conversation in the first place.

## Prompt

```
Let's talk about central banking in English. I am around B2.
Capture anything I probably do not know yet.
```

## What the assistant sends

One call, four words, each with a gloss in your own language and the sentence it appeared in:

```json
{
  "lang": "en",
  "source_lang": "cs",
  "words": [
    { "word": "curtail",   "gloss": "omezit, zkrátit",       "context": "The central bank moved to curtail lending before the housing market overheated." },
    { "word": "windfall",  "gloss": "nečekaný zisk",          "context": "The tax refund was a windfall nobody had budgeted for." },
    { "word": "attrition", "gloss": "úbytek, opotřebení",     "context": "The team shrank by attrition rather than by layoffs." },
    { "word": "brittle",   "gloss": "křehký, lámavý",         "context": "Old plastic goes brittle and snaps instead of bending." }
  ]
}
```

`lang` is not optional and is not guessed. Leave it out and the call is rejected, which is deliberate: a word captured under the wrong language is worse than a word not captured.

## What came back

```json
{
  "ok": true,
  "data": {
    "items": [
      { "word": "curtail",   "created": true, "flashcard_id": 25392, "folder_id": 3520, "folder_created": true,  "answer_id": 12261, "next_review_at": "2026-09-07T15:39:41.828Z" },
      { "word": "windfall",  "created": true, "flashcard_id": 25393, "folder_id": 3520, "folder_created": false, "answer_id": 12262, "next_review_at": "2026-09-07T15:39:41.828Z" },
      { "word": "attrition", "created": true, "flashcard_id": 25394, "folder_id": 3520, "folder_created": false, "answer_id": 12263, "next_review_at": "2026-09-07T15:39:41.828Z" },
      { "word": "brittle",   "created": true, "flashcard_id": 25395, "folder_id": 3520, "folder_created": false, "answer_id": 12264, "next_review_at": "2026-09-07T15:39:41.828Z" }
    ],
    "captured_count": 4,
    "skipped_count": 0,
    "untranslatable_count": 0,
    "note": "Captured 4 new word(s), skipped 0, total processed 4."
  }
}
```

## Three details in that response worth reading

`next_review_at` equals the capture timestamp. The card is due the instant it exists, so it turns up in the next review session rather than waiting for a nightly job to notice it.

`folder_created: true` on the first item and `false` on the rest. That is folder 3520, Chat Discoveries, being created once and then reused. Everything from this connector lands there, so a month of chatting does not scatter itself through your deck.

`answer_id` alongside `flashcard_id`. The card is one row and the encounter is another; recipe 06 depends on the second one existing.

## Variations that work

```
I am going to paste four paragraphs of a German news article.
Explain the hard parts at my level, and capture the vocabulary
I would need to read this paper regularly.
```

```
Let's do kitchen French. Capture anything I would need to follow a recipe.
```

```
What have you captured today, and why those words?
```

The last one is answered from `get_recent_activity`, not from the assistant's memory of the conversation, so it stays correct after a context window rolls over.
