# 03. Which of these words are actually new

**Recorded 2026-09-07.** Raw JSON: [`../transcripts/2026-09-07-check-words.json`](../transcripts/2026-09-07-check-words.json)

An assistant glossing every unusual word in a paragraph is exhausting by the third paragraph, because most of those words are ones you learned last spring. `check_words` answers the only question that matters before glossing or capturing: which of these does this person not have yet.

## Prompt

You do not usually type this one. It runs on its own inside recipe 01, ahead of any capture. Trigger it directly like this:

```
Here is a paragraph. Before you explain anything, check which of these words
are already in my MindDory deck: beneath, draining, curtail, windfall,
attrition, brittle.
```

## Request

```json
{
  "words": ["beneath", "draining", "curtail", "windfall", "attrition", "brittle"],
  "lang": "en"
}
```

Up to 50 words per call. One round trip for the whole paragraph beats calling `get_card` in a loop, which is what the tool description tells the model in as many words.

## What came back

```json
{
  "ok": true,
  "data": {
    "lang": "en",
    "lang_defaulted": false,
    "skipped": [],
    "words": [
      { "word": "beneath",   "in_deck": true,  "mastery": "mastered",    "translation": "pod",           "next_review_at": "2026-04-15T09:13:17.247Z", "due": true },
      { "word": "draining",  "in_deck": true,  "mastery": "mastered",    "translation": "vyčerpávající", "next_review_at": "2026-04-15T09:13:17.247Z", "due": true },
      { "word": "curtail",   "in_deck": false, "mastery": "not_in_deck" },
      { "word": "windfall",  "in_deck": false, "mastery": "not_in_deck" },
      { "word": "attrition", "in_deck": false, "mastery": "not_in_deck" },
      { "word": "brittle",   "in_deck": false, "mastery": "not_in_deck" }
    ],
    "not_in_deck": ["curtail", "windfall", "attrition", "brittle"],
    "known": ["beneath", "draining"],
    "struggling": []
  }
}
```

## Why the three pre-sorted lists exist

The server could have handed back `words` and left the sorting to the model. It does the sort itself because each list maps to a different action, and a model that has to derive them tends to get one of them wrong under load.

`not_in_deck` is what to gloss and capture. `known` is what to leave alone, and it is why `beneath` and `draining` never reached the capture call in recipe 01 even though both are perfectly good B2 words. `struggling` is the interesting one and it was empty here: a word you are currently failing, showing up in ordinary conversation, is worth a sentence of attention right then rather than in tomorrow's review.

`mastered` on both known words, while `due: true` on both, is not a contradiction. Mastery is how well you have answered the card historically; due is whether the clock has run out. This account has answered `beneath` correctly for months and still owes it a review since April.

`skipped` catches blanks and duplicates and tells you which entry a duplicate was answered under, so a sloppy word list does not silently lose an item.
